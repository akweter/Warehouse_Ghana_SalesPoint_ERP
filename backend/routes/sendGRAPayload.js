const { AddNewInvoices, saveRefundInvoice, saveInInvoiceProduct } = require("../controller/salesNinvoices");
const { logErrorMessages, logSuccessMessages, logMessage } = require("../utils/saveLogfile");
const UUID = require('../utils/generateIDs');
const express = require("express");
const axios = require("axios");
require('dotenv').config();

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
    const { items } = sanitizedPayload;

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
        status,
        increment,
        reference,
        delivery,
    } = Data;

    const payload = [
        0,
        increment,
        userName,
        totalAmount,
        status,
        calculationType,
        transactionDate,
        'ORIGINAL',
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
        .then(async ()=>{
            items.map( async (item) => {
                const {
                    itemCode,
                    unitPrice,
                    discountAmount,
                    quantity,
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
                await saveInInvoiceProduct(data)
                .then(()=>{null})
                .catch((err)=>{
                    logErrorMessages(`Error saving products in invoice: ${invoiceNumber} to Database ${JSON.stringify(err)}`);
                    return { status: 'error', message: 'Please refresh and Issue new invoice' };
                });
                logSuccessMessages(`${Data.userName} - ${status} ${invoiceNumber} added successfully`);
                return { status: 'success', gra: responseData.response, payload: sanitizedPayload };
            });
        })
        .catch((error)=>{
            logErrorMessages(`Error saving invoice: ${invoiceNumber} to Database ${JSON.stringify(error)}`)
            return { status: 'error', message: 'Please refresh and Issue new invoice' };
        });
    } catch (err) {
        logErrorMessages(`Error adding Invoice ${invoiceNumber}: ${err.message}`);
        return `Error saving invoice: "${invoiceNumber}"`;
    }
};

// Post and save invoice records
Router.post("/invoice", async (req, res) => {
    const Data = req.body;

    if (!Data || !Data.items || !Array.isArray(Data.items)) {
        return res.json({ status: 'Error', message: 'Invalid data structure', data: Data });
    }
    const sanitizedPayload = sanitizePayload(Data);
    // logSuccessMessages(JSON.stringify(sanitizedPayload));
    try {
        const response = await axios.post(`${GRA_ENDPOINT}/invoice`, sanitizedPayload, {headers: {'security_key': GRA_KEY}});
        if (response.status === 200) {
            const resultMessage = response.data.response.status;
            if (resultMessage) {
                await saveInvoiceToDB(Data, sanitizedPayload, response.data)
                .then(()=>{
                    return res.status(200).json({ status: 'success'});
                })
                .catch(()=>{
                    return res.json({ status: 'error', message: `Failed to save invoice: ${sanitizedPayload.invoiceNumber} to DB. Try new invoice`});
                });
            }
            else {
                logErrorMessages(`Unknow GRA error for invoice ${sanitizedPayload}`);
                return res.json({ status: 'error', message: 'GRA response indicates unknown error' });
            }
        }
    }
    catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            logErrorMessages(`${Data.userName} - ${JSON.stringify(data)}, ${JSON.stringify(sanitizedPayload)}`);
            return res.status(status).json({ status: 'error', message: data});
        }
        else if (error.request) {
            // The request was made but no response was received
            logErrorMessages(`No response received from the server for request: ${JSON.stringify(error.request)} `);
            return res.json({ status: 'error', message: 'Empty response from GRA server'});
        }
        else {
            // Something happened in setting up the request that triggered an error
            logErrorMessages(`Request setup error: ${error}`);
            return res.json({ status: 'error', message: `Oops! Something went wrong. Please reflesh and retry.`});
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
        const response = await axios.post(`${GRA_ENDPOINT}/invoice`, sanitizedPayload, {headers: {'security_key': GRA_KEY}});
        if (response.status === 200) {
            const resultMessage = response.data.response.status;
            if (resultMessage) {
                await saveInvoiceToDB(Data, sanitizedPayload, response.data)
                .then(()=>{
                    return res.status(200).json({ status: 'success'});
                })
                .catch(()=>{
                    logErrorMessages(`Failed to save invoice to DB: ${sanitizedPayload}`);
                    return res.json({ status: 'error', message: `Failed to save invoice: ${sanitizedPayload.invoiceNumber} to DB. Try new invoice`});
                });
            }
            else {
                logErrorMessages(`Unknow GRA error for invoice ${sanitizedPayload}`);
                return res.json({ status: 'error', message: 'GRA response indicates unknown error' });
            }
        }
    }
    catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            logErrorMessages(`${Data.userName} - ${JSON.stringify(data)}, ${JSON.stringify(sanitizedPayload)}`);
            return res.status(status).json({ status: 'error', message: data});
        }
        else if (error.request) {
            // The request was made but no response was received
            logErrorMessages(`No response received from the server for request: ${JSON.stringify(error.request)} `);
            return res.json({ status: 'error', message: 'Empty response from GRA server'});
        }
        else {
            // Something happened in setting up the request that triggered an error
            logErrorMessages(`Request setup error: ${error}`);
            return res.json({ status: 'error', message: `Oops! Something went wrong. Please reflesh and retry.`});
        }
    }
});

// Post and save refund cancellation records
Router.post("/refund/cancellation", async (req, res) => {
    const Data = req.body;

    if (!Data) {
        return res.json({ status: 'Error', message: 'Invalid data structure'});
    }
    try {
        const response = await axios.post(`${GRA_ENDPOINT}/cancellation`, Data, {headers: {'security_key': GRA_KEY}});
        if (response.status === 200) {
            const resultMessage = response.data.response.status;
            if (resultMessage) {
                const { invoiceNumber, reference, userName, flag, transactionDate, totalAmount } = Data;
                const payload = [
                    null,
                    null,
                    null,
                    null,
                    null,
                    userName,
                    totalAmount,
                    flag,
                    null,
                    transactionDate,
                    'ORIGINAL',
                    null,
                    null,
                    invoiceNumber,
                    null,
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
                .then(()=>{
                    logSuccessMessages(`${Data.userName} - performed refund cancellation on invoice: ${JSON.stringify(Data.invoiceNumber)}`)
                    return res.status(200).json({ status: 'success'});
                })
                .catch(()=>{
                    logErrorMessages(`Failed to save refund cancelation invoice for: ${Data.invoiceNumber}`);
                    return res.json({ status: 'error', message: `Failed to save invoice: ${Data.invoiceNumber}`});
                });
            }
            else {
                logErrorMessages(`Unknow GRA error for invoice`);
                return res.json({ status: 'error', message: 'GRA response indicates unknown error' });
            }
        }
    }
    catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            logErrorMessages(`${Data.userName} - ${JSON.stringify(data)}, ${JSON.stringify(Data)}`);
            return res.status(status).json({ status: 'error', message: data});
        }
        else if (error.request) {
            // The request was made but no response was received
            logErrorMessages(`No response received from the server for request: ${JSON.stringify(error.request)} `);
            return res.json({ status: 'error', message: 'Empty response from GRA server'});
        }
        else {
            // Something happened in setting up the request that triggered an error
            logErrorMessages(`Request setup error: ${error}`);
            return res.json({ status: 'error', message: `Oops! Something went wrong. Please reflesh and retry.`});
        }
    }
});

module.exports = Router;
