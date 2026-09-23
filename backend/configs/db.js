require('dotenv').config();
const mysql = require('mysql2/promise');

// Create a connection pool using the connection string from the .env file
const pool = mysql.createPool(process.env.DATABASE_URL);

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
