const db = require('../configs/db');

class UserModel {
    async create({ name, mail, password }) {
        try {
            const query = 'INSERT INTO user.users (name, mail, password) VALUES (?, ?, ?)';
            const [result] = await db.execute(query, [name, mail, password]);
            return { id: result.insertId, name, mail };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('A user with this email already exists.');
            }
            throw error;
        }
    }

    async findByMail(mail) {
        try {
            const query = 'SELECT * FROM user.users WHERE mail = ?';
            const [rows] = await db.execute(query, [mail]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    async update(id, { name, mail }) {
        try {
            const query = 'UPDATE user.users SET name = ?, mail = ? WHERE id = ?';
            await db.execute(query, [name, mail, id]);
            return { id, name, mail };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('A user with this email already exists.');
            }
            throw error;
        }
    }
}

module.exports = new UserModel();
