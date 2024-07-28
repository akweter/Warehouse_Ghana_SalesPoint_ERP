const { logErrorMessages, logMessage } = require('../saveLogfile');

const nodemailer = require('nodemailer');
require('dotenv').config();
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
	return {
		from: EMAIL_USER,
		to: email,
		subject: 'Activate Your Account',
		html: `
				<div style="text-align: center;">
				<h2 style="color: #0B0F63;">One Time Verification Key</h2>
				<img src="https://i0.wp.com/www.warehouseghana.com/wp-content/uploads/2022/10/Wg_logo-removebg-preview.png" alt="Warehouse Ghana Logo" width="70" height="50">
				<address style="font-size: 17px;">
					<small>Click on the button to activate your Warehouse Ghana user account</small>
				</address>
				<p>
					<a target="_blank" href="${origin}/activate?key=${emailToken}" style="cursor: pointer;">
						Activate Your Account
					</a>
				</p>
				<strong style="color: red; font-size: 12px;"> Verification key expires if unused for 15 minutes.</strong>
				</div>
			`,
	}
};

// Send email for user verification
const userLogin = (email) => {
	return {
		from: EMAIL_USER,
		to: email,
		subject: 'Account Login',
		html: `
				<div style="text-align: center;">
					<address style="font-size: 17px;">Sign In activitiy found on this account.</address>
					<p style="color: #0B0F63; font-size: 15px; font-family: "Times New Roman", Times, serif;">
						<strong>
							Did you just log into the ERP? <br/>
							If no kindly file a complaint to your administrator
						</strong>
					</p>
					<p>
						<a href="mailto:it@warehouseghana.com?subject=Unknown%20login%20for%20${email}" style="cursor: pointer; text-decoration: none;">
							<button style="background: #0B0F63; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
								File complaint
							</button>
						</a>			
					</p>
					<strong style="color: red; font-size: 12px;">Ignore this alert if everything is right</strong>
				</div>
			`,
	}
};

// Send email for user verification
const resetPassword = (email, emailToken) => {
	return {
		from: EMAIL_USER,
		to: email,
		subject: 'Reset Your Password',
		html: `
				<div style="text-align: center;">
				<h2 style="color: #0B0F63;">Did you request password reset?</h2>
				<img src="https://i0.wp.com/www.warehouseghana.com/wp-content/uploads/2022/10/Wg_logo-removebg-preview.png" alt="Warehouse Ghana Logo" width="70" height="50">
				<address style="font-size: 17px;">
					<small>Click on the button to change your Warehouse Ghana password</small>
				</address>
				<p>
					<a target="_blank" href="${origin}/activate?key=${emailToken}" style="text-decoration: none;">
						Reset Password
					</a> or 
					<a href="mailto:it@warehouseghana.com?subject=No%20password%20request%20for%20${email}" style="color: red; text-decoration: none;">
						Make report to Admin
					</a>
				</p>
				</div>
			`,
	}
};

// Email transporter
const sendVerificationEmail = async (email, emailToken, type) => {
	try {
		if (!isValidEmail(email)) {
			return { status: 'error', message: 'Please log in with your email instead' };
		}
		if (type === 'login') {
			await transporter.sendMail(userLogin(email));
			logMessage(`Login email sent to ${email}`);
			return 200;
		}
		if (type === 'reset') {
			await transporter.sendMail(resetPassword(email, emailToken));
			logMessage(`Reset password sent to ${email}`);
			return { status: 'success', message: 'email_sent'};
		}
		else {
			await transporter.sendMail(verifyEmail(email, emailToken));
			logMessage(`Verification email sent to ${email}`);
			return { status: 'success', message: 'email_sent'};
		}
	}
	catch (error) {
		logErrorMessages(`Sending verification email failed: `+(error));
		return `Sending verification email failed`;
	}
};

module.exports = {
	sendVerificationEmail,
}