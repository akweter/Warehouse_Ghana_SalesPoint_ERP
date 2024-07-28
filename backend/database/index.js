const db = require("./connection");

// Execute SQL queries
const executeQuery = (sql, id) => {
  return new Promise((resolve, reject) => {
    db.query(sql, id, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = {
  executeQuery
};