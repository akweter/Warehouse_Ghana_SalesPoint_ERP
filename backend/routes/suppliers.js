const Router = require("express").Router();
const { logErrorMessages, logAllMessage } = require("../utils/saveLogfile");
const {
    allSuppliers,
    oneSupplier,
    supplierStats,
    suppliersByType,
    suppliersByRating,
    suppliersByProduct,
    suppliersByExemption,
    suppliersByTin,
    suppliersByEmail,
    activeSupplierByType,
    inactiveSuppliersByType,
    activeSuppliersByRating,
    inactiveSuppliersByRating,
    querySupplier,
    foreignSuppliers,
    localSuppliers,
    updateSupplier,
    addSupplier,
} = require("../controller/suppliers");

/**********************************      GET REQUESTS      *********************************/

// Retrieve All Suppliers
Router.get("/", async (req, res, next) => {
    try {
        const output = await allSuppliers();
        if (output.length === 0) {
            return res.status(404).send("Users not found");
        }
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again" });
    }
});

// Get all foreign suppliers
Router.get("/foreigns", async (req, res) => {
    try {
        const output = await foreignSuppliers();
        res.status(200).json({ status: 'success', message: output });
    }
    catch (error) {
        logErrorMessages(`Error fetching local suppliers: ${err}`, req.headers.keyid);
        return res.status(500).send("Temporal server error. Kindly refresh");
    }
});

// Get all local suppliers
Router.get("/locals", async (req, res) => {
    try {
        const output = await localSuppliers();
        res.status(200).json({ status: 'success', message: output });
    }
    catch (error) {
        logErrorMessages(`Error fetching foreign suppliers: ${err}`, req.headers.keyid);
        return res.status(500).send("Temporal server error. Kindly refresh");
    }
});

// Get suppliers base on status
Router.get("/stats", async (req, res, next) => {
    const userID = req.body.sup_status;
    try {
        const output = await supplierStats(userID);
        if (output.length === 0) {
            return res.status(404).send("Users not found");
        }
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again" });
    }
});

// Get suppliers based on type(foreign or local)
Router.get("/type", async (req, res, next) => {
    const userID = req.body.sup_type;
    try {
        const output = await suppliersByType(userID);
        if (output.length === 0) {
            return res.status(404).send("Suppliers not found");
        }
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again" });
    }
});

// Get suppliers based on rating
Router.get("/rating", async (req, res, next) => {
    const userID = req.body.Rating;
    try {
        const output = await suppliersByRating(userID);
        if (output.length === 0) {
            return res.status(404).send("Supplier not found");
        }
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again" });
    }
});

// Get suppliers based on the product they outsource
Router.get("/product", async (req, res, next) => {
    const userID = req.body.Sup_pro_id;
    try {
        const output = await suppliersByProduct(userID);
        if (output.length === 0) {
            return res.status(404).send("No supplier is currently supplying that product");
        }
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again" });
    }
});

// Get suppliers whether they are exempted or not
Router.get("/exempted", async (req, res, next) => {
    const userID = req.body.Sup_exempted;
    try {
        const output = await suppliersByExemption(userID);
        if (output.length === 0) {
            return res.status(404).send("Either exempted or taxable supplier was not found");
        }
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again" });
    }
});

// Get suppliers based on the selected tin number
Router.get("/tin", async (req, res, next) => {
    const userID = req.body.Sup_tin;
    try {
        const output = await suppliersByTin(userID);
        if (output.length === 0) {
            return res.status(404).send("No supplier found with that tin");
        }
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again" });
    }
});

// Get suppliers based on their email
Router.get("/email", async (req, res, next) => {
    const ID = req.body.Sup_email;
    try {
        const output = await suppliersByEmail(ID);
        if (output.length === 0) {
            return res.status(404).send("No supplier found with that email");
        }
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again" });
    }
});

// Get whether a supplier is active and has either (local || foregn) type.
Router.get("/active/type", async (req, res, next) => {
    const ID = req.body.Suptype;
    try {
        const output = await activeSupplierByType(ID);
        if (output.length === 0) {
            return res.status(404).send("No supplier found");
        }
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again" });
    }
});

// Get whether a supplier is inactive and has either (local || foregn) type.
Router.get("/inactive/type", async (req, res, next) => {
    const ID = req.body.Suptype;
    try {
        const output = await inactiveSuppliersByType(ID);
        if (output.length === 0) {
            return res.status(404).send("No supplier found");
        }
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again" });
    }
});

// Get if inactive supplier is either (local || foregn)
Router.get("/active/rating", async (req, res, next) => {
    const ID = req.body.Rating;
    try {
        const output = await activeSuppliersByRating(ID);
        if (output.length < 1) {
            return res.status(404).send("No supplier found");
        }
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again" });
    }
});

// Get if inactive suppliers is either (local || foregn)
Router.get("/inactive/rating", async (req, res, next) => {
    const ID = req.body.Rating;
    try {
        const output = await inactiveSuppliersByRating(ID);
        if (output.length === 0) {
            return res.status(404).send("No supplier found");
        }
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again" });
    }
});

// Search supplier with keywords
Router.get("/query", async (req, res, next) => {
    const query = req.query.search;
    const result = '%' + query + '%'
    try {
        const output = await querySupplier(result);
        res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages("Searching supplier failed" + err);
        res.status(500).send('Searching supplier failed');
    }
});

// Get user information based on the ID
Router.get("/:id", async (req, res, next) => {
    const userID = req.params.id;
    try {
        const output = await oneSupplier(userID);
        if (output.length === 0) {
            return res.status(404).send("User not found");
        }
        return res.status(200).json(output);
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        return res.status(500).json({ status: "error", message: "Something went wrong. Please try again" });
    }
});

/*******************************    END OF GET REQUESTS    **********************************/

// Post supplier info addSupplier /add/new
Router.post("/add/new", async (req, res) => {
    const {
        userEmail,
        userActive,
        userPhone,
        userAddress,
        userRegion,
        userExemption,
        userRating,
        userTIN,
        userName,
    } = req.body;

    const payload = [
        userName,
        userTIN,
        userAddress,
        userPhone,
        userRegion,
        userActive,
        userEmail,
        userExemption,
        userRating,
        generateUUID(),
        new Date(),
    ];
    try {
        await addSupplier(payload);
        logAllMessage(`New supplier upplier (${payload[0]}) added`, req.headers.keyid);
        res.status(200).json({ status: 'success', message: "Supplier added" });
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        res.status(500).send("Adding new supplier failed! Please try again");
    }
});

// Update a particular user based on the ID
Router.put("/update/:id", async (req, res, next) => {
    const { id } = req.params;
    const {
        userName,
        userTIN,
        userAddress,
        userPhone,
        userRegion,
        userActive,
        userEmail,
        userExemption,
        userRating,
    } = req.body;

    const userData = {
        C_email: userEmail,
        C_status: userActive,
        C_name: userName,
        C_phone: userPhone,
        C_exempted: userExemption,
        C_tin: userTIN,
        C_address: userAddress,
        C_region: userRegion,
        C_rating: userRating,
    };
    try {
        await updateSupplier(userData, id);
        logAllMessage(`Supplier (${userData.C_name}) updated`, req.headers.keyid);
        return res.status(200).json({ message: "success" });
    }
    catch (err) {
        logErrorMessages(err, req.headers.keyid);
        return res.status(500).json({ message: `Failed to update ${userName}` });
    }
});

module.exports = Router;