const mysql = require("mysql2");
const { logServerMessages } = require("../utils/saveLogfile");
require("dotenv").config();

const { DB_NAME, DB_PORT, DB_USER, DB_PASSWD, DB_HOST, databaseUrl } = process.env;
const parsedUrl = new URL(databaseUrl);
const dbHost = parsedUrl.hostname;
const dbPort = parsedUrl.port;

const db = mysql.createPool({
  // connectionLimit: 10,
  // connectTimeout: 10000,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWD,
  database: DB_NAME,
  port: DB_PORT
});

db.getConnection((err, connection) => {
  if (err) {
    return logServerMessages(`Error connecting to the database: ${JSON.stringify(err)}`);
  } else {
    connection.release();
  }
});

module.exports = db;
