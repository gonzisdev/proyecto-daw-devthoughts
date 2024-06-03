import { Follower } from "../models/Follower.js";

export class followerController{

    static getFollowersAndFollowingById = async (req, res) => {
        // Obtenemos el id de los params
        const id = req.params.id;
        try {
            // Llamamos al metodo del modelo
            const followersFollowing = await Follower.getFollowersAndFollowingById(id);
            // Devolvemos la lista en json
            res.status(200).json(followersFollowing);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" });
        };
    };
    
    static getFollowers = async (req, res) => {
        const id = req.params.id;
        try {
            const followers = await Follower.getFollowers(id);
            res.status(200).json(followers);
        } catch (error) {
            console.log(error);   
            res.status(500).json({ error: "Error interno del servidor" });
        };
    };
    
    static getFollowing = async (req, res) => {
        const id = req.params.id;
        try {
            const following = await Follower.getFollowing(id);
            res.status(200).json(following);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" });
        };
    };
    
    static follow = async(req, res) => {
       // Obtenemos el ID del usuario que sigue y realiza la peticion (el usuario actual)
       const follower_id = req.user.id;
       // Obtenemos el ID del usuario que va a ser seguido del body de la peticion
       const followed_id = req.body.id;
        try {
            const follower = await Follower.addFollow(follower_id, followed_id);
            res.status(201).json(follower);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" });
        };
    };
    
    static unfollow = async(req, res) => {
        const follower_id = req.user.id;
        const followed_id = req.body.id;
        try {
            const follower = await Follower.removeFollow(follower_id, followed_id)
            res.status(200).json(follower);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error interno del servidor" });
        };
    };
};
