const Auth = require("express").Router();
require('dotenv').config();
const bcrypt = require('bcryptjs');

const { origin } = process.env;

// Projects
const generateUUID = require("../utils/generateIDs");
const { logMessage, logErrorMessages, logSuccessMessages } = require('../utils/saveLogfile');
const { generateJWTToken, saveToken_SendEmail, } = require("../utils/tokenActions");
const { Myip } = require('../utils/userIPData');
const { sendVerificationEmail } = require("../utils/emailSender");
const {
	loginUser,
	signUpUser,
	AddNewUser,
	resetPassword,
	updateUserPSD,
} = require("../controller/userMgt");

// Login
Auth.post("/login", async (req, res, next) => {
	const { email, passwrd } = req.body;
	const ipInfo = await Myip();

	if (!ipInfo) {
		await logErrorMessages(`${email} tried logging in but not connected to internet`, email);
		return res.json({ status: 'error', message: 'You are not connected to internet' });
	}
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
			if (output.length > 0) {
				output.map((e) => {
					const status = e.activated;
					const passwd = e.passwd;
					const userEmail = e.Usr_email;

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
									await sendVerificationEmail(userEmail, emailToken, type = "login", e.Usr_id);
									res.setHeader('Access-Control-Allow-Origin', `${origin}`);
									res.setHeader('Content-Type', 'application/json');
									res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
									res.setHeader('Access-Control-Allow-Credentials', true);
									res.setHeader('Access-Control-Expose-Headers', 'Authorization');
									res.setHeader('Authorization', `${emailToken}`);
									res.setHeader('Cache-Control', 'no-cache');
									await logMessage(`${userEmail} logged in the ERP. Details: ${JSON.stringify(ipInfo)}`, e.Usr_id);
									res.status(200).send({ statusMessage: 'successLogin', data: sanitizedData });
								}
								else {
									await sendVerificationEmail(userEmail, emailToken, type = null, e.Usr_id)
										.then((response) => {
											res.status(200).send(response);
										})
										.catch((err) => {
											logErrorMessages(JSON.stringify(err), e.Usr_id);
											res.send({ status: 'error', message: `Failed to send account activation email to ${userEmail}` });
										});
								}
							}
							else {
								logErrorMessages(`Login but wrong password for ${userEmail}`, e.Usr_id);
								res.json({ status: 'error', message: 'Invalid credentials' });
							}
						})
						.catch((err) => {
							logErrorMessages(`bcrypt unable to login: ${(err)})`, e.Usr_id);
							next();
						});
				});
			}
			else {
				return res.json({ status: 'error', message: "You don't have an account." });
			}
		}
		catch (err) {
			logErrorMessages(`User login failed ${req.body.Usr_email}: ${JSON.stringify(err)}`, email);
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
			logErrorMessages(`Cannot Add: ${username}, ${userEmail}, Already exist`, req.headers.keyid);
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
				generateUUID(),
			];

			await AddNewUser(Vals)
				.then( async() => {
					logSuccessMessages(`New User Added: ${username}, ${userEmail}`, req.headers.keyid);
					await saveToken_SendEmail(userEmail, username, req, type = null, req.headers.keyid);
					res.status(200).json({status: 'success', message: 'Adding user successful'});
				});
		}
	}
	catch (err) {
		logErrorMessages(`Error adding user: ${username + `, IP: ` + ipInfo.ip + `, Error: ` + err} to the DB`, req.headers.keyid);
		return res.send({ status: 'error', message: "Account registration failed. Try again"});
	}
});

// Update user password based on the ID
Auth.put("/psd/:id", async (req, res) => {
	const { id } = req.params;
	const { psd } = req.body;
	const hashpsswd = await bcrypt.hash(psd, 12);
	try {
		await updateUserPSD([hashpsswd, id]);
		logMessage(`${id} update paswword succussful`, req.headers.keyid);
		return res.status(200).json({ status: 'success', message: `User's secret updated successfully`});
	}
	catch (err) {
		logErrorMessages(`Adding user error ${JSON.stringify(err)}`, req.headers.keyid);
		return res.status(500).json({ status: 'error', message: "Opps something went wrong" });
	}
});

// Send verification email
Auth.post("/sendemail", async (req, res) => {
	const { userName, primaryEmail, accountId } = req.body;
	await resetPassword(accountId)
	.then( async() => {
		await saveToken_SendEmail(primaryEmail, userName, req, type = 'reset', req.headers.keyid)
		.then((response) => {
			res.status(200).send(response);
		})
		.catch(() => {
			logErrorMessages(`Failed to save password reset for ${primaryEmail} JSON.stringify(err)`, req.headers.keyid);
			res.status(500).json({ status: 'error', message: 'Oops something went wrong' });
		});
	})
	.catch((err) => {
		logErrorMessages(`Failed to send password reset to ${primaryEmail}: ${JSON.stringify(err)}`, req.headers.keyid);
		res.status(500).json({ status: 'error', message: 'Oops something went wrong' });
	});	
});

module.exports = Auth;