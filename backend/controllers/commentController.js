import { Comment } from "../models/Comment.js";

export class commentController{

    static createComment = async (req, res) => {
        // Creamos una instancia de comment con los datos de la solicitud
        const comment = new Comment(req.body);
        // Se asigna el ID del usuario de la solicitud al comentario
        comment.user_id = req.user.id;
        // Asignamos fecha y hora actual al comentario
        const currentDateUTC = new Date();
        const currentMonth = currentDateUTC.getMonth() + 1; 
        // Determinar el desfase horario 
        let timezoneOffset = 60; // Horario de invierno (UTC+1)
        if (currentMonth >= 4 && currentMonth <= 9) {
            // Si el mes actual esta entre abril y septiembre, es horario de verano (UTC+2)
            timezoneOffset = 120;
        }
        const currentDateSpain = new Date(currentDateUTC.getTime() + timezoneOffset * 60000); // Convertir minutos a milisegundos
        const isoDateString = currentDateSpain.toISOString();
        comment.comment_date = isoDateString;
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
