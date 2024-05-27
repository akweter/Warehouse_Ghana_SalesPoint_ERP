const Auth = require("express").Router();
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { EMAIL_USER, origin } = process.env;

// Projects
const { logMessage, logErrorMessages } = require('../utils/saveLogfile');
const { transporter } = require("../utils/emails/emailTransporter");
const { generateJWTToken, decodeToken, } = require("../utils/tokenActions");
const { SaveNewTokensQuery } = require("../controller/tokens");
const { Myip } = require('../utils/ipinfo');
const UUID = require('../utils/generateIDs');
const {
	loginUser,
	signUpUser,
	AddNewUser,
	updateUserPSD,
} = require("../controller/userMgt");

// Send email and save token
const saveToken_SendEmail = async (userEmail, username, req, res) => {
	const ipInfo = await Myip();
	const userAgent = req.get('User-Agent');
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
		UUID(),
	];

	try {
		await SaveNewTokensQuery(TokenVals)
			.then(async () => {
				await sendVerificationEmail(userEmail, emailToken, res);
				return res.json({ status: 'success', message: 'email_sent' });
			});
	}
	catch (err) {
		logErrorMessages(`Failed to save ${TokenVals} for ${username} to the DB ${JSON.stringify(err)}`);
		return res.status(500).json({ status: 'error', message: 'Oops Something went wrong! Refresh and retry' });
	}
}

// Check for valid email
function isValidEmail(email) {
	const emailRegex = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
	return emailRegex.test(email);
}

