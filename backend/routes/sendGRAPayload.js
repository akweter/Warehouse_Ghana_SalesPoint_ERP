const { logErrorMessages, logSuccessMessages, logAllMessage } = require("../utils/saveLogfile");
const express = require("express");
const axios = require("axios");
require('dotenv').config();

const Router = express.Router();

const { GRA_ENDPOINT, GRA_KEY } = process.env;
const { saveRefundInvoice } = require("../controller/salesNinvoices");
const generateUUID = require("../utils/generateIDs");
const {
    sanitizePayload,
    saveInvoiceToDB,
    updateDBWithGRAResponse,
} = require("../utils/invoiceReform");
const { sampleGARResponse } = require("../utils");

// Verify Taxpayer TIN
Router.get("/verify/tin/:id", async (req, res) => {
    const { id } = req.params;
    let response;
    try {
        if (id.startsWith("GHA-")) {
            response = await axios.get(`${GRA_ENDPOINT}/identification/nationalId/${id}`, { headers: { 'security_key': GRA_KEY } });
        } else {
            response = await axios.get(`${GRA_ENDPOINT}/identification/tin/${id}`, { headers: { 'security_key': GRA_KEY } });
        }
        if (response.data) {
            res.status(200).json(response.data);
        }
    } catch (error) {
        res.status(500).send({ status: 'error' });
    }
});

// Check gra server status
Router.get("/status", async (req, res) => {
    try {
        const response = await axios.get(`${GRA_ENDPOINT}/health`, { headers: { 'security_key': GRA_KEY } });
        if (response && response.data) {
            res.status(200).json({ status: response.data.status });
        }
    } catch (error) {
        res.status(500).json({ status: 'down' });
    }
});

// Post Proforma Invoices
Router.post("/quote", async (req, res) => {
    const Data = req.body;
    try {
        await saveInvoiceToDB(Data, sampleGARResponse);
        await logAllMessage(`Quotation number: ${Data.invoiceNumber} submitted sucessfully`, req.headers.keyid);
        res.status(200).json({ status: "success", message: "Quotation transaction success" });
    }
    catch (error) {
        if (error.response) {
            const { data } = error.response;
            let errorMessage;
            if (Array.isArray(data.errors) && data.errors.length > 0) {
                errorMessage = data.errors.join(', ');
            }
            else if (data.message) { errorMessage = data.message;}
            else { errorMessage = 'Unknown error occurred';}
            logErrorMessages(`Quotation failed: ${errorMessage}`, req.headers.keyid);
            return res.status(400).json({ status: 'error', message: errorMessage });
        } else {
            logErrorMessages(`Request to GRA backend failed: ${JSON.stringify(error)}`, req.headers.keyid);
            return res.status(500).json({ status: 'error', message: 'Quotation failed! Please retry.' });
        }
    }
});

