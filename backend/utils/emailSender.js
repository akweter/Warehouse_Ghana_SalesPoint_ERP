require('dotenv').config();
const nodemailer = require('nodemailer');
const { logErrorMessages, logMessage} = require('./saveLogfile');

const { EMAIL_HOST, EMAIL_PORT, EMAIL_SEC, EMAIL_USER, EMAIL_PSD, origin } = process.env;

// Send email
const transporter = nodemailer.createTransport({
	host: EMAIL_HOST,
	port: EMAIL_PORT,
	secure: EMAIL_SEC,
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PSD,
	},
});

// Verify for valid email
const isValidEmail = (email) => {
	const emailRegex = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
	return emailRegex.test(email);
}

// Activate your account
const verifyEmail = (email, emailToken) => {
	const userName = email.split('@')[0];
	const emailName = userName.charAt(0).toUpperCase() + userName.slice(1);

	return {
		from: EMAIL_USER,
		to: email,
		subject: 'Activate Your Account',
		html: `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<style>
						body {
							font-family: Arial, sans-serif;
							background-color: #f3f3f3;
							margin: 0;
							padding: 0;
						}

						.email-container {
							background-color: white;
							width: 600px;
							margin: 20px auto;
							border: 1px solid #ddd;
							border-radius: 8px;
							overflow: hidden;
						}

						.header {
							background-color: #f9f9f9;
							padding: 20px;
							text-align: center;
						}

						.header img {
							width: 50px;
							height: auto;
						}

						.content {
							padding: 20px;
							text-align: center;
						}

						.content h1 {
							font-size: 20px;
							color: #333;
						}

						.content p {
							font-size: 16px;
							color: #555;
							line-height: 1.5;
						}

						.button {
							display: inline-block;
							margin-top: 20px;
							padding: 10px 20px;
							font-size: 16px;
							color: white;
							background-color: #1dd89b;
							text-decoration: none;
							border-radius: 5px;
						}

						.footer {
							background-color: #f9f9f9;
							padding: 15px;
							text-align: center;
							font-size: 12px;
							color: #777;
						}

						.footer a {
							text-decoration: none;
							color: #555;
							margin: 0 5px;
						}

						.footer a img {
							width: 20px;
							height: auto;
							vertical-align: middle;
						}
					</style>
				</head>
				<body>
					<div class="email-container">
						<div class="header">
							<img src="https://i0.wp.com/www.warehouseghana.com/wp-content/uploads/2022/10/Wg_logo-removebg-preview.png" alt="Salepoint Logo">
						</div>
						<div class="content">
							<h1>Hello ${emailName}!</h1>
							<p>Your administrator just granted your account the access to Salepoint  <br />Invoicing System. Please activate your email using the link below</p>
							<a href="${origin}/activate?key=${emailToken}" style="background-color: #0B0F63;" class="button">Verify email</a> <br /><br />
							<a href="${origin}/activate?key=${emailToken}" style="text-decoration: none; font-size: small;">Or click here to copy this link and paste in your browser</a>
						</div>
						<div class="footer">
							<p style="color: red">This verification token will expire in 15 minutes if unused</p>
							<p>Salepoint Solution | Made with pride</p>
						</div>
					</div>
				</body>
				</html>
			`,
	} 
};

// Inform user about login
const userLogin = (email) => {	
	const userName = email.split('@')[0];
	const emailName = userName.charAt(0).toUpperCase() + userName.slice(1);

	return {
		from: EMAIL_USER,
		to: email,
		subject: 'Warehouse Ghana ERP | Account Login',
		html: `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<style>
						body {
							font-family: Arial, sans-serif;
							background-color: #f3f3f3;
							margin: 0;
							padding: 0;
						}

						.email-container {
							background-color: white;
							width: 600px;
							margin: 20px auto;
							border: 1px solid #ddd;
							border-radius: 8px;
							overflow: hidden;
						}

						.header {
							background-color: #f9f9f9;
							padding: 20px;
							text-align: center;
						}

						.header img {
							width: 50px;
							height: auto;
						}

						.content {
							padding: 20px;
							text-align: center;
						}

						.content h1 {
							font-size: 20px;
							color: #333;
						}

						.content p {
							font-size: 16px;
							color: #555;
							line-height: 1.5;
						}

						.button {
							display: inline-block;
							margin-top: 20px;
							padding: 10px 20px;
							font-size: 16px;
							color: white;
							background-color: #1dd89b;
							text-decoration: none;
							border-radius: 5px;
						}

						.footer {
							background-color: #f9f9f9;
							padding: 15px;
							text-align: center;
							font-size: 12px;
							color: #777;
						}

						.footer a {
							text-decoration: none;
							color: #555;
							margin: 0 5px;
						}

						.footer a img {
							width: 20px;
							height: auto;
							vertical-align: middle;
						}
					</style>
				</head>
				<body>
					<div class="email-container">
						<div class="header">
							<img src="https://i0.wp.com/www.warehouseghana.com/wp-content/uploads/2022/10/Wg_logo-removebg-preview.png" alt="Salepoint Logo">
						</div>
						<div class="content">
							<h1>Hello ${emailName}!</h1>
							<p>We noticed that you just logged into the SalesPoint Invoicing System</p>
							<a href="mailto:it@warehouseghana.com?subject=Unknown%20login%20for%20${email}" style="text-decoration: none; font-size: small; color: red;">Click here to report to your administrator if it is not you</a>
						</div>
						<div class="footer">
							<p style="font-weight: bolder;">Ignore this email alert if everything is fine</p>
							<p>Salepoint Solution | Made with pride</p>
						</div>
					</div>
				</body>
				</html>
			`,
	}
};

