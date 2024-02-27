const jwt = require('jsonwebtoken');
require('dotenv').config();
const { SaveNewTokensQuery } = require('../controller/tokens');
const { logSuccessMessages, logErrorMessages } = require('./saveLogfile');

const { JWT_ACCESS_TOKEN } = process.env;

// generate New tokens
function generateJWTToken(email){
    const token = jwt.sign({ email }, JWT_ACCESS_TOKEN, { expiresIn: '60m' });
    return token;
};

// Save new tokens to the Database
const SaveNewTokens = async ({token}) =>{
    await SaveNewTokensQuery(token)
    .then((res) => {
        logSuccessMessages(`Token: ${JSON.stringify(res)} saved successfuly to DB`);
    })
    .catch((err) => {
        logErrorMessages(`Token: ${JSON.stringify(err)} failed to save to DB`);
    });
}

// Implement the verifyToken function
function verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_ACCESS_TOKEN);
      return decoded;
    }
    catch (err) {
      return false;
    }
}

// Implement the decodeToken function
function decodeToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_ACCESS_TOKEN);
      return decoded;
    } catch (err) {
      return null;
    }
}

// Refresh Access Token
const refreshAccessToken = async (oldToken) => {
  try {
    const decodedToken = decodeToken(oldToken);
    const newToken = generateJWTToken(decodedToken.email);
    return newToken;
  }
  catch (err) {
    return null;
  }
};

const Data = { 
  generateJWTToken, 
  verifyToken, 
  decodeToken, 
  SaveNewTokens,
  refreshAccessToken,
}

module.exports = Data;
