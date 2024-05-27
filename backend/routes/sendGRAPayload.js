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

// Verify Taxpayer TIN
Router.get("/verify/tin/:id", async (req, res) => {
    const { id } = req.params;
    const response = await axios.get(`${GRA_ENDPOINT}/identification/tin/${id}`, { headers: { 'security_key': GRA_KEY } });
    if (response.data) {
        res.status(200).json(response.data);
    }
    res.status(500).send({ status: 'error' });
});

// Check gra server status
Router.get("/status", async (req, res) => {
    const response = await axios.get(`${GRA_ENDPOINT}/health`, { headers: { 'security_key': GRA_KEY } });
    if (response && response.data) {
        res.status(200).json({ status: response.data.status });
    }
    res.status(500).json({ status: 'down' });
});

// Post Quotation invoices
Router.post("/quote", async (req, res) => {
    const Data = req.body;
    const sanitizedPayload = sanitizePayload(Data);

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
    try {
        await saveInvoiceToDB(Data, sanitizedPayload, responseData);
        return res.status(200).json({ status: 'success' });
    }
    catch (error) {
        return res.json({ status: 'error', message: `Failed to save invoice: ${sanitizedPayload.invoiceNumber} to DB. Try new invoice` });
    }
});

// Post and save invoice records
Router.post("/invoice", async (req, res) => {
    const Data = req.body;

    if (!Data || !Data.items || !Array.isArray(Data.items)) {
        return res.json({ status: 'Error', message: 'Invalid data structure', data: Data });
    }
    const sanitizedPayload = sanitizePayload(Data);
    // logSuccessMessages(JSON.stringify(sanitizedPayload));
    try {
        const response = await axios.post(`${GRA_ENDPOINT}/invoice`, sanitizedPayload, { headers: { 'security_key': GRA_KEY } });
        if (response && response.status === 200) {
            const resultMessage = response.data.response.status;
            if (resultMessage) {
                await saveInvoiceToDB(Data, sanitizedPayload, response.data)
                    .then(() => {
                        return res.status(200).json({ status: 'success' });
                    })
                    .catch(() => {
                        return res.json({ status: 'error', message: `Failed to save invoice: ${sanitizedPayload.invoiceNumber} to DB. Try new invoice` });
                    });
            }
            else {
                logErrorMessages(`Unknow GRA error for invoice ${sanitizedPayload}`);
                return res.json({ status: 'error', message: 'Request GRA response indicates unknown error' });
            }
        }
        else {
            return res.json({ status: 'error', message: `Sending invoice: ${sanitizedPayload.invoiceNumber} to GRA Failed!` });
        }
    }
    catch (error) {
        if (error.response) {
        }
        else if (error.request) {
            // The request was made but no response was received
            logErrorMessages(`No response received from the server for request: ${JSON.stringify(error.request)} `);
            return res.json({ status: 'error', message: 'Empty response from GRA server' });
        }
        else {
            // Something happened in setting up the request that triggered an error
            logErrorMessages(`Request setup error: ${error}`);
            return res.json({ status: 'error', message: `Oops! Something went wrong. Please reflesh and retry.` });
        }
    }
});

// Post and save refund records
Router.post("/refund", async (req, res) => {
    const Data = req.body;

    if (!Data || !Data.items || !Array.isArray(Data.items)) {
        return res.json({ status: 'Error', message: 'Invalid data structure', data: Data });
    }
    const sanitizedPayload = sanitizePayload(Data);
    // logSuccessMessages(JSON.stringify(sanitizedPayload));
    try {
        const response = await axios.post(`${GRA_ENDPOINT}/invoice`, sanitizedPayload, { headers: { 'security_key': GRA_KEY } });
        if (response && response.status === 200) {
            const resultMessage = response.data.response.status;
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
        if (error.response) {
            const { status, data } = error.response;
            logErrorMessages(`${Data.userName} - ${JSON.stringify(data)}, ${JSON.stringify(sanitizedPayload)}`);
            return res.status(status).json({ status: 'error', message: data });
        }
        else if (error.request) {
            // The request was made but no response was received
            logErrorMessages(`No response received from the server for request: ${JSON.stringify(error.request)} `);
            return res.json({ status: 'error', message: 'Empty response from GRA server' });
        }
        else {
            // Something happened in setting up the request that triggered an error
            logErrorMessages(`Request setup error: ${error}`);
            return res.json({ status: 'error', message: `Oops! Something went wrong. Please reflesh and retry.` });
        }
    }
});

// Post and save refund cancellation records
Router.post("/refund/cancellation", async (req, res) => {
    const Data = req.body;

    if (!Data) {
        return res.json({ status: 'Error', message: 'Invalid data structure' });
    }
    try {
        const response = await axios.post(`${GRA_ENDPOINT}/cancellation`, Data, { headers: { 'security_key': GRA_KEY } });
        if (response && response.status === 200) {
            const resultMessage = response.data.response.status;
            if (resultMessage) {
                const { invoiceNumber, reference, userName, flag, totalAmount } = Data;
                const payload = [
                    null,
                    null,
                    userName,
                    totalAmount,
                    flag,
                    null,
                    new Date(),
                    null,
                    null,
                    invoiceNumber,
                    null,
                    null,
                    null,
                    null,
                    UUID(),
                    reference,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                ];

                await saveRefundInvoice(payload)
                    .then(() => {
                        logSuccessMessages(`${userName} - ${flag} on reference ${reference} for invoice ${invoiceNumber}`);
                        return res.status(200).json({ status: 'success' });
                    })
                    .catch(() => {
                        logErrorMessages(`Failed to save refund cancelation invoice for: ${Data.invoiceNumber}`);
                        return res.json({ status: 'error', message: `Failed to save invoice: ${Data.invoiceNumber}` });
                    });
            }
            else {
                logErrorMessages(`Unknow GRA error for invoice`);
                return res.json({ status: 'error', message: 'GRA response indicates unknown error' });
            }
        } else {
            return res.json({ status: 'error', message: `Sending invoice: ${sanitizedPayload.invoiceNumber} to GRA Failed!` });
        }
    }
    catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            logErrorMessages(`${Data.userName} - ${JSON.stringify(data)}, ${JSON.stringify(Data)}`);
            return res.status(status).json({ status: 'error', message: data });
        }
        else if (error.request) {
            // The request was made but no response was received
            logErrorMessages(`No response received from the server for request: ${JSON.stringify(error.request)} `);
            return res.json({ status: 'error', message: 'Empty response from GRA server' });
        }
        else {
            // Something happened in setting up the request that triggered an error
            logErrorMessages(`Request setup error: ${error}`);
            return res.json({ status: 'error', message: `Oops! Something went wrong. Please reflesh and retry.` });
        }
    }
});

module.exports = Router;
