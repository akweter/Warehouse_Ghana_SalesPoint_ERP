// Modules
const Router = require("express").Router();

const { logErrorMessages, logAllMessage } = require("../utils/saveLogfile");
const { saveNewWayBill, saveWaybillProducts, checkBillProducts, updateWaybillProducts } = require('../controller/waybill');
const generateUUID = require("../utils/generateIDs");

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
        products,
    } = req.body;
    const payload = [
        "",
        InvoiceNumber,
        IssuerName,
        CustomerID,
        mod,
        despatchDate, receipientName,
        receipientAddress,
        receipientPhone,
        deliveryName,
        deliveryPhone,
    ]
    try {
        await saveNewWayBill(payload).then(async () => {
            if (products) {
                await Promise.all(products.map(async (item) => {
                    const { Delivered, Ordered, Outstanding, SKU } = item;
                    
                    // Check whether a product already exist
                    // Update when exist or add if not exist
                    const output  = await checkBillProducts(InvoiceNumber, SKU);
                    
                    if (output && output.length > 0) {
                        const payload = [
                            Delivered,
                            Outstanding,
                            InvoiceNumber,
                            SKU,
                        ];
                        await updateWaybillProducts(payload);
                    } 
                    else {
                        const payload = [
                            "",
                            InvoiceNumber,
                            SKU,
                            Ordered,
                            Delivered,
                            Outstanding,
                            generateUUID(),
                        ];
                        await saveWaybillProducts(payload);
                    }
                }));
            }
        });
        logAllMessage(`Success saving waybill`,  req.headers.keyid);
        return res.status(200).json({ status: 'success', message: 'success saving waybill data' });
    }
    catch (err) {
        logErrorMessages(`Error saving waybill invoice product transaction ${JSON.stringify(err)}`, req.headers.keyid);
        return res.status(500).json({ status: 'error', message: "Operations failed. Kindly refresh" });
    }
});

module.exports = Router;
