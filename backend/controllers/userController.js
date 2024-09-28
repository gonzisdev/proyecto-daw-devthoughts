import { User } from "../models/User.js";
import { generateUniqueId } from "../helpers/generateUniqueId.js";
import { createJWT }from "../helpers/createJWT.js";
import bcrypt from "bcrypt";

export class userController{

    static signUp = async (req, res) => {
        // Extraemos email y nick del body y verificamos que no existan esos usuarios
        const { email, nick } = req.body;
        const existsUserEmail = await User.existsEmail(email);
        if (existsUserEmail) {
            const error = new Error('Ya existe un usuario con el mismo email');
            return res.status(400).json({msg: error.message});
        };
        const existsUserNick = await User.existsNick(nick);
        if (existsUserNick) {
            const error = new Error('Ya existe un usuario con el mismo nick');
            return res.status(400).json({msg: error.message});
        };
        try {
            const usuario = new User(req.body);
            usuario.unique_code = generateUniqueId(); // Generamos un id unico con nuestra funcion helper
            // Añadimos la fecha y la formateamos y quitamos la parte del tiempo
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
            usuario.register_date = formattedDate;
            // Hasheamos la contraseña con ayuda de bcrypt
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
            await User.createUser(usuario);
            res.status(201).json({msg: 'Usuario creado correctamente', code: usuario.unique_code}); // Devolvemos tambien el codigo unico para que el usuario lo copie y pueda recuperar contraseña
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    };
    
    static logIn = async (req, res) => {
        const { email, password } = req.body;
        try {
            const existsUser = await User.existsEmail(email);
    
            if (!existsUser) {
                const error = new Error('Este usuario no está registrado');
                return res.status(400).json({ msg: error.message });
            };
            const user = await User.getUserByEmail(email);
            // Comprobamos contraseña introducida con la contraseña de la bbdd
            const checkPass = async function (inputPassword) {
                return await bcrypt.compare(inputPassword, user.password);
            };
            const isPasswordCorrect = await checkPass(password);
            if (isPasswordCorrect) {
                res.status(200).json({
                    id: user.id,
                    nick: user.nick,
                    token: createJWT(user.id), // Creamos token al iniciar sesion
                    image: user.image,
                    description: user.description
                });
            } else {
                const error = new Error('La contraseña es incorrecta');
                return res.status(403).json({ msg: error.message });
            };
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    };
    
    static forgotPassword = async (req, res) => {
        const { email, unique_code, password } = req.body;
        const existsUser = await User.existsEmail(email); // Comprobamos que el usuario exista
        if (!existsUser) {
            const error = new Error('Este usuario no está registrado');
            return res.status(400).json({ msg: error.message });
        };
        // Hasheamos la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.getUserByEmail(email);
        // Si el codigo unico introducido no coincide con el de la BBDD impedimos el cambio de pass y le enviamos un mensaje al usuario
        if (unique_code.toString() !== user.unique_code) {
            const error = new Error('El código de seguridad no es válido');
            return res.status(400).json({ msg: error.message });
        };
        // Si pasa la validacion hacemos el cambio de contraseña
        if (email === user.email && unique_code.toString() === user.unique_code) {
            try {
                await User.changePassword(hashedPassword, unique_code);
                res.status(201).json({msg: 'Contraseña actualizada correctamente'});
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: "Error interno del servidor" }); 
            };
        };
    };
    
    static getUserById = async (req, res)=>{
        const { id } = req.params; // Obtenemos el id de los params 
        try {
            const existsUser = await User.getUserById(id);
            if (!existsUser) {
                const error = new Error('Este usuario no existe');
                return res.status(400).json({ msg: error.message });
            };
            const user = await User.getUserById(id);    
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    };
     
    static updateProfile = async (req, res) => {
        const user_id = req.user.id;
        const params_id = req.params.id;
        // El ID del usuario que realiza la peticion tiene que coincidir con los params 
        if (user_id !== parseInt(params_id)) {
            const error = new Error('Usuario no autorizado');
            return res.status(401).json({ msg: error.message });
        };
        try {
            const { nick, description } = req.body;
            const image = req.file;
            if (nick) {
                // Comprobamos que el nuevo nick no este en uso por otro usuario que no sea el que realiza la peticion
                const exists = await User.existsNick(nick);
                if (exists && nick !== req.user.nick) {
                    return res.status(400).json({ msg: 'El nick solicitado ya está en uso' });
                };
            };
            const newData = {
                nick,
                description,
                ...(req.file && { image: image.filename }) // Si existe la imagen la añadimos
            };
            const result = await User.updateProfile(user_id, newData);
            res.status(201).json({ msg: "Perfil actualizado correctamente", result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    };  

    static deleteUser = async (req, res) => {
        const { id } = req.body
        try {
            await User.deleteUserById(id);
            res.status(200).json({ msg: "Usuario eliminado correctamente"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    };
    
    static searchUser = async (req, res) => {
        // Obtenemos el termino de busqueda del body del request
        const { term } = req.body;
        try {
            const searchResults = await User.searchUsers(term);
    
            if (searchResults.length === 0) {
                // Si no hay resultados mandamos un json con un msg
                return res.status(404).json({ msg: 'No se encontraron usuarios con el término de búsqueda proporcionado' });
            }
            res.status(200).json(searchResults);
        } catch (error) {
            console.error('Error searching users:', error);
            res.status(500).json({ msg: 'Error interno del servidor' });
        };
    };
    
    static profile = async (req, res)=>{
        // Obtenemos el perfil de usuario. Si un usuario tiene un jwt activo y valido al entrar en la 
        // app, el useEffect de authcontext lo comprobara junto con el middleware checkauth y devolveremos el usuario de la peticion
        // para establecerlo en el estado de auth del context authcontext. Sera un autologin mientras
        // no expire el token o no tenga el token valido en localstorage
        const { user } = req;
        res.status(200).json(user);
    };
};