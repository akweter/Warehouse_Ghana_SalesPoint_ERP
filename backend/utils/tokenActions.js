const jwt = require('jsonwebtoken');
const { Myip } = require('./userIPData');
const generateUUID = require('./generateIDs');
const { SaveNewTokensQuery } = require('../controller/tokens');
const { sendVerificationEmail } = require('./emailSender');
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

// Send email and save token
const saveToken_SendEmail = async (userEmail, username, reqParam, type, adminAccountID) => {
	const ipInfo = await Myip();
	const userAgent = reqParam.get('User-Agent');
	const emailToken = generateJWTToken(userEmail);
	const getExp = decodeToken(emailToken);
	const expTime = getExp.exp;
	const expPeriod = new Date(expTime * 1000);
	const generatedTime = new Date();

	const TokenVals = [
		username,
		emailToken,
		expPeriod,
		generatedTime,
		'JWT',
		'unused',
		ipInfo.ip,
		ipInfo.country,
		userAgent,
		generateUUID(),
	];

	try {
		await SaveNewTokensQuery(TokenVals);
		return await sendVerificationEmail(userEmail, emailToken, type, adminAccountID);
	}
	catch (err) {
		await logErrorMessages(`Failed to save token ${JSON.stringify(TokenVals)} for ${username}. Error ${err}`, adminAccountID);
		return err;
	}
}

const Data = { 
  generateJWTToken, 
  verifyToken, 
  decodeToken,
  refreshAccessToken,
  saveToken_SendEmail,
}

module.exports = Data;
