require('dotenv').config();

const { EMAIL_USER, origin } = process.env;
const { transporter } = require('../emailTransporter');

function createActivationEmailOptions(userEmail, emailToken) {
  const mailOptions = {
    from: EMAIL_USER,
    to: userEmail,
    subject: 'Activate Your Account',
    html: `
      <div style="text-align: center;">
        <h2 style="color: #007BFF;">One Time Activation Key</h2>
        <img src="https://iili.io/HXEOctR.jpg" alt="Warehouse Ghana Logo" width="350" height="250">
        <p style="font-size: 17px;">Kindly click on the below link to activate your Warehouse Ghana user account:</p>
        <p><a target="_blank" href="${origin}/activate?user=${emailToken}">
          <button style="background-color: #007BFF; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            Activate Your Account
          </button>
        </a></p>
        <strong style="color: red; font-size: 12px;">
          You may request for another activation key in 15 minutes if you failed to activate now
        </strong>
      </div>
    `,
  };

  return mailOptions;
}

function sendActivationEmail(userEmail, emailToken) {
  const mailOptions = createActivationEmailOptions(userEmail, emailToken);

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = { sendActivationEmail };
