// Modules
const Router = require("express").Router();

// Projects
const { executeRoute } = require("../utils/handler");
const { logErrorMessages } = require("../utils/saveLogfile"); 

// controller
const {
    cancelledRefundInvoices,
    TodayAllRefundsInvoice,
    TodayRefundsCancellationInvoice,
    countALlrefundInvoices,
    allRefundedProducts,
} = require("../controller/salesNinvoices");
const restructureInvoiceResult = require("../utils/invoiceModifier");
const { thirtySeven } = require("../controller/selectQueries");

// all refund Invoices
Router.get("/", async (req, res) => {
    try {
        const output = await thirtySeven('PARTIAL_REFUND', 'REFUND', 'REFUND');
        const modifiedOutput = restructureInvoiceResult(output);
        return res.status(200).json(modifiedOutput);
    }
    catch (err) {
        logErrorMessages(`Error fetching refundInvoices ${err}`);
        return res.status(500).send("Temporal server error. Kindly refresh");
    }
});

// Get all today refund invoices
Router.get("/today", async (req, res) => {
    try {
        const output = await TodayAllRefundsInvoice();
        return await executeRoute(output, res);
    }
    catch (err) {
        logErrorMessages(`Error fetching today invoices ${err}`);
        return res.status(500).send("Temporal server error. Kindly refresh");
    }
});

// Get all today refund invoices
Router.get("/today/cancelled", async (req, res) => {
    try {
        const output = await TodayRefundsCancellationInvoice();
        return await executeRoute(output, res);
    }
    catch (err) {
        logErrorMessages(`Error fetching today invoices ${err}`);
        return res.status(500).send("Temporal server error. Kindly refresh");
    }
});

// all refunded products
Router.get("/products", async (req, res) => {
    try {
        const output = await allRefundedProducts();
        return await executeRoute(output, res);
    }
    catch (err) {
        logErrorMessages(`Error fetching refundInvoices ${err}`);
        return res.status(500).send("Temporal server error. Kindly refresh");
    }
});

// count all refund Invoices 
Router.get("/countall", async (req, res) => {
    try {
        const output = await countALlrefundInvoices();
        return await executeRoute(output, res);
    }
    catch (err) {
        logErrorMessages(`Error fetching count refund Invoices with products: ${err}`);
        return res.status(500).send("Temporal server error. Kindly refresh");
    }
});

// all refund cancelled Invoices
Router.get("/cancelled", async (req, res) => {
    try {
        const output = await cancelledRefundInvoices();
        return await executeRoute(output, res);
    }
    catch (err) {
        logErrorMessages(`Error fetching refund cancellation invoices: ${err}`);
        return res.status(500).send("Temporal server error. Kindly refresh");
    }
});


module.exports = Router;