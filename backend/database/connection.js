const mysql = require("mysql2");
const { logErrorMessages } = require("../utils/saveLogfile");
require("dotenv").config();

const { DB_NAME, DB_PORT, DB_USER, DB_PASSWD, DB_HOST } = process.env;

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWD,
  database: DB_NAME,
  port: DB_PORT
});

db.getConnection((err, connection) => {
  if (err) {
    return logErrorMessages(`Error connecting to the database: ${err}`);
  } else {
    connection.release();
  }
});

module.exports = db;
