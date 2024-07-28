// src/initDB.js
const mysql = require("mysql2");
const { DBTables } = require("./tables");
require("dotenv").config();

const { DB_NAME, DB_PORT, DB_USER, DB_PASSWD, DB_HOST } = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWD,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

function initializeDatabase() {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(`Error connecting to the database: ${err}`);
      return;
    }

    connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, (err) => {
      if (err) {
        console.error(`Error creating database: ${err}`);
        connection.release();
        return;
      }

      connection.changeUser({ database: DB_NAME }, (err) => {
        if (err) {
          console.error(`Error switching to database: ${err}`);
          connection.release();
          return;
        }

        connection.query(DBTables, (err) => {
          if (err) {
            console.error(`Error creating tables: ${err}`);
          }
          connection.release();
        });
      });
    });
  });
}

module.exports = initializeDatabase;
