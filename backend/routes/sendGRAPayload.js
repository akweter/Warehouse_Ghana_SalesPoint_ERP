const { logErrorMessages, logSuccessMessages } = require("../utils/saveLogfile");
const express = require("express");
const axios = require("axios");
require('dotenv').config();

const { GRA_ENDPOINT, GRA_KEY } = process.env;
const { saveRefundInvoice, updateQuotation } = require("../controller/salesNinvoices");
const generateUUID = require("../utils/generateIDs");
const {
    sanitizePayload,
    saveInvoiceToDB,
    addInvoiceProducts,
    updateDBWithGRAResponse,
} = require("../utils/invoiceReform");

const Router = express.Router();

const sampleGARResponse = {
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
    }
}


// Verify Taxpayer TIN
Router.get("/verify/tin/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`${GRA_ENDPOINT}/identification/tin/${id}`, { headers: { 'security_key': GRA_KEY } });
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
    const { infoMsg, invoiceType } = Data;
    // const sanitizedPayload = sanitizePayload(Data);
    // logSuccessMessages(Data);
    try {
        if ((invoiceType && invoiceType === "Proforma Invoice") && (!infoMsg || infoMsg !== "quoteEdit")) {
            await saveInvoiceToDB(Data, sampleGARResponse);
        }
        await addInvoiceProducts(Data);
        res.status(200).json({ status: "success", message: "Transaction success" });
    }
    catch (error) {
        await logErrorMessages(error.message);
        res.status(500).json({ status: 'error', message: `Operation failed. Try new invoice` });
    }
});

// Post and save invoice records
Router.post("/invoice", async (req, res) => {
    const Data = req.body;

    if (!Data || !Data.items || !Array.isArray(Data.items)) {
        logErrorMessages('Invalid payload structure: ', Data)
        return res.status(500).json({ status: 'Error', message: 'Invalid payload structure' });
    }
    const sanitizedPayload = sanitizePayload(Data);
    // logSuccessMessages(sanitizedPayload);
    try {
        await saveInvoiceToDB(Data, sampleGARResponse);
        const response = await axios.post(`${GRA_ENDPOINT}/invoice`, sanitizedPayload, {
            timeout: 10000,
            headers: {
                'security_key': GRA_KEY,
                'Content-Type': 'application/json'
            }
        });
        await updateDBWithGRAResponse(response.data);
        return res.status(200).json({ status: 'success', message: 'Invoice successful' });
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
            logErrorMessages(`Invoice failed: ${errorMessage}`);
            return res.status(400).json({ status: 'error', message: errorMessage });
        } else {
            logErrorMessages(`Request to GRA backend failed: ${error.message || error}`);
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
    // logSuccessMessages(sanitizedPayload);
    try {
        const response = await axios.post(`${GRA_ENDPOINT}/invoice`, sanitizedPayload, { headers: { 'security_key': GRA_KEY } });
        if (response && response.status === 200) {
            const resultMessage = response.data.response.status;
            if (resultMessage) {
                await saveInvoiceToDB(Data, response.data)
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
        const { response: { data } } = error;
        if (data) {
            logErrorMessages(`Request to GRA backend failed: ${data.message}`);
            return res.status(500).json({ status: 'error', message: data.message });
        } else {
            logErrorMessages(`Request to GRA backend failed: ${error}`);
            return res.status(500).json({ status: 'error', message: `Request to GRA backend failed. Please retry.` });
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
        const { response: { data } } = error;
        if (data) {
            logErrorMessages(`Request to GRA backend failed: ${data.message}`);
            return res.status(500).json({ status: 'error', message: data.message });
        } else {
            logErrorMessages(`Request to GRA backend failed: ${error}`);
            return res.status(500).json({ status: 'error', message: `Request to GRA backend failed. Please retry.` });
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
            timeout: 20000,
            headers: {
                'security_key': GRA_KEY,
                'Content-Type': 'application/json'
            }
        });
        updateDBWithGRAResponse(response.data);
        return res.status(200).json({ status: 'success', message: 'Callback processed successfully' });
    }
    catch (error) {
        let errorMessage = "Callback failed! Please try again.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.message;
        }
        logErrorMessages('Error for callback', errorMessage);
        return res.json({ status: 'error', message: errorMessage });
    }
});

module.exports = Router;
