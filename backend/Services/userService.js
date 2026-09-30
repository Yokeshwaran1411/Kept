const db = require('../configs/db');

class UserService {
    constructor() {
        this.tablesInitialized = false;
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

    async recordLoginHistory(loginInfo) {
        try {
            const query = 'INSERT INTO user.user_login_history (login_info) VALUES (?)';
            const infoStr = typeof loginInfo === 'object' ? JSON.stringify(loginInfo) : loginInfo;
            const [result] = await db.execute(query, [infoStr]);
            return { id: result.insertId };
        } catch (error) {
            console.error('Error recording login history:', error);
            throw error;
        }
    }

    async getLoginHistory(mail) {
        // await this.ensureTablesExist();
        try {
            const query = 'SELECT * FROM user.user_login_history ORDER BY id DESC';
            const [rows] = await db.query(query);

            const parsedRows = rows.map(row => {
                let parsedInfo = null;
                try {
                    parsedInfo = typeof row.login_info === 'string' ? JSON.parse(row.login_info) : row.login_info;
                } catch (e) {
                    parsedInfo = row.login_info;
                }
                return {
                    id: row.id,
                    login_info: row.login_info,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    parsed_info: parsedInfo
                };
            });

            if (mail) {
                return parsedRows.filter(row => {
                    if (row.parsed_info && typeof row.parsed_info === 'object') {
                        return !row.parsed_info.userMail || row.parsed_info.userMail === mail;
                    }
                    return true;
                });
            }

            return parsedRows;
        } catch (error) {
            console.error('Error fetching login history:', error);
            throw error;
        }
    }
}

module.exports = new UserService();