// Post and save invoice records
Router.post("/invoice", async (req, res) => {
    const Data = req.body;

    if (!Data || !Data.items || !Array.isArray(Data.items)) {
        logErrorMessages(`Invalid payload structure: ${Data}`, req.headers.keyid)
        return res.status(500).json({ status: 'Error', message: 'Invalid payload structure' });
    }

    const sanitizedPayload = sanitizePayload(Data);
    // logSuccessMessages(Data, req.headers.keyid);
    try {
        const response = await axios.post(`${GRA_ENDPOINT}/invoice`, sanitizedPayload, {
            timeout: 10000,
            headers: {
                'security_key': GRA_KEY,
                'Content-Type': 'application/json'
            }
        });
        await saveInvoiceToDB(Data, response.data);
        logAllMessage(`Invoice number: ${sanitizedPayload.invoiceNumber} submitted sucessfully`, req.headers.keyid);
        res.status(200).json({ status: 'success', message: 'Invoice successful' });
    }
    catch (error) {
        if (error.response) {
            const { data } = error.response;
            let errorMessage;

            if (Array.isArray(data.errors) && data.errors.length > 0) {
                errorMessage = data.errors.join(', ');
            }
            else if (data.message) { errorMessage = data.message;}
            else { errorMessage = 'Unknown error occurred';}
            logErrorMessages(`Invoice failed: ${errorMessage}`, req.headers.keyid);
            return res.status(400).json({ status: 'error', message: errorMessage });
        } else {
            logErrorMessages(`Request to GRA backend failed: ${error.message || error}`, req.headers.keyid);
            return res.status(500).json({ status: 'error', message: 'Invoice failed! Please retry.' });
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
    // logSuccessMessages(sanitizedPayload, req.headers.keyid);
    try {
        const response = await axios.post(`${GRA_ENDPOINT}/invoice`, sanitizedPayload, { 
            headers: { 'security_key': GRA_KEY }, 
            timeout: 10000});
        if (response && response.status === 200) {
            if (response.data.response.status) {
                await saveInvoiceToDB(Data, response.data);
                res.status(200).json({ status: "success", message: "Refund transaction success" });
            }
            else {
                logErrorMessages(`Unknow GRA error for refund ${JSON.stringify(response.data)}`, req.headers.keyid);
                return res.json({ status: 'error', message: 'GRA response indicates unknown error' });
            }
        } else {
            res.json({ status: 'error', message: `Refunding invoice: ${sanitizedPayload.invoiceNumber} to GRA Failed!` });
        }
    }
    catch (error) {
        if (error.response) {
            const { data } = error.response;
            let errorMessage;

            if (Array.isArray(data.errors) && data.errors.length > 0) {
                errorMessage = data.errors.join(', ');
            }
            else if (data.message) { errorMessage = data.message;}
            else { errorMessage = 'Unknown error occurred';}
            logErrorMessages(`Refund failed: ${errorMessage}`, req.headers.keyid);
            return res.json({ status: 'error', message: errorMessage });
        } else {
            logErrorMessages(`Request to GRA backend failed: ${error.message || error}`, req.headers.keyid);
            return res.status(500).json({ status: 'error', message: 'Refund failed! Please retry.' });
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
            if (response.data.response.status) {
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
                    null,
                    generateUUID(),
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
                await saveRefundInvoice(payload);
            }
            else {
                logErrorMessages(`Unknow GRA error for invoice cancellation ${JSON.stringify(response.data)}`, req.headers.keyid);
                return res.json({ status: 'error', message: 'GRA response indicates unknown error' });
            }
        } else {
            logErrorMessages(`Sending invoice cancellation to GRA failed ${JSON.stringify(response.data)}`, req.headers.keyid);
            res.json({ status: 'error', message: `Transaction failed` });
        }
    }
    catch (error) {
        if (error.response) {
            const { data } = error.response;
            let errorMessage;

            if (Array.isArray(data.errors) && data.errors.length > 0) {
                errorMessage = data.errors.join(', ');
            }
            else if (data.message) { errorMessage = data.message;}
            else { errorMessage = 'Unknown error occurred';}
            logErrorMessages(`Refund Cancellation failed: ${errorMessage}`, req.headers.keyid);
            return res.status(400).json({ status: 'error', message: errorMessage });
        } else {
            logErrorMessages(`Request to GRA backend failed: ${error.message || error}`, req.headers.keyid);
            return res.status(500).json({ status: 'error', message: 'Invoice failed! Please retry.' });
        }
    }
});

// make call back
Router.post("/callback", async (req, res) => {
    const Data = req.body;
    const { invoiceNumber, reference, flag, InvoiceNumber, Reference } = Data;

    if (!Data || !(Array.isArray(Data.items) || Array.isArray(Data.products))) {
        return res.status(400).json({ status: 'error', message: 'Invalid payload structure', payload: Data });
    }
    const cbPayload = {
        reference: reference || Reference,
        invoiceNumber: invoiceNumber || InvoiceNumber,
        flag: flag,
    }
    try {
        const response = await axios.post(`${GRA_ENDPOINT}/invoice/callback`, cbPayload, {
            timeout: 10000,
            headers: {
                'security_key': GRA_KEY,
                'Content-Type': 'application/json'
            }
        });
        updateDBWithGRAResponse(response.data);
        return res.status(200).json({ status: 'success', message: 'Callback processed successfully' });
    }
    catch (error) {
        if (error.response) {
            const { data } = error.response;
            let errorMessage;

            if (Array.isArray(data.errors) && data.errors.length > 0) {
                errorMessage = data.errors.join(', ');
            }
            else if (data.message) { errorMessage = data.message;}
            else { errorMessage = 'Unknown error occurred';}
            logErrorMessages(`Error for callback: ${errorMessage}`, req.headers.keyid);
            return res.status(400).json({ status: 'error', message: errorMessage });
        } else {
            logErrorMessages(`Request to GRA backend failed: ${error.message || error}`, req.headers.keyid);
            return res.status(500).json({ status: 'error', message: 'Invoice failed! Please retry.' });
        }
    }
});

module.exports = Router;
