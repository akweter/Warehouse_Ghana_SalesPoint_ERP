// Modules
const Router = require("express").Router();

// Projects
const { logErrorMessages } = require("../utils/saveLogfile");
const generateUUID = require("../utils/generateIDs");

// controller
const {
  allCus_Inv_Pro,
  allCustomers,
  queryCustomer,
  status,
  Region,
  Exempt,
  oneRating,
  Searches,
  CustomerByTIn,
  addCustomer,
  updateCustomer,
} = require("../controller/customers");
const { updateSupplier, addSupplier } = require("../controller/suppliers");

// all customers and suppliers
Router.get("/customersnsuppliers", async (req, res, next) => {
  try {
    const output = await allCus_Inv_Pro();
    return res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages("Select All customers error" + err);
    return res.status(500).send("Fetching all customers failed");
  }
});

// all customers
Router.get("/", async (req, res, next) => {
  try {
    const output = await allCustomers();
    return res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages("" + err);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Search customer with keywords
Router.get("/query", async (req, res, next) => {
  const query = req.query.search;
  const result = '%' + query + '%'
  try {
    const output = await queryCustomer(result);
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages("" + err);
    res.status(500).send({ status: "error", message: "product not found" });
  }
});

// customers status (active || inactive)
Router.get("/status", async (req, res, next) => {
  const stat = req.body.status;
  try {
    const output = await status(stat);
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages((err));
    res.status(500).send({ status: "error", message: "Status not found" });
  }
});

// Customers Region
Router.get("/region", async (req, res, next) => {
  const stat = req.body.type;
  try {
    const output = await Region(stat);
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages("" + err);
    res.status(500).send({ status: "error", message: "region not found" });
  }
});

// Exempted Customers
Router.get("/exempt", async (req, res, next) => {
  const stat = req.body.exempt;
  try {
    const output = await Exempt(stat);
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages((err));
    res.status(500).send({ status: "error", message: "exemption not found" });
  }
});

// One customer Rating
Router.get("/rate/one", async (req, res, next) => {
  const rate = req.body.rate;
  try {
    const output = await oneRating(rate);
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages("" + err);
    res.status(500).send({ status: "error", message: "The rating is not found for the tp" });
  }
});

// All Searches 
Router.get("/search", async (req, res, next) => {
  const { search } = req.body;
  const searchTerm = '%' + search + '%';
  const Value = [searchTerm, searchTerm, searchTerm, searchTerm];
  try {
    const output = await Searches(Value);
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages("" + err);
    res.status(500).send({ status: "error", message: "Search for tp not found" });
  }
});

// Get user information based on the ID
Router.get("/:id", async (req, res, next) => {
  const userID = req.params.id;
  try {
    const output = await CustomerByTIn(userID);
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages("" + err);
    res.status(500).send({ status: "error", message: "Customer information not found" });
  }
});

// Post customer or supplier info addSupplier /add/new
Router.post("/add/new", async (req, res, next) => {
  const {
    userEmail,
    userActive,
    userPhone,
    userAddress,
    userRegion,
    userType,
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

  if (userType === 'customer') {
    try {
      const output = await addCustomer(payload);
      res.status(200).json({ status: 'success', data: output });
    }
    catch (err) {
      logErrorMessages((err));
      res.status(500).send("Adding new customer failed! Please try again");
    }
  }
  else {
    try {
      const output = await addSupplier(payload);
      res.status(200).json({ status: 'success', data: output });
    }
    catch (err) {
      logErrorMessages((err));
      res.status(500).send("Adding new supplier failed! Please try again");
    }
  }
});

// Update customer
Router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const {
    userType,
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

  if (userType !== 'supplier') {
    try {
      await updateCustomer(userData, id);
      return res.status(200).json({ message: "success" });
    }
    catch (err) {
      logErrorMessages("" + err);
      return res.status(500).json({ message: `Failed to update ${userName}` });
    }
  }
  else {
    try {
      await updateSupplier(userData, id);
      return res.status(200).json({ message: "success" });
    }
    catch (err) {
      logErrorMessages("" + err);
      return res.status(500).json({ message: `Failed to update ${userName}` });
    }
  }
});

module.exports = Router;
