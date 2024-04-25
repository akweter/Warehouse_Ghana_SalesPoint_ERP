const { logErrorMessages, logSuccessMessages } = require("../utils/saveLogfile");
const UUID = require('../utils/generateIDs');
const express = require("express");
const axios = require("axios");
require('dotenv').config();

const {
    AddNewInvoices,
    saveRefundInvoice,
    saveInInvoiceProduct,
    updateRefundProducts,
} = require("../controller/salesNinvoices");

const Router = express.Router();

const { GRA_ENDPOINT, GRA_KEY } = process.env;

const filterFields = (obj, fieldsToRemove) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !fieldsToRemove.includes(key))
    );
};

const sanitizePayload = (data) => {
    const itemsFieldsToRemove = [
        "itemSubtotal",
        "totalVat",
        "totalLevy",
        "totalAmount",
        "saleType",
        "calculationType",
        "currency",
        "exchangeRate",
        "alt",
        "refProQty",
    ];

    const mainFieldsToRemove = [
        "invCusId",
        "remarks",
        "unitPrice",
        "quantity",
        "itemSubtotal",
        "remarks",
        "nhil",
        "getfund",
        "covid",
        "cst",
        "tourism",
        "increment",
        "status",
        "delivery"
    ];

    let sanitizedPayload = { ...data };
    sanitizedPayload = filterFields(sanitizedPayload, mainFieldsToRemove);
    sanitizedPayload.items = sanitizedPayload.items.map((item) =>
        filterFields(item, itemsFieldsToRemove)
    );
    return sanitizedPayload;
};

const saveInvoiceToDB = async (Data, sanitizedPayload, responseData) => {
    const { items } = Data;

    const {
        userName,
        totalAmount,
        transactionDate,
        currency,
        invoiceNumber,
        businessPartnerTin,
        discountAmount,
        totalVat,
        exchangeRate,
        remarks,
        nhil,
        getfund,
        covid,
        cst,
        tourism,
        calculationType,
        saleType,
        discountType,
        increment,
        reference,
        delivery,
        invoiceType,
    } = Data;
 
    const payload = [
        0,
        increment,
        userName,
        totalAmount,
        invoiceType,
        calculationType,
        transactionDate,
        currency,
        saleType,
        invoiceNumber,
        businessPartnerTin,
        discountAmount,
        exchangeRate,
        totalVat,
        UUID(),
        reference,
        remarks,
        nhil,
        getfund,
        covid,
        cst,
        tourism,
        discountType,
        responseData.response.message.ysdcid,
        responseData.response.message.ysdcrecnum,
        responseData.response.message.ysdcintdata,
        responseData.response.message.ysdcregsig,
        responseData.response.message.ysdcmrc,
        responseData.response.message.ysdcmrctim,
        responseData.response.message.ysdctime,
        responseData.response.qr_code,
        delivery,
    ];

    try {
        await AddNewInvoices(payload)
            .then(async () => {
                if (items) {
                    items.map(async (item) => {
                        const {
                            itemCode,
                            unitPrice,
                            discountAmount,
                            quantity,
                            refProQty,
                        } = item;
                        const data = [
                            UUID(),
                            invoiceNumber,
                            itemCode,
                            unitPrice,
                            discountAmount,
                            quantity,
                            0,
                        ];

                        const update = [
                            quantity,
                            itemCode,
                            invoiceNumber,
                        ]

                        if (invoiceType === 'Invoice') {
                            await saveInInvoiceProduct(data)
                                .then(() => { null })
                                .catch((err) => {
                                    logErrorMessages(`Error saving products: ${itemCode} for invoice ${invoiceNumber}, <> ${JSON.stringify(err)}`);
                                    return { status: 'error', message: 'Please refresh and Issue new invoice' };
                                })
                        }
                        else if (invoiceType === 'REFUND' || invoiceType === 'Partial_Refund') {
                            await updateRefundProducts(update)
                                .then(() => { null })
                                .catch((err) => {
                                    logErrorMessages(`Error updating products refunded qty:${itemCode} for invoice ${invoiceNumber}, <> ${JSON.stringify(err)}`);
                                    return { status: 'error', message: 'Please refresh and Issue new invoice' };
                                });
                        }
                    });
                }
                logSuccessMessages(`${Data.userName} - ${invoiceType} ${invoiceNumber} added successfully`);
                return { status: 'success', gra: responseData.response, payload: sanitizedPayload };
            })
            .catch((error) => {
                logErrorMessages(`Error saving invoice: ${invoiceNumber} to Database ${JSON.stringify(error)}`)
                return { status: 'error', message: 'Please refresh and Issue new invoice' };
            });
    } catch (err) {
        logErrorMessages(`Error adding Invoice ${invoiceNumber}: ${err.message}`);
        return `Error saving invoice: "${invoiceNumber}"`;
    }
};

// Check gra server status
Router.get("/status", async (req, res) => {
    const response = await axios.get(`${GRA_ENDPOINT}/health`, { headers: { 'security_key': GRA_KEY } });
    if (response.data) {
        res.status(200).json({ status: response.data.status });
    }
    res.status(500).json({ status: 'down' });
});

// Post Quotation invoices
Router.post("/quote", async (req, res) => {
    const Data = req.body;
    const sanitizedPayload = sanitizePayload(Data);
    const message = {
        responseData: {
            response: {
                message: {
                    ysdcid: "",
                    ysdcrecnum: "",
                    ysdcintdata: "",
                    ysdcregsig: "",
                    ysdcmrc: "",
                    ysdcmrctim: "",
                    ysdctime: "",
                },
                qr_code: "",
            },
        }
    }
    try {
        await saveInvoiceToDB(Data, sanitizedPayload, message);
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
                const { invoiceNumber, reference, userName, flag, transactionDate, totalAmount } = Data;
                const payload = [
                    null,
                    null,
                    userName,
                    totalAmount,
                    flag,
                    null,
                    transactionDate,
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
