const Router = require("express").Router();

// Projects
const { logErrorMessages } = require("../utils/saveLogfile"); 
const { restructureInvoiceResult } = require("../utils/invoiceModifier");
const {
    cancelledRefundInvoices,
    TodayAllRefundsInvoice,
    TodayRefundsCancellationInvoice,
    countALlrefundInvoices,
    allRefundedProducts,
    salesNRefundInvoices,
} = require("../controller/salesNinvoices");

// all refund Invoices
Router.get("/", async (req, res) => {
    try {
        const output = await salesNRefundInvoices('Partial_Refund', 'Refund', 'Refund_Cancellation', 'http');
        const modifiedOutput = restructureInvoiceResult(output);
        return res.status(200).json(modifiedOutput);
    }
    catch (err) {
        logErrorMessages(`Error fetching all refunded Invoices ${err}`, req.headers.keyid);
        return res.status(500).send("Operations failed. Kindly refresh");
    }
});

// Get all today refund invoices
Router.get("/today", async (req, res) => {
    try {
        const output = await TodayAllRefundsInvoice();
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(`Error fetching today refunds ${err}`, req.headers.keyid);
        return res.status(500).send("Operations failed. Kindly refresh");
    }
});

// Get all today refund invoices
Router.get("/today/cancelled", async (req, res) => {
    try {
        const output = await TodayRefundsCancellationInvoice();
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(`Error fetching today cancelled refunds ${err}`, req.headers.keyid);
        return res.status(500).send("Operations failed. Kindly refresh");
    }
});

// all refunded products
Router.get("/products", async (req, res) => {
    try {
        const output = await allRefundedProducts();
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(`Error fetching refund products ${err}`, req.headers.keyid);
        return res.status(500).send("Operations failed. Kindly refresh");
    }
});

// count all refund Invoices 
Router.get("/countall", async (req, res) => {
    try {
        const output = await countALlrefundInvoices();
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(`Error fetching count refund Invoices with products: ${err}`, req.headers.keyid);
        return res.status(500).send("Operations failed. Kindly refresh");
    }
});

// all refund cancelled Invoices
Router.get("/cancelled", async (req, res) => {
    try {
        const output = await cancelledRefundInvoices();
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(`Error fetching refund cancellation invoices: ${err}`, req.headers.keyid);
        return res.status(500).send("Operations failed. Kindly refresh");
    }
});


module.exports = Router;