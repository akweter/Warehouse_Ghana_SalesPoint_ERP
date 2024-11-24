// Modules
const Router = require("express").Router();

const { logErrorMessages } = require("../utils/saveLogfile");
const { saveNewWayBill } = require('../controller/waybill');

// save all waybill
Router.post("/", async (req, res) => {
    const {
        InvoiceNumber,
        IssuerName,
        CustomerID,
        mod,
        despatchDate,
        receipientName,
        receipientAddress,
        receipientPhone,
        deliveryName,
        deliveryPhone,
     } = req.body;
     const payload = [
        "",
        InvoiceNumber,
        IssuerName,
        CustomerID,
        mod,
        despatchDate,receipientName,
        receipientAddress,
        receipientPhone,
        deliveryName,
        deliveryPhone,
     ]
    try {
        const output = await saveNewWayBill(payload);
        return res.status(200).json({ status: 'success', message: 'success saving waybill data' });
    }
    catch (err) {
        logErrorMessages(`Error fetching all refunded Invoices ${err}`, req.headers.keyid);
        return res.status(500).json({status: 'error', message: "Operations failed. Kindly refresh"});
    }
});

module.exports = Router;
