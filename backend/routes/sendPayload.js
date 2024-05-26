const { logErrorMessages, logSuccessMessages } = require("../utils/saveLogfile");
const UUID = require('../utils/generateIDs');
const express = require("express");
const axios = require("axios");
require('dotenv').config();

const { GRA_ENDPOINT, GRA_KEY } = process.env;
const { saveRefundInvoice } = require("../controller/salesNinvoices");
const {
    sanitizePayload,
    saveInvoiceToDB,
} = require("../utils/invoiceReform");

const Router = express.Router();

const responseData = {
    response: {
        message: {
            ysdcid: null,
            ysdcrecnum: null,
            ysdcintdata: null,
            ysdcregsig: null,
            ysdcmrc: null,
            ysdcmrctim: null,
            ysdctime: null,
        },
        qr_code: null,
    },
}

// Post and save invoice records
Router.post("/inv", async (req, res) => {
    const Data = req.body;
    if (!Data || !Data.items || !Array.isArray(Data.items)) {
        return res.json({ status: 'Error', message: 'Invalid data structure', data: Data });
    }
    const sanitizedPayload = sanitizePayload(Data);
    // logSuccessMessages(JSON.stringify(sanitizedPayload));
    try {
        await saveInvoiceToDB(Data, sanitizedPayload, responseData)
            .then(() => {
                return res.status(200).json({ status: 'success' });
            })
            .catch(() => {
                return res.json({ status: 'error', message: `Failed to save invoice: ${sanitizedPayload.invoiceNumber} to DB. Try new invoice` });
            });
    }
    catch (error) {
        const { status, data } = error.response;
        logErrorMessages(`${Data.userName} - ${JSON.stringify(data)}, ${JSON.stringify(sanitizedPayload)}`);
        return res.status(status).json({ status: 'error', message: data });
    }
});

// Post and save refund records
Router.post("/ref", async (req, res) => {
    const Data = req.body;

    if (!Data || !Data.items || !Array.isArray(Data.items)) {
        return res.json({ status: 'Error', message: 'Invalid data structure', data: Data });
    }
    const sanitizedPayload = sanitizePayload(Data);
    // logSuccessMessages(JSON.stringify(sanitizedPayload));
    try {
        if (Array.isArray(sanitizedPayload) || sanitizedPayload) {
            if (resultMessage) {
                await saveInvoiceToDB(Data, sanitizedPayload, response.data)
                    .then(() => {
                        return res.status(200).json({ status: 'success' });
                    })
                    .catch(() => {
                        logErrorMessages(`Failed to save invoice to DB: ${sanitizedPayload}`);
                        return res.json({ status: 'error', message: `Failed to save invoice: ${sanitizedPayload.invoiceNumber} to DB. Try new invoice` });
                    });
            }
            else {
                logErrorMessages(`Unknow GRA error for invoice ${sanitizedPayload}`);
                return res.json({ status: 'error', message: 'GRA response indicates unknown error' });
            }
        } else {
            return res.json({ status: 'error', message: `Sending invoice: ${sanitizedPayload.invoiceNumber} to GRA Failed!` });
        }
    }
    catch (error) {
        const { status, data } = error.response;
        logErrorMessages(`${Data.userName} - ${JSON.stringify(data)}, ${JSON.stringify(sanitizedPayload)}`);
        return res.status(status).json({ status: 'error', message: data });
    }
});

module.exports = Router;
