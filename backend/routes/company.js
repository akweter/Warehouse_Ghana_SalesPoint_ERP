const Router = require("express").Router();
const { logErrorMessages } = require("../utils/saveLogfile");

const { getCompanyData, AddCompanyInfo } = require("../controller/postQuesrries");

// Get all company Data
Router.get("/", async (req, res) => {
    try {
        const data = await getCompanyData();
        return res.status(200).json({ status: "success", data: data });
    }
    catch (err) {
        logErrorMessages("Adding company Data failed" + err);
        return res.status(500).json({ message: `Adding ${username} failed!` });
    }
});

// Add new company Data
Router.post("/:id", async (req, res) => {
    const { id } = req.params;
    const {
        fname,
        lname,
        username,
        userPhone,
        userType,
        userDept,
        staffID,
        address,
    } = req.body;

    const comData = {
        Usr_FName: fname,
        Usr_LName: lname,
        Usr_name: username,
        Usr_phone: userPhone,
        Usr_type: userType,
        Usr_dept: userDept,
        Usr_StaffID: staffID,
        Usr_address: address
    };

    try {
        await AddCompanyInfo(comData);
        return res.status(200).json({ message: "success" });
    }
    catch (err) {
        logErrorMessages("Adding company Data failed" + err);
        return res.status(500).json({ message: `Adding ${username} failed!` });
    }
});

module.exports = Router;