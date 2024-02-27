const db = require("../database/connection");
const { logErrorMessages } = require("../utils/saveLogfile");

// Reusable function to execute SQL queries
const executeQuery = (sql, id) => {
  return new Promise((resolve, reject) => {
    db.query(sql, id, (err, result) => {
      if (err) {
        logErrorMessages("Querying failed 1 => " + err);
        reject("Temporal server error. Refresh");
      }
      else {
        resolve(result);
      }
    });
  });
};

const EXE = { executeQuery };

module.exports = EXE;
