const { fetchUsersActivities } = require("../controller/activityTrails");
const { logErrorMessages } = require("../utils/saveLogfile");

// Modules
const Router = require("express").Router();

// all user actions
Router.get("/", async (req, res) => {
    try {
        const output = await fetchUsersActivities();
        res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(`Error: fetching user actitivies failed ${err}`, req.headers.keyid);
        res.status(500).send({status: 'error', message: "Operations failed. Kindly refresh"});
    }
});

module.exports = Router;
