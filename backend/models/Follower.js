import { db } from "../config/db.js";

export class Follower {
	static table = "followers";

	constructor({ id, user_id_follower, user_id_followed, following_date }) {
		this.id = id;
		this.user_id_follower = user_id_follower;
		this.user_id_followed = user_id_followed;
		this.following_date = following_date;
	};

	static async getFollowersAndFollowingById(id) {
        try {
            id = parseInt(id); // Nos aseguramos que el ID es un entero
            // Consulta SQL
            const query = `
                SELECT 
                    CASE 
                        WHEN user_id_follower = ? THEN user_id_followed
                        ELSE user_id_follower
                    END AS user_id,
                    CASE
                        WHEN user_id_follower = ? THEN 'follower'
                        ELSE 'following'
                    END AS relation
                FROM ${this.table} 
                WHERE (user_id_follower = ? OR user_id_followed = ?) AND 
                      (user_id_follower <> user_id_followed)
            `;
            // Ejecuta la consulta 
            const [rows] = await db.query(query, [id, id, id, id]);
            // Filtramos y organizamos los resultados en seguidores y seguidos
            const followers = [];
            const following = [];
            rows.forEach((row) => {
                if (row.relation === "follower") {
                    followers.push(row.user_id);
                } else {
                    following.push(row.user_id);
                };
            });
            // Eliminamos duplicados
            const uniqueFollowers = [...new Set(followers)];
            const uniqueFollowing = [...new Set(following)];
            // Retorna los resultados en un objeto
            return { followers: uniqueFollowers, following: uniqueFollowing };
        } catch (error) {
            console.error("Error fetching followers and followings:", error);
            throw error;
        };
    };

	static async getFollowing(user_id) {
		try {
			const query = `SELECT users.id, users.nick, users.image, users.description, following_date
				FROM ${this.table} 
				INNER JOIN users ON followers.user_id_followed = users.id
				WHERE followers.user_id_follower = ? ORDER BY following_date DESC`;
			const [following] = await db.query(query, [user_id]);
			return following;
		} catch (error) {
			console.error("Error fetching following users:", error);
			throw error;
		};
	};

	static async getFollowers(user_id) {
		try {
			const query = `SELECT users.id, users.nick, users.image, users.description, following_date
				FROM ${this.table} 
				INNER JOIN users ON followers.user_id_follower = users.id
				WHERE followers.user_id_followed = ? ORDER BY following_date DESC`;
			const [followers] = await db.query(query, [user_id]);
			return followers;
		} catch (error) {
			console.error("Error fetching followers:", error);
			throw error;
		};
	};

	static async addFollow(follower_id, followed_id) {
		try {
			const query = `INSERT INTO ${this.table} (user_id_follower, user_id_followed, following_date) VALUES (?, ?, NOW())`;
			const [result] = await db.query(query, [follower_id, followed_id]);
			return result.insertId;
		} catch (error) {
			console.error("Error adding follow:", error);
			throw error;
		};
	};

	static async removeFollow(follower_id, followed_id) {
		try {
			const query = `DELETE FROM ${this.table} WHERE user_id_follower = ? AND user_id_followed = ?`;
			const [result] = await db.query(query, [follower_id, followed_id]);
			return result.affectedRows > 0; // Devolvemos true o false segun si alguna fue afectada o no
		} catch (error) {
			console.error("Error removing follow:", error);
			throw error;
		};
	};
};
