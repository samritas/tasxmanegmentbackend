const mysql = require("mysql2/promise");
require('dotenv').config(); 
function Connection() {
this.pool = null;
this.init = function () {
  this.pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

    // Test the connection and create tables
    this.pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error connecting to the database:", err);
      } else {
        console.log("MySQL Connected...");

        // Create users table if not exists
        const createUsersTableQuery = `
                    CREATE TABLE IF NOT EXISTS users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(255) NOT NULL UNIQUE,
                        password VARCHAR(255) NOT NULL
                    )
                `;

        // Create tasks table if not exists
        const createTasksTableQuery = `
                    CREATE TABLE IF NOT EXISTS tasks (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        userId INT NOT NULL,
                        title VARCHAR(255) NOT NULL,
                        description TEXT,
                        deadline DATETIME,
                        priority INT,
                        completed BOOLEAN DEFAULT false,
                        FOREIGN KEY (userId) REFERENCES users(id)
                    )
                `;

        connection.query(createUsersTableQuery, (err) => {
          if (err) {
            console.error("Error creating users table:", err);
          } else {
            console.log("Users table created or already exists");
          }
        });

        connection.query(createTasksTableQuery, (err) => {
          if (err) {
            console.error("Error creating tasks table:", err);
          } else {
            console.log("Tasks table created or already exists");
          }
        });

        connection.release();
      }
    });
  };

  this.acquire = function (callback) {
    this.pool.getConnection(function (err, connection) {
      callback(err, connection);
    });
  };
}

module.exports = new Connection();
