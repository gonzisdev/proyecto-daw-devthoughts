import { Like } from "../models/Like.js";

export class likeController{

    static addLike = async (req, res) => {
        // Creamos nueva instancia de like con los datos de la solicitud
        const like = new Like(req.body);
        // Asignamos el id del usuario que realiza la peticion
        like.user_id = req.user.id;
        // Obtenemos fecha y hora y se la asginamos al like
        const date = new Date();
        const currentDate = date.toISOString();
        like.like_date = currentDate;
    
        try {
            const newLike = await Like.addLike(like.user_id, like.post_id, like.like_date);
            // Devolvemos en formato json
            res.status(201).json(newLike);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    };
    
    static removeLike = async (req, res) => {
        // Obtenemos el id del post via body y del usuario que realiza la peticion
        const post_id = req.body.post_id;
        const user_id = req.user.id;
    
        try {
            const removeLike = await Like.removeLike(user_id, post_id);
            res.status(200).json(removeLike);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    };
};
