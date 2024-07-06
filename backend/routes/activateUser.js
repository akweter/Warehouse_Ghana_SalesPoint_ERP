const Auth = require("express").Router();
const { logErrorMessages, logMessage } = require("../utils/saveLogfile");
const { executeQuery } = require("../database");
const { verifyToken, decodeToken } = require("../utils/tokenActions");
require('dotenv').config();

const { origin } = process.env;

// Implement the activateUser function
const activateUser = async(email) =>{
    try {
        const sql = "UPDATE UserManagement SET activated = 'yes' WHERE Usr_email = ?";
        return await executeQuery(sql, email);
    } catch (err) {
        logErrorMessages(`Unable to activate user: ${email}, error: `,JSON.stringify(err));
        return null;
    }
}

  const getUserByEmail = async(email) =>{
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
                        const sanitizedData = {
                            userName: e.Usr_name,
                            accountType: e.Usr_type,
                            telephone: e.Usr_phone,
                            primaryEmail: e.Usr_email,
                            regAddress: e.Usr_address,
                            orgDept: e.Usr_dept,
                            regDate: e.Usr_reg_date,
                            accountId: e.Usr_id,
                            connect: e.passwd,
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
                            logErrorMessages(`error while activating ${email} with the error ${JSON.stringify(err)}`);
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
                logErrorMessages(`Email: ${email} not found from the query result decoding from token`);
                return res.json({status: 'error', message: 'Something went bad. Please sign up again!'});
            }
        }
        else {
            logErrorMessages(`No email found in the token: ${decrypted}`);
            return res.json({status: 'error', message: 'Oops! We failed to verify your ID. Please ask your administrator for new verification email'});
        }
    }
    else {
        logErrorMessages(`Verifying token error ${token}`);
        return res.json({status: 'error', message: 'Something bad happend. Please ask your administrator for new verification email'});
    }
});

module.exports = Auth;
