const db = require("../database/connection");
const { logErrorMessages, logSuccessMessages } = require("../utils/saveLogfile");

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

// Querry for user selection
const executeLoginQuery = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        logErrorMessages("Querying failed 2 => " + err);
        reject("Temporal server error. Refresh");
      }
      else {
        resolve(result);
      }
    });
  });
};

// Add new user to the system
const SignUpNewUser = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        logErrorMessages("Querying failed 3 => " + err);
        reject("Temporal server error. Refresh");
      }
      else {
        resolve(result);
      }
    });
  });
};

const EXE = {
  executeQuery,
  executeLoginQuery,
  SignUpNewUser
};

module.exports = EXE;
