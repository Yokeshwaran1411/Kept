const db = require('../configs/db');

class SubscriptionModel {
    async create({ ctid, type, name, amount, renewal_date, method, method_details }) {
        try {
            const query = `INSERT INTO subscriptions.subscriptions
                (ctid, type, name, amount, renewal_date, method, method_details)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const [result] = await db.execute(query, [ctid, type, name, amount || null, renewal_date || null, method || null, method_details || null]);
            return { id: result.insertId, ctid, type, name, amount, renewal_date, method, method_details };
        } catch (error) { throw error; }
    }

    async findByCtid(ctid) {
        try {
            const query = 'SELECT * FROM subscriptions.subscriptions WHERE ctid = ? ORDER BY created_at DESC';
            const [rows] = await db.execute(query, [ctid]);
            return rows;
        } catch (error) { throw error; }
    }

    async update(id, { type, name, amount, renewal_date, method, method_details }) {
        try {
            const query = `UPDATE subscriptions.subscriptions
                SET type = ?, name = ?, amount = ?, renewal_date = ?, method = ?, method_details = ?
                WHERE id = ?`;
            await db.execute(query, [type, name, amount || null, renewal_date || null, method || null, method_details || null, id]);
            return { id, type, name, amount, renewal_date, method, method_details };
        } catch (error) { throw error; }
    }

    async delete(id) {
        try {
            await db.execute('DELETE FROM subscriptions.subscriptions WHERE id = ?', [id]);
            return true;
        } catch (error) { throw error; }
    }
}

module.exports = new SubscriptionModel();
