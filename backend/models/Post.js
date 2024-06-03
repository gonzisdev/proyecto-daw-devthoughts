import { db } from "../config/db.js";

export class Post {
	static table = "posts";

	constructor({ id, user_id, post, post_date }) {
		this.id = id;
		this.user_id = user_id;
		this.post = post;
		this.post_date = post_date;
	};

    static async getAllPosts(page = 1, limit = 10) {
    // Calculamos el offset basado en la pagina y el limite por pagina.
    const offset = (page - 1) * limit;
        try {
            const queryPosts = `
                SELECT 
                    p.*, 
                    u.id AS user_id, 
                    u.nick, 
                    u.image, 
                    (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS num_likes,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS num_comments,
                    GROUP_CONCAT(DISTINCT ul.nick SEPARATOR ', ') AS liked_by
                FROM 
                    ${this.table} p
                LEFT JOIN 
                    users u ON p.user_id = u.id
                LEFT JOIN 
                    likes l ON p.id = l.post_id
                LEFT JOIN 
                    users ul ON l.user_id = ul.id
                GROUP BY 
                    p.id
                ORDER BY 
                    p.id DESC
                LIMIT ?
                OFFSET ?
            `;
            const [posts] = await db.query(queryPosts, [limit, offset]);
            // Consulta adicional para obtener el total de publicaciones en la base de datos
            const queryTotal = `SELECT COUNT(*) AS total FROM ${this.table}`;
            const [totalResult] = await db.query(queryTotal);
            const total = totalResult[0].total;
            // Retorna las publicaciones y el total de estas.
            return { posts, total };
        } catch (error) {
            console.error("Error fetching all posts:", error);
            throw error;
        };
    };

    static async getPostById(id) {
        try {
            const postQuery = `
                SELECT 
                    p.*, 
                    u.id AS user_id, 
                    u.nick, 
                    u.image,
                    (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS num_likes,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS num_comments,
                    GROUP_CONCAT(DISTINCT ul.nick SEPARATOR ', ') AS liked_by
                FROM 
                    ${this.table} p
                LEFT JOIN 
                    users u ON p.user_id = u.id
                LEFT JOIN 
                    likes l ON p.id = l.post_id
                LEFT JOIN 
                    users ul ON l.user_id = ul.id
                WHERE 
                    p.id = ?
                GROUP BY
                    p.id;
            `;
            const postResult = await db.query(postQuery, [id]);
            const post = postResult[0][0];
            // Consulta adicional para obtener los comentarios
            const commentsQuery = `
                SELECT 
                    c.id,
                    c.comment,
                    c.user_id,
                    c.comment_date,
                    u.nick AS user_nick,
                    u.image AS user_image
                FROM 
                    comments c
                LEFT JOIN 
                    users u ON c.user_id = u.id
                WHERE 
                    c.post_id = ?
                    ORDER BY c.comment_date DESC;
            `;
            const commentsResult = await db.query(commentsQuery, [id]);
            const comments = commentsResult[0];
            // Agrega los comentarios al objeto de la publicacion
            post.comments = comments;

            return post;
        } catch (error) {
            console.error("Error fetching post by id:", error);
            throw error;
        };
    };


	static async createPost(post) {
		try {
			const query = `
                INSERT INTO ${this.table}
                (user_id, post, post_date)
                VALUES (?, ?, ?)
            `;
			const result = await db.query(query, [
				post.user_id,
				post.post,
				post.post_date,
			]);
            // Verifica si el insert fue exitoso y entonces recupera el nuevo post
			if (result[0].affectedRows > 0) {
				const selectQuery = `
                    SELECT 
                        p.*, 
                        u.id AS user_id, 
                        u.nick, 
                        u.image,
                        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS num_likes,
                        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS num_comments,
                        GROUP_CONCAT(DISTINCT ul.nick SEPARATOR ', ') AS liked_by
                    FROM 
                        ${this.table} p
                    LEFT JOIN 
                        users u ON p.user_id = u.id
                    LEFT JOIN 
                        likes l ON p.id = l.post_id
                    LEFT JOIN 
                        users ul ON l.user_id = ul.id
                    WHERE 
                        p.id = ?
                    GROUP BY 
                        p.id
                    ORDER BY 
                        p.id DESC
                `;
				const newPostResult = await db.query(selectQuery, [result[0].insertId]);
				const newPost = newPostResult[0][0];
				return newPost;
			} else {
				return null;
			};
		} catch (error) {
			console.error("Error creating post:", error);
			throw error;
		};
	};

	static async removePost(id, user_id) {
		try {
            // Primero, eliminamos los me gusta asociados para mantener la integridad referencial
			await db.query("DELETE FROM likes WHERE post_id = ?", [id]);
            // Despues eliminamos el post
			const query = `
                DELETE FROM ${this.table} WHERE id = ? AND user_id = ?
            `;
			const result = await db.query(query, [id, user_id]);
            // Verifica si la eliminación fue exitosa y devolvemos todas las publicaciones actualizadas.
			if (result[0].affectedRows > 0) {
				const allPosts = await this.getAllPosts();
				return allPosts;
			};
		} catch (error) {
			console.error("Error removing post:", error);
			throw error;
		};
	};

    static async getLikedPosts(id, page = 1, limit = 10) {
        // Calculamos el offset para la paginacion
        const offset = (page - 1) * limit;
        try {
            const query = `
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
                    users ul ON l.user_id = ul.id
                WHERE 
                    l.user_id = ?
                GROUP BY 
                    p.id
                ORDER BY 
                    p.id DESC
                LIMIT ?
                OFFSET ?
            `;
            const result = await db.query(query, [id, limit, offset]);
            return result[0];
        } catch (error) {
            console.error("Error fetching liked posts by id:", error);
            throw error;
        };
    };

    static async getProfilePosts(id, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        try {
            const query = `
                SELECT 
                    p.*, 
                    u.id AS user_id, 
                    u.nick, 
                    u.image, 
                    COUNT(DISTINCT l.user_id) AS num_likes, 
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS num_comments,
                    GROUP_CONCAT(DISTINCT ul.nick SEPARATOR ', ') AS liked_by
                FROM 
                    ${this.table} p
                LEFT JOIN 
                    users u ON p.user_id = u.id
                LEFT JOIN 
                    likes l ON p.id = l.post_id
                LEFT JOIN 
                    users ul ON l.user_id = ul.id
                WHERE 
                    p.user_id = ?
                GROUP BY 
                    p.id
                ORDER BY 
                    p.id DESC
                LIMIT ?
                OFFSET ?
            `;
            const result = await db.query(query, [id, limit, offset]);
            return result[0];
        } catch (error) {
            console.error("Error fetching profile posts:", error);
            throw error;
        };
    };
    
    static async getFollowingPosts(id, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        try {
            const query = `
                SELECT 
                    p.*, 
                    u.id AS user_id, 
                    u.nick, 
                    u.image, 
                    (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS num_likes,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS num_comments,
                    GROUP_CONCAT(DISTINCT ul.nick SEPARATOR ', ') AS liked_by
                FROM 
                    ${this.table} p
                LEFT JOIN 
                    users u ON p.user_id = u.id
                LEFT JOIN 
                    likes l ON p.id = l.post_id
                LEFT JOIN 
                    users ul ON l.user_id = ul.id
                LEFT JOIN 
                    followers f ON u.id = f.user_id_followed
                WHERE 
                    f.user_id_follower = ?
                GROUP BY 
                    p.id
                ORDER BY 
                    p.id DESC
                LIMIT ?
                OFFSET ?
            `;
            const result = await db.query(query, [id, limit, offset]);
            return result[0];
        } catch (error) {
            console.error("Error fetching following posts:", error);
            throw error;
        };
    };
};

