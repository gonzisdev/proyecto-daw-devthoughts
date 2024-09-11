import { db } from "../config/db.js";

export class User {
	static table = "users";

	constructor({
		id,
		name,
		surname,
		password,
		email,
		nick,
		unique_code,
		description,
		image,
		register_date,
	}) {
		this.id = id;
		this.name = name;
		this.surname = surname;
		this.password = password;
		this.email = email;
		this.nick = nick;
		this.unique_code = unique_code;
		this.description = description;
		this.image = image;
		this.register_date = register_date;
	};

	static async existsEmail(email) {
		try {
			const query = `SELECT email FROM ${this.table} WHERE email = ?`;
			const result = await db.query(query, [email]);
			// Retorna un booleano
			return result[0].length > 0;
		} catch (error) {
			console.error("Error fetching user by email:", error);
			throw error;
		};
	};

	static async existsNick(nick) {
		try {
			const query = `SELECT nick FROM ${this.table} WHERE nick = ?`;
			const result = await db.query(query, [nick]);
			// Retorna un booleano
			return result[0].length > 0;
		} catch (error) {
			console.error("Error fetching user by nick:", error);
			throw error;
		};
	};

	static async createUser(user) {
		try {
			const query = `
                INSERT INTO ${this.table}
                (name, surname, password, email, nick, unique_code, register_date)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
			const result = await db.query(query, [
				user.name,
				user.surname,
				user.password,
				user.email,
				user.nick,
				user.unique_code,
				user.register_date,
			]);
			// Verifica si el insert fue exitoso y devolvemos el usuario
			if (result[0].affectedRows > 0) {
				const newUser = await this.getUserByEmail(user.email);
				return newUser;
			} else {
				return null;
			};
		} catch (error) {
			console.error("Error creating user:", error);
			throw error;
		};
	};

	static async getUserByEmail(email) {
		try {
			const query = `
				SELECT 
					u.id, u.name, u.surname, u.email, u.nick, u.password, u.unique_code, u.description, u.image, u.register_date,
					(
						SELECT COUNT(*) 
						FROM followers 
						WHERE user_id_followed = u.id
					) AS followers_count,
					(
						SELECT COUNT(*) 
						FROM followers 
						WHERE user_id_follower = u.id
					) AS following_count
				FROM ${this.table} u 
				WHERE u.email = ?`;
			const result = await db.query(query, [email]);
			return result[0][0];
		} catch (error) {
			console.error("Error fetching user by email:", error);
			throw error;
		};
	};

	static async getUserById(id) {
		try {
			const query = `
				SELECT 
					u.id, u.name, u.surname, u.email, u.nick, u.description, u.image, u.register_date,
					(
						SELECT COUNT(*) 
						FROM followers 
						WHERE user_id_followed = u.id
					) AS followers_count,
					(
						SELECT COUNT(*) 
						FROM followers 
						WHERE user_id_follower = u.id
					) AS following_count
				FROM users u 
				WHERE u.id = ?`;
			const result = await db.query(query, [id]);
			return result[0][0];
		} catch (error) {
			console.error("Error fetching user by id:", error);
			throw error;
		};
	};

	static async changePassword(password, unique_code) {
		try {
			const query = `UPDATE ${this.table} SET password = ? WHERE unique_code = ?`;
			await db.query(query, [password, unique_code]);
		} catch (error) {
			console.error("Error updating user password:", error);
			throw error;
		};
	};

	static async updateProfile(user_id, newData) {
		try {
			const { nick, description, image } = newData;
			let query = `UPDATE ${this.table} SET nick = ?, description = ?`;
			let params = [nick, description];
			// Comprobamos si se proporciona imagen para añadirla o no al array
			if (image) {
				query += `, image = ?`;
				params.push(image);
			};
			// Completamos la consulta
			query += ` WHERE id = ?`;
			params.push(user_id); 
			const result = await db.query(query, params);
			if (result.affectedRows === 0) {
				throw new Error("Usuario no encontrado");
			};
			// Despues de actualizar devolvemos el usuario haciendo una consulta por su ID
			const updatedUser = await this.getUserById(user_id);
			return updatedUser;
		} catch (error) {
			console.error("Error updating user profile:", error);
			throw error;
		};
	};

	static async deleteUserById(id) {
		try {
			const query = `DELETE FROM ${this.table} WHERE id = ?`;
			await db.query(query, [id]);
		} catch (error) {
			console.error("Error deleting user:", error);
			throw error;
		};
	};
	
	static async searchUsers(searchTerm) {
		try {
			// Buscamos usuario por nick, apellido o nombre
			const query = `
                SELECT id, name, surname, nick, description, image
                FROM ${this.table}
                WHERE nick LIKE ? OR surname LIKE ? or name LIKE ?
            `;
			const result = await db.query(query, [
				`%${searchTerm}%`,
				`%${searchTerm}%`,
				`%${searchTerm}%`,
			]);
			return result[0];
		} catch (error) {
			console.error("Error searching users:", error);
			throw error;
		};
	};
};