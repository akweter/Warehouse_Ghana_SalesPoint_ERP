const { executeQuery } = require("../database");

// Save tokens to the DB
const SaveNewTokensQuery = async (payload) => {
    const sql = `
    INSERT INTO 
        tokens (
            UserName, 
            TokenValue, 
            ExpiryTimestamp, 
            CreationTimestamp, 
            TokenType, 
            Status, 
            IPAddress, 
            UserLocation, 
            UserAgent, 
            TokenID
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
    `;
    try {
        const response = await executeQuery(sql, payload);
        if (response) { return response }
    } catch (error) {
        return error;
    }
};

module.exports = { SaveNewTokensQuery };
