// Modules
const Router = require("express").Router();

const { logErrorMessages } = require("../utils/saveLogfile");

// controller
const {
    inventoryItemsWithSupplier,
    totalItemsQuantity,
    Inv_Sale_Type,
    invoiceWithCustomers,
} = require("../controller/test");


// only all sales invoices numbers
Router.get("/", async (req, res) => {
    try {
        const output = await inventoryItemsWithSupplier();
        return res.status(200).send(output);
    }
    catch (err) {
        logErrorMessages(`Error fetching all invoices: ${err}`);
        return res.status(500).send("Temporal server error. Kindly refresh");
    }
});

// only all sales invoices numbers
Router.get("/itemqty", async (req, res) => {
    try {
        const output = await totalItemsQuantity();
        return res.status(200).send(output);
    }
    catch (err) {
        logErrorMessages(`Error fetching all invoices: ${err}`);
        return res.status(500).send("Temporal server error. Kindly refresh");
    }
});

// only all sales invoices numbers
Router.get("/saletype", async (req, res) => {
    try {
        const output = await Inv_Sale_Type();
        return res.status(200).send(output);
    }
    catch (err) {
        logErrorMessages(`Error fetching all invoices: ${err}`);
        return res.status(500).send("Temporal server error. Kindly refresh");
    }
});

// invoices along with customer information:
Router.get("/invoiceWithCustomers", async (req, res) => {
    try {
        const output = await invoiceWithCustomers();
        return res.status(200).send(output);
    }
    catch (err) {
        logErrorMessages(`Error fetching all invoices: ${err}`);
        return res.status(500).send("Temporal server error. Kindly refresh");
    }
});

module.exports = Router;

