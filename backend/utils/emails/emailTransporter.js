const nodemailer = require('nodemailer');
require('dotenv').config();

const { EMAIL_HOST, EMAIL_PORT, EMAIL_SEC, EMAIL_USER, EMAIL_PSD } = process.env;

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SEC,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PSD,
    },
});

const Data = { transporter }

module.exports = Data;
