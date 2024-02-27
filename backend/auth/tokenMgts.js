// authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.sendStatus(403);
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '15m',
        });

        res.cookie('accessToken', accessToken, { httpOnly: true });

        req.user = user;
        next();
      });
    } else {
      req.user = user;
      next();
    }
  });
};

module.exports = { authenticateJWT };
