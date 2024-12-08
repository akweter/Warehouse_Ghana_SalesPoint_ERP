const { fetchAllDeliveries } = require("../controller/delivery");
const { logErrorMessages } = require("../utils/saveLogfile");

// Modules
const Router = require("express").Router();

// all delivered transactions
Router.get("/", async (req, res) => {
    try {
        const output = await fetchAllDeliveries();
        res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(`Error fetching deliveries ${err}`, req.headers.keyid);
        res.status(500).send({status: 'error', message: "Operations failed. Kindly refresh"});
    }
});

module.exports = Router;
