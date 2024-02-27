const Auth = require("express").Router();
const { logErrorMessages, logMessage } = require("../utils/saveLogfile");
const { logAllMessage } = require("../utils/saveAllLogs");
const { executeQuery } = require("../database");
const { verifyToken, decodeToken } = require("../utils/tokenActions");
require('dotenv').config();

const { origin } = process.env;

// Implement the activateUser function
async function activateUser(email) {
    try {
        const sql = "UPDATE UserManagement SET activated = 'yes' WHERE Usr_email = ?";
        return await executeQuery(sql, email);
    } catch (err) {
        logErrorMessages(`Unable to activate user: ${email}, error: `,JSON.stringify(err));
        return null;
    }
}

  async function getUserByEmail(email) {
    try {
        const sql = `SELECT * FROM UserManagement WHERE Usr_email = ?`;
        const user = await executeQuery(sql, email);
        return user;
    } catch (error) {
        logErrorMessages(`Couldn't query for user: ${email}, error: `,JSON.stringify(error));
        return null;
    }
}

Auth.get("/", async (req, res) => {
    req.activationContext = 'email';
    const token = req.query.key;
    if (verifyToken(token)) {
        const decrypted = decodeToken(token);
        const email = decrypted.email;

        if (email) {
            // Check if account is not already activated. If not, activate it.
            const user = await getUserByEmail(email);
            if (user.length > 0) {
                user.map(e=>{
                    if (e.activated === 'no') {
                        // Grab user information for the frontend.
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
                        activateUser(email)
                        .then(()=>{
                            logMessage(`Email: ${email} has activated successfully`);

                            res.setHeader('Access-Control-Allow-Origin', `${origin}`);
                            res.setHeader('Content-Type', 'application/json');
                            res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
                            res.setHeader('Access-Control-Allow-Credentials', true);
                            res.setHeader('Access-Control-Expose-Headers', 'Authorization');
                            res.setHeader('Authorization', `${token}`);
                            res.setHeader('Cache-Control', 'no-cache');

                            return res.json({statusMessage: 'successActivate', message: 'Your are activated successfully.', data: sanitizedData});
                        })
                        .catch((err)=>{
                            logAllMessage(`error 1 while activating ${email} with the error ${JSON.stringify(err)}`);
                            return res.json({status: 'error', message: 'Oops! Something went wrong. Log in again'});
                        });
                    }
                    else{
                        logErrorMessages(`Email: ${email} attempted to activate the account, but it's already active.`);
                        return res.json({status: 'error', message: 'You are already activated. Kindly log in'});
                    }
                });
            }
            else{
                logAllMessage(`Email: ${email} not found from the query result decoding from token`);
                return res.json({status: 'error', message: 'Something went bad. Please sign up again!'});
            }
        }
        else {
            logAllMessage(`No email found in the token: ${decrypted}`);
            return res.json({status: 'error', message: 'Oops! Something went wrong. Log in again'});
        }
    }
    else {
        logAllMessage(`Verifying token error ${token}`);
        return res.json({status: 'error', message: 'Something bad happend. Please log with your email'});
    }
});

module.exports = Auth;
