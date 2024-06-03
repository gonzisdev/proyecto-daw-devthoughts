import { db } from "../config/db.js";

export class Like {
    static table = "likes";

    constructor({ id, user_id, post_id, like_date }) {
        this.id = id;
        this.user_id = user_id;
        this.post_id = post_id;
        this.like_date = like_date;
    };

    static async addLike(user_id, post_id, like_date) {
        try {
            // Prepara la fecha en el formato adecuado para la base de datos
            const like_date = new Date().toISOString().slice(0, 19).replace('T', ' '); 
            const query = `INSERT INTO ${this.table} (user_id, post_id, like_date) VALUES (?, ?, ?)`;
            // Ejecutamos 
            await db.query(query, [user_id, post_id, like_date]);
            // Query para seleccionar el post actualizado con la cantidad de 'likes' y comentarios
            const post = `
                SELECT 
                    p.*, 
                    u.id AS user_id, 
                    u.nick, 
                    u.image, 
                    (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS num_likes,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS num_comments,
                    GROUP_CONCAT(DISTINCT ul.nick SEPARATOR ', ') AS liked_by
                FROM 
                    posts p
                LEFT JOIN 
                    users u ON p.user_id = u.id
                LEFT JOIN 
                    likes l ON p.id = l.post_id
                LEFT JOIN 
                    comments c ON p.id = c.post_id
                LEFT JOIN 
                    users ul ON l.user_id = ul.id
                WHERE 
                    p.id = ?
                GROUP BY 
                    p.id
                ORDER BY 
                    p.id DESC
            `;
            // Ejecutamos la query 
            const result = await db.query(post, [post_id]);
            // Devolvemos el primer resultado de la query (el post actualizado)
            return result[0][0];
        } catch (error) {
            console.error("Error adding like:", error);
            throw error; 
        };
    };

    static async removeLike(user_id, post_id) {
        try {
            // Eliminamos el like de un post y usuario en concreto
            const query = `DELETE FROM ${this.table} WHERE user_id = ? AND post_id = ?`;
            await db.query(query, [user_id, post_id]);
            // Query para seleccionar el post actualizado con la cantidad de 'likes' y comentarios
            const post = `
                SELECT 
                    p.*, 
                    u.id AS user_id, 
                    u.nick, 
                    u.image, 
                    (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS num_likes,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS num_comments,
                    GROUP_CONCAT(DISTINCT ul.nick SEPARATOR ', ') AS liked_by
                FROM 
                    posts p
                LEFT JOIN 
                    users u ON p.user_id = u.id
                LEFT JOIN 
                    likes l ON p.id = l.post_id
                LEFT JOIN 
                    comments c ON p.id = c.post_id
                LEFT JOIN 
                    users ul ON l.user_id = ul.id
                WHERE 
                    p.id = ${post_id}
                GROUP BY 
                    p.id
                ORDER BY 
                    p.id DESC
            `;
            // Ejecutamos
            const result = await db.query(post, [post_id]);
            // Devolvemos el primer resultado de la query, que es el post actualizado
            return result[0][0];
        } catch (error) {
            console.error("Error removing like:", error);
            throw error; 
        };
    };
};
