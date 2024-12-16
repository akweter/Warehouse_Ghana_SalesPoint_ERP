const { fetchAllDeliveries } = require("../controller/delivery");
const { restructureWaybillOutput } = require("../utils/invoiceModifier");
const { logErrorMessages } = require("../utils/saveLogfile");

// Modules
const Router = require("express").Router();

// all delivered transactions
Router.get("/", async (req, res) => {
    try {
        const output = await fetchAllDeliveries();
        const modifiedOutput = restructureWaybillOutput (output);
        return res.status(200).json(modifiedOutput);
    }
    catch (err) {
        logErrorMessages(`Error fetching deliveries ${err}`, req.headers.keyid);
        res.status(500).send({status: 'error', message: "Operations failed. Kindly refresh"});
    }
});

module.exports = Router;
