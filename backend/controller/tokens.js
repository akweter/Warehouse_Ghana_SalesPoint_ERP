const { executeQuery } = require("../database");

// Save tokens to the DB
const SaveNewTokensQuery = async (payload) => {
    console.log('tokens', payload);
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
    return await executeQuery(sql, payload);
};

module.exports = {
    SaveNewTokensQuery
};
