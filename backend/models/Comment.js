import { db } from "../config/db.js";

export class Comment {
    static table = "comments";

    constructor({ id, user_id, post_id, comment, comment_date }) {
        this.id = id;
        this.user_id = user_id;
        this.post_id = post_id;
        this.comment = comment;
        this.comment_date = comment_date;
    };

    static async createComment(comment) {
        try {
            // Preparamos la consulta SQL 
            const query = `
                INSERT INTO ${this.table}
                (user_id, post_id, comment, comment_date)
                VALUES (?, ?, ?, NOW())`;
            // Ejecutamos
            const result = await db.query(query, [comment.user_id, comment.post_id, comment.comment, comment.comment_date]);
            // Retorna el resultado 
            return result[0];
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error;
        };
    };

    static async removeComment(id) {
        try {
            // Preparamos la consulta 
            const query = `DELETE FROM ${this.table} WHERE id = ?`;
            // Ejecutamos
            const result = await db.query(query, [id]);
            // Verificamos si la fila fue eliminada y retornamos el resultado
            return result.affectedRows === 1
        } catch (error) {
            console.error("Error removing comment:", error);
            throw error;
        };
    };
};
