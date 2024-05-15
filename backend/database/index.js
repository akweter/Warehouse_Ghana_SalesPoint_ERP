const db = require("../database/connection");
const { logErrorMessages } = require("../utils/saveLogfile");

// Reusable function to execute SQL queries
const executeQuery = (sql, id) => {
  return new Promise((resolve, reject) => {
    db.query(sql, id, (err, result) => {
      if (err) {
        logErrorMessages(JSON.stringify(err));
        reject(err);
      }
      resolve(result);
    });
  });
};
module.exports = { executeQuery };