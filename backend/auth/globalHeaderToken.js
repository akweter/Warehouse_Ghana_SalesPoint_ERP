require('dotenv').config();
const { verifyToken, generateJWTToken } = require('../utils/tokenActions');
const publicRoutes = ['/auth/login', '/activate',];
const { origin } = process.env;

const authenticateToken = async (req, res, next) => {
    const tokenHeader = req.headers.authorization;

    if (publicRoutes.includes(req.path)) {
        return next();
    }
    if (!tokenHeader) {
        return res.status(401).json({ status: 'error',  message: 'Authorization not found' });
    }

    const tokenArray = tokenHeader.split(' ');
    if (tokenArray.length !== 2 || tokenArray[0].toLowerCase() !== 'bearer') {
        return res.status(401).json({ status: 'error', message: 'Invalid Authorization' });
    }

    const token = tokenArray[1];
    try {
        const decodedToken = await verifyToken(token);
        if (decodedToken !== false) {
            const newToken = generateJWTToken(decodedToken);
            req.authorization = newToken;

            // Set the updated token in the Authorization header of the response
            res.setHeader('Access-Control-Allow-Origin', `${origin}`);
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Access-Control-Expose-Headers', 'Authorization');
            res.setHeader('Authorization', `${newToken}`);
            res.setHeader('Cache-Control', 'no-cache');
            return next(); 
        } else {
            return res.status(401).json({ status: 'error', message: 'Authorization expired or Invalid! Please log in again' });
        }
    }
    catch (err) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized Entry: Please login' });
    }
};

module.exports = authenticateToken;