// Send password reset email
const resetPassword = (email, emailToken) => {
	const userName = email.split('@')[0];
	const emailName = userName.charAt(0).toUpperCase() + userName.slice(1);

	return {
		from: EMAIL_USER,
		to: email,
		subject: 'Reset Your Password',
		html: `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<style>
						body {
							font-family: Arial, sans-serif;
							background-color: #f3f3f3;
							margin: 0;
							padding: 0;
						}

						.email-container {
							background-color: white;
							width: 600px;
							margin: 20px auto;
							border: 1px solid #ddd;
							border-radius: 8px;
							overflow: hidden;
						}

						.header {
							background-color: #f9f9f9;
							padding: 20px;
							text-align: center;
						}

						.header img {
							width: 50px;
							height: auto;
						}

						.content {
							padding: 20px;
							text-align: center;
						}

						.content h1 {
							font-size: 24px;
							color: #333;
						}

						.content p {
							font-size: 16px;
							color: #555;
							line-height: 1.5;
						}

						.button {
							display: inline-block;
							margin-top: 20px;
							padding: 10px 20px;
							font-size: 16px;
							color: white;
							background-color: #1dd89b;
							text-decoration: none;
							border-radius: 5px;
						}

						.footer {
							background-color: #f9f9f9;
							padding: 15px;
							text-align: center;
							font-size: 12px;
							color: #777;
						}

						.footer a {
							text-decoration: none;
							color: #555;
							margin: 0 5px;
						}

						.footer a img {
							width: 20px;
							height: auto;
							vertical-align: middle;
						}
					</style>
				</head>
				<body>
					<div class="email-container">
						<div class="header">
							<img src="https://i0.wp.com/www.warehouseghana.com/wp-content/uploads/2022/10/Wg_logo-removebg-preview.png" alt="Salepoint Logo">
						</div>
						<div class="content">
							<h1>Hello ${emailName}!</h1>
							<p>Your account made a request to reset your password</p>
							<a href="${origin}/activate?key=${emailToken}" style="background-color: #0B0F63;" class="button">Reset Password</a> <br /><br />
							<a href="mailto:it@warehouseghana.com?subject=No%20password%20request%20for%20${email}" style="text-decoration: none;">Or make report to your administrator</a>
						</div>
						<div class="footer">
							<p style="color: red">This verification token will expire in 15 minutes if unused</p>
							<p>Salepoint Solution | Made with pride</p>
						</div>
					</div>
				</body>
				</html>
			`,
	}
};

// Email transporter
const sendVerificationEmail = async (email, emailToken, type, adminAccountID) => {
	try {
		if (!isValidEmail(email)) {
			return { status: 'error', message: 'Please log in with your email instead' };
		}
		if (type === 'login') {
			await transporter.sendMail(userLogin(email));
			logMessage(`Login email sent to ${email}`, adminAccountID);
			return 200;
		}
		if (type === 'reset') {
			await transporter.sendMail(resetPassword(email, emailToken));
			logMessage(`Reset password sent to ${email}`, adminAccountID);
			return { status: 'success', message: 'email_sent'};
		}
		else {
			await transporter.sendMail(verifyEmail(email, emailToken));
			logMessage(`Verification email sent to ${email}`, adminAccountID);
			return { status: 'success', message: 'email_sent'};
		}
	}
	catch (error) {
		logErrorMessages(`Sending verification email failed: ${error}`, req.headers.keyid);
		return `Sending verification email failed`;
	}
};

module.exports = {
	sendVerificationEmail,
}