// Email transporter
const sendVerificationEmail = (email, emailToken, res) => {
	if (isValidEmail(email)) {
		const mailOptions = {
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
						<button style="background: #0B0F63; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
						Activate Your Account
						</button>
					</a>
				</p>
				<strong style="color: red; font-size: 12px;"> Verification key expires if unused for 15 minutes.</strong>
				</div>
			`,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				logErrorMessages(`Email sending error: => ${error}`);
				return error;
			} else {
				logMessage(`user added | verification key sent to ${JSON.stringify(info.accepted[0])}`);
				return res.json({ status: 'success', message: 'email_sent' });
			}
		});
	}
	else {
		return res.json({ status: 'error', message: 'Please log in with your email instead' });
	}
};

// Login
Auth.post("/login", async (req, res) => {
	req.activationContext = 'login';
	const userAgent = req.get('User-Agent');
	const { email, passwrd } = req.body;

	if (!email) {
		return res.send('Invalid required email');
	}
	else if (!passwrd && email) {
		return res.send(`Please verify your email: ${email}`);
	}
	else {
		const payload = [email, email];
		try {
			const output = await loginUser(payload);
			const ipInfo = await Myip();
			if (!ipInfo) {
				logErrorMessages(`Login failed | No internet <=> ${email}`);
				return res.json({ status: 'error', message: 'You are not connected to internet' });
			}

			if (output.length > 0) {
				output.map((e) => {
					const status = e.activated;
					const passwd = e.passwd;
					const userEmail = e.Usr_email;
					const userName = e.Usr_name;

					const sanitizedData = {
						userName: e.Usr_name,
						accountType: e.Usr_type,
						telephone: e.Usr_phone,
						primaryEmail: e.Usr_email,
						regAddress: e.Usr_address,
						orgDept: e.Usr_dept,
						regDate: e.Usr_reg_date,
						accountId: e.Usr_id
					};
					const emailToken = generateJWTToken(userEmail);

					bcrypt.compare(passwrd, passwd)
						.then((result) => {
							if (result === true) {
								if (status === 'yes') {
									logMessage(`${userEmail} login succussful with ip ${ipInfo.ip}`);

									res.setHeader('Access-Control-Allow-Origin', `${origin}`);
									res.setHeader('Content-Type', 'application/json');
									res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
									res.setHeader('Access-Control-Allow-Credentials', true);
									res.setHeader('Access-Control-Expose-Headers', 'Authorization');
									res.setHeader('Authorization', `${emailToken}`);
									res.setHeader('Cache-Control', 'no-cache');

									return res.send({ statusMessage: 'successLogin', data: sanitizedData });
								}
								else {
									const getExp = decodeToken(emailToken);
									const expTime = getExp.exp;
									const expPeriod = new Date(expTime * 1000);
									const generatedTime = new Date();

									const TokenVals = [
										userName,
										emailToken,
										expPeriod,
										generatedTime,
										'JWT',
										'unused',
										ipInfo.ip,
										ipInfo.country,
										userAgent,
										UUID(),
									];

									SaveNewTokensQuery(TokenVals)
										.then(() => {
											sendVerificationEmail(email, emailToken, res);
											return res;
										})
										.catch((err) => {
											logErrorMessages(`Failed to save token to the DB ${JSON.stringify(err)}`);
											return res.status(500).json({ status: 'error', message: 'Oops Something went wrong Refresh and retry' });
										});
								}
							}
							else {
								logErrorMessages(`Login but wrong password for ${userEmail}`);
								return res.json({ status: 'error', message: 'Wrong password' });
							}
						})
						.catch((err) => {
							logErrorMessages(`login failed: ${JSON.stringify(err)})`);
							return res.json({ status: 'error', message: 'login failed! Check your connection and try again' });
						});
				});
			}
			else {
				logErrorMessages(`Login failed. No records found for ${email}, Ip: ${JSON.stringify(ipInfo.ip)}, Location: ${JSON.stringify(ipInfo.loc)} `);
				return res.json({ status: 'error', message: "You don't have an account. Please Sign Up" });
			}
		}
		catch (err) {
			logErrorMessages(`Internal server error for ${req.body.Usr_email}` + err);
			return res.json({ status: 'error', message: 'Login failed. Refresh and retry' });
		}
	}
});

// sign up | add new user
Auth.post("/signup", async (req, res) => {
	const {
		fname,
		lname,
		username,
		UserStatus,
		userPhone,
		userEmail,
		staffID,
		userDept,
		userType,
		address,
		psd,
	} = req.body;
	const ipInfo = await Myip();

	try {
		const output = await signUpUser(userEmail, username);
		if (output.length > 0) {
			logErrorMessages(`Cannot Add: ${username}, ${userEmail}, Already exist`);
			return res.json({ status: 'error', message: 'Username or Email Exist! Please Log in' });
		}
		else {
			const date = new Date();
			const setPsd = () => (!psd) ? 'test' : psd;
			var Vals = [
				fname,
				lname,
				username,
				userType,
				UserStatus,
				userPhone,
				userEmail,
				address,
				userDept,
				date,
				setPsd(),
				'no',
				staffID,
				UUID(),
			];

			await AddNewUser(Vals)
				.then(async () => {
					await saveToken_SendEmail(userEmail, username, req, res);
				})
				.catch((err) => {
					logErrorMessages(`Error adding user: ${username + ` ` + ipInfo.ip + ` ` + err} to the DB`);
					return res.json({ status: 'error', message: 'Oops Something went wrong! Refresh and retry' });
				});
		}
	}
	catch (err) {
		logErrorMessages(`Error adding user: ${username + `, IP: ` + ipInfo.ip + `, Error: ` + err} to the DB`);
		return res.status(500).send("Internal server error");
	}
});

// Update user password based on the ID
Auth.put("/psd/:id", async (req, res, next) => {
	const { id } = req.params;
	const { psd } = req.body;
	const hashpsswd = await bcrypt.hash(psd, 12);
	const data = [hashpsswd, id];
	try {
		const output = await updateUserPSD(data);
		logMessage(`${id} update paswword succussful`);
		return res.status(200).json({ message: 'success' });
	}
	catch (err) {
		logErrorMessages("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});

// Send verification email
Auth.post("/sendemail", async (req, res) => {
	const { Usr_name, Usr_email } = req.body;
	return await saveToken_SendEmail(Usr_email, Usr_name, req, res);
});

module.exports = Auth;
