const { logErrorMessages, logSuccessMessages } = require("../utils/saveLogfile");
const express = require("express");
require('dotenv').config();

const {
    sanitizePayload,
    saveInvoiceToDB,
} = require("../utils/invoiceReform");
const { sampleGARResponse } = require("../utils");

const Router = express.Router();

// Post and save invoice records
Router.post("/invoice", async (req, res) => {
    const Data = req.body;
    if (!Data || !Data.items || !Array.isArray(Data.items)) {
        return res.json({ status: 'Error', message: 'Invalid data structure', data: Data });
    }
    const sanitizedPayload = sanitizePayload(Data);
    // logSuccessMessages(JSON.stringify(sanitizedPayload), req.headers.keyid);
    try {
        await saveInvoiceToDB(Data, sanitizedPayload, sampleGARResponse)
            .then(() => {
                return res.status(200).json({ status: 'success' });
            })
            .catch((err) => {
                logErrorMessages(JSON.stringify(err), req.headers.keyid);
                return res.json({
                    status: 'error',
                    message: `Failed to save invoice: ${sanitizedPayload.invoiceNumber} to DB. Try new invoice`
                });
            });
    }
    catch (error) {
        const { status, data } = error.response;
        logErrorMessages(`${Data.userName} - ${JSON.stringify(error)}, ${JSON.stringify(sanitizedPayload)}`, req.headers.keyid);
        return res.status(status).json({ status: 'error', message: data });
    }
});

// Post and save refund records
Router.post("/refund", async (req, res) => {
    const Data = req.body;

    if (!Data || !Data.items || !Array.isArray(Data.items)) {
        return res.json({ status: 'Error', message: 'Invalid data structure', data: Data });
    }
    const sanitizedPayload = sanitizePayload(Data);
    // logSuccessMessages(JSON.stringify(sanitizedPayload), req.headers.keyid);
    try {
        if (sanitizedPayload.length > 0) {
            await saveInvoiceToDB(Data, sanitizedPayload, response.data)
                .then(() => { return res.status(200).json({ status: 'success' }) })
                .catch((err) => {
                    logErrorMessages(`Failed to save invoice to DB: ${err}`, req.headers.keyid);
                    return res.json({ status: 'error', message: `Failed to save invoice: ${sanitizedPayload.invoiceNumber} to DB.` });
                });
        } else {
            return res.json({ status: 'error', message: `Incoreect payload` });
        }
    }
    catch (error) {
        const { status, data } = error.response;
        logErrorMessages(`${Data.userName} - ${JSON.stringify(data)}, ${JSON.stringify(sanitizedPayload)}`, req.headers.keyid);
        return res.status(status).json({ status: 'error', message: data });
    }
});

module.exports = Router;
