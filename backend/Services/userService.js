const db = require('../configs/db');

class UserService {
    constructor() {

    }
    
    async createUser(userData) { 
        const { name, mail, password } = userData;
        
        try {
            const query = 'INSERT INTO user.users (name, mail, password) VALUES (?, ?, ?)';
            const [result] = await db.execute(query, [name, mail, password]);
            
            return {
                id: result.insertId,
                name,
                mail
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('A user with this email already exists.');
            }
            console.error('Error creating user:', error);
            throw error; 
        }
    }
    
    async getUserByMail(mail) {
        try {
            const query = 'SELECT * FROM user.users WHERE mail = ?';
            const [rows] = await db.execute(query, [mail]);
            return rows[0];
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }
    
    deleteUser() { }
    async updateUser(id, updateData) {
        const { name, mail } = updateData;
        try {
            const query = 'UPDATE user.users SET name = ?, mail = ? WHERE id = ?';
            await db.execute(query, [name, mail, id]);
            
            return { id, name, mail };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('A user with this email already exists.');
            }
            console.error('Error updating user:', error);
            throw error;
        }
    }
}

module.exports = new UserService();