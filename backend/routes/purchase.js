const Router = require("express").Router();

// Projects
const { logErrorMessages } = require("../utils/saveLogfile"); 
const { restructureInvoiceResult } = require("../utils/invoiceModifier");
const { salesNRefundInvoices } = require("../controller/salesNinvoices");

// all purchase Invoices
Router.get("/", async (req, res) => {
    try {
        const output = await salesNRefundInvoices('PURCHASE', 'PURCHASE', 'PURCHASE', 'null');
        const modifiedOutput = restructureInvoiceResult(output);
        return res.status(200).json(modifiedOutput);
    }
    catch (err) {
        logErrorMessages(`Error: fetching all purchase transactions failed ${JSON.stringify(err)}`, req.headers.keyid);
        return res.status(500).json({status: "error", message: "Operations failed. Kindly refresh"});
    }
});

module.exports = Router;