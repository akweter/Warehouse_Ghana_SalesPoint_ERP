const mysql = require("mysql2");
require("dotenv").config();

const { DB_NAME, DB_PORT, DB_USER, DB_PASSWD, DB_HOST } = process.env;

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;
