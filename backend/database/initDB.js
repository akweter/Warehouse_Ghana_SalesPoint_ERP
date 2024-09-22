// src/initDB.js
const mysql = require("mysql2");
const { logErrorMessages } = require("../utils/saveLogfile");
require("dotenv").config();

const { DB_PORT, DB_USER, DB_PASSWD, DB_HOST } = process.env;

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
      logErrorMessages(`Error connecting to the database: ${err}`);
      return;
    }
    connection.release();
  });
}

module.exports = initializeDatabase;
