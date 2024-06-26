import { Post } from "../models/Post.js";

export class postController{

    static getAllPosts = async (req, res) => {
        // Obtenemos el numero de paginas. Si no se proporciona establecemos 1 por defecto
        const { page = 1 } = req.query; 
        const limit = 10; 
        try {
            // Se obtienen los posts usando el num de paginas y el limite
            const posts = await Post.getAllPosts(parseInt(page), limit);
            // Devolvemos en json
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    };
    
    static getPostById = async(req,res) => {
        // Obtenemos el id de la peticion
        const id = req.params.id;
        try {
            const result = await Post.getPostById(id);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    };
    
    static createPost = async(req, res) => {
        // Creamos una nueva instancia de post con los datos del request
        const post = new Post(req.body);
        // Se asigna el ID del usuario que hizo la peticion como autor del post
        post.user_id = req.user.id;
        // Obtener la fecha y hora actual en UTC
        const currentDateUTC = new Date();
        const currentMonth = currentDateUTC.getMonth() + 1;    
        // Determinamos el desfase horario segun invierno o verano
        let timezoneOffset = 60; // Por defecto, horario de invierno (UTC+1)
        if (currentMonth >= 4 && currentMonth <= 9) {
            // Si el mes actual está entre abril y septiembre, es horario de verano (UTC+2)
            timezoneOffset = 120;
        }
        const currentDateSpain = new Date(currentDateUTC.getTime() + timezoneOffset * 60000); 
        const isoDateString = currentDateSpain.toISOString(); 
        // Asignar la fecha y hora 
        post.post_date = isoDateString;
            try {
                const newPost = await Post.createPost(post);
                // Devolvemos el post en json
                res.status(201).json(newPost);
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: "Error interno del servidor" }); 
            };
        };
    
    static removePost = async(req, res) => {
        // Obtenemos el id del post via body y el id del usuario que hizo la peticion
        const id = req.body.id;
        const user_id = req.user.id;
        try {
            const removePost = await Post.removePost(id, user_id);
            res.status(200).json(removePost);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    };
    
    static getLikedPosts = async(req, res) => {
        const { id } = req.user; 
        const { page = 1 } = req.body; 
        const limit = 10; 
        try {
            const getLikedPosts = await Post.getLikedPosts(id, page, limit);
            res.status(200).json(getLikedPosts)
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    };
    
    static getProfilePosts = async(req, res) => {
        const id = req.body.id;
        const { page = 1 } = req.body; 
        const limit = 10; 
        try {
            const getProfilePosts = await Post.getProfilePosts(id, page, limit);
            res.status(200).json(getProfilePosts)
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    };
    
    static getFollowingPosts = async (req, res) => {
        const { id } = req.user; 
        const { page = 1 } = req.body; 
        const limit = 10; 
        try {
            const posts = await Post.getFollowingPosts(id, page, limit);
            res.status(200).json(posts); 
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" }); 
        };
    }
};