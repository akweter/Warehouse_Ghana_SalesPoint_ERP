const { executeQuery } = require("../database");

// Save tokens to the DB
const SaveNewTokensQuery = async (payload) => {
    const sql = "INSERT INTO tokens (UserName, TokenValue, ExpiryTimestamp, CreationTimestamp, TokenType, Status, IPAddress, UserLocation, UserAgent, TokenID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    return executeQuery(sql, payload);
};

const Data = { SaveNewTokensQuery }
module.exports = Data;
