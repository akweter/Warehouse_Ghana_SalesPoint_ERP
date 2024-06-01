const Auth = require("express").Router();
require('dotenv').config();
const bcrypt = require('bcryptjs');

const { origin } = process.env;

// Projects
const { logMessage, logErrorMessages, logSuccessMessages } = require('../utils/saveLogfile');
const { generateJWTToken, decodeToken, } = require("../utils/tokenActions");
const { SaveNewTokensQuery } = require("../controller/tokens");
const { Myip } = require('../utils/ipinfo');
const UUID = require('../utils/generateIDs');
const { sendVerificationEmail } = require("../utils/emails/emailSender");
const {
	loginUser,
	signUpUser,
	AddNewUser,
	updateUserPSD,
	resetPassword,
} = require("../controller/userMgt");

// Send email and save token
const saveToken_SendEmail = async (userEmail, username, reqParam, type) => {
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
		UUID(),
	];

	try {
		await SaveNewTokensQuery(TokenVals);
		const response = await sendVerificationEmail(userEmail, emailToken, type);
		return response;
	}
	catch (err) {
		logErrorMessages(`Failed to save ${TokenVals} for ${username} to the DB ${JSON.stringify(err)}`);
		return err;
	}
}

// Login
Auth.post("/login", async (req, res) => {
	req.activationContext = 'login';
	const userAgent = req.get('User-Agent');
	const { email, passwrd } = req.body;

	if (!email) {
		return res.send({ status: 'error', message: 'Please log in with your email instead' });
	}
	else if (!passwrd && email) {
		return res.send({ status: 'error', message: `Please verify your email: ${email}` });
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
						.then( async (result) => {
							if (result === true) {
								if (status === 'yes') {
									res.setHeader('Access-Control-Allow-Origin', `${origin}`);
									res.setHeader('Content-Type', 'application/json');
									res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
									res.setHeader('Access-Control-Allow-Credentials', true);
									res.setHeader('Access-Control-Expose-Headers', 'Authorization');
									res.setHeader('Authorization', `${emailToken}`);
									res.setHeader('Cache-Control', 'no-cache');

									await sendVerificationEmail(userEmail, emailToken, type = "login")
										.then(() => {
											logMessage(`${userEmail} login succussful with ip ${ipInfo.ip}`);
											res.status(200).send({ statusMessage: 'successLogin', data: sanitizedData });
										})
										.catch((err) => {
											logErrorMessages(`${userEmail} failed to login: ` + JSON.stringify(err));
											res.json({ status: 'error', message: 'Login failed. Please try again after 5 minutes' });
										});
								}
								else {
									await sendVerificationEmail(userEmail, emailToken, type = null)
										.then((response) => {
											res.status(200).send(response);
										})
										.catch((err) => {
											logErrorMessages(JSON.stringify(err));
											res.send({ status: 'error', message: `Failed to send account activation email to ${userEmail}` });
										});
								}
							}
							else {
								logErrorMessages(`Login but wrong password for ${userEmail}`);
								return res.json({ status: 'error', message: 'Incorrect password' });
							}
						})
						.catch((err) => {
							logErrorMessages(`Unable to login due to bcrypt: ${JSON.stringify(err)})`);
							res.json({ status: 'error', message: 'Login failed. Please try again after 5 minutes' });
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
			res.json({ status: 'error', message: 'Login failed. Please try again after 5 minutes' });
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
				.then(() => {
					logSuccessMessages(`New User Added: ${username}, ${userEmail}`);
					saveToken_SendEmail(userEmail, username, req, type = null)
						.then((response) => {
							res.status(200).send(response);
						})
						.catch((err) => {
							logErrorMessages(JSON.stringify(err));
							return res.send({ status: 'error', message: 'Failed to send user Verification details to user.' });
						});
				})
				.catch((err) => {
					logErrorMessages(`Error adding user: ${username + ` ` + ipInfo.ip + ` ` + err} to the DB`);
					return res.send({ status: 'error', message: 'Failed to send user Verification details to user.' });
				});
		}
	}
	catch (err) {
		logErrorMessages(`Error adding user: ${username + `, IP: ` + ipInfo.ip + `, Error: ` + err} to the DB`);
		return res.send({ status: 'error', message: "Oops! Something went wrong"});
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
	const { Usr_name, Usr_email, Usr_id } = req.body;
	await resetPassword(Usr_id)
	.then( async() => {
		await saveToken_SendEmail(Usr_email, Usr_name, req, type = 'reset')
		.then((response) => {
			res.status(200).send(response);
		})
		.catch((err) => {
			logErrorMessages(JSON.stringify(err));
			res.send({ status: 'error', message: `Failed to save password reset for ${Usr_email}` });
		});
	})
	.catch((err) => {
		logErrorMessages(JSON.stringify(err));
		res.send({ status: 'error', message: `Failed to send password reset to ${Usr_email}` });
	});	
});

module.exports = Auth;
