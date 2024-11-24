import { Comment } from "../models/Comment.js";

export class commentController{

    static createComment = async (req, res) => {
        // Creamos una instancia de comment con los datos de la solicitud
        const comment = new Comment(req.body);
        // Se asigna el ID del usuario de la solicitud al comentario
        comment.user_id = req.user.id;
        try {
            // Creamos el comentario utilizando el metodo del modelo
            const newComment = await Comment.createComment(comment);
            // Devolvemos el comment en formato JSON 
            res.status(201).json(newComment);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    };
    
    static removeComment = async (req, res) => {
        // Obtenemos el ID del comentario a eliminar del body del request
        const id = req.body.id;
        try {
            // Eliminamos con el metodo del modelo
            const removeComment = await Comment.removeComment(id);
            // Devolvemos mensaje 
            res.status(200).json({ msg: "Respuesta eliminada correctamente", removeComment });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    };
};
