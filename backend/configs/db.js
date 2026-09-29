require('dotenv').config();
const mysql = require('mysql2/promise');

const databaseUrl = process.env.DATABASE_URL || '';

const pool = mysql.createPool(databaseUrl);

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to the MySQL database.');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

module.exports = pool;
