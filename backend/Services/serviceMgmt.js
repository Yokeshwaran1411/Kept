const db = require('../configs/db');

class ServiceMgmt {
    async checkDatabaseConnection() {
        try {
            await db.query('SELECT 1');
            return true;
        } catch (err) {
            console.error('Database connection error:', err);
            return false;
        }
    }
}

module.exports = new ServiceMgmt();