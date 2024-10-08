const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_ACCESS_TOKEN } = process.env;

// generate New tokens
function generateJWTToken(email){
    const token = jwt.sign({ email }, JWT_ACCESS_TOKEN, { expiresIn: '8h' });
    return token;
};

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
  refreshAccessToken,
}

module.exports = Data;
