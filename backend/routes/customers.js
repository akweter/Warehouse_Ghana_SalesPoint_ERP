// Modules
const Router = require("express").Router();

// Projects
const { executeRoute } = require("../utils/handler");
const { logAllMessage } = require("../utils/saveAllLogs");

// controller
const {
    Exempt,
    Searches,
    Type,
    allCustomers,
    allRating,
    oneExempt,
    oneRating,
    CustomerByTIn,
    status,
    queryProduct,
    Region,
    allCustomersNSuplliers,
} = require("../controller/customers");

// all customers and suppliers
Router.get("/customersnsuppliers", async (req, res, next) => {
    try {
    const output = await allCustomersNSuplliers();
    return await executeRoute(output, res);
  }
  catch (err) {
    logAllMessage("Internal server error" + err);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// all customers
Router.get("/", async (req, res, next) => {
  try {
  const output = await allCustomers();
  return await executeRoute(output, res);
}
catch (err) {
  logAllMessage("Internal server error" + err);
  return res.status(500).send("Temporal server error. Kindly refresh");
}
});

// Search customer with keywords
Router.get("/query", async (req, res, next) => {
  const query = req.query.search;
  const result = '%' + query + '%'
  try {
    const output = await queryProduct(result);
    return executeRoute(output, res);
  }
  catch (err) {
    logAllMessage("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// customers status (active || inactive)
Router.get("/status", async (req, res, next) => {
    const stat = req.body.status;
  try {
    const output = await status(stat);
    return executeRoute(output, res);
  }
  catch (err) {
    logAllMessage("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// Customers Region
Router.get("/region", async (req, res, next) => {
    const stat = req.body.type;
  try {
    const output = await Region(stat);
    return executeRoute(output, res);
  }
  catch (err) {
    logAllMessage("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// Customers Type
Router.get("/type", async (req, res, next) => {
try {
  const output = await Type();
  return executeRoute(output, res);
}
catch (err) {
  logAllMessage("Internal server error" + err);
  return res.status(500).send("Internal server error");
}
});

// Exempted Customers
Router.get("/exempt", async (req, res, next) => {
    const stat = req.body.exempt;
  try {
    const output = await Exempt(stat);
    return executeRoute(output, res);
  }
  catch (err) {
    logAllMessage("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// Single Exempted Customer
Router.get("/exempt/:id", async (req, res, next) => {
    const ID = req.params.id;
  try {
    const output = await oneExempt(ID);
    return executeRoute(output, res);
  }
  catch (err) {
    logAllMessage("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// All customers Rating
Router.get("/rate", async (req, res, next) => {
  try {
    const output = await allRating();
    return executeRoute(output, res);
  }
  catch (err) {
    logAllMessage("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// One customer Rating
Router.get("/rate/one", async (req, res, next) => {
  const rate = req.body.rate;
  try {
    const output = await oneRating(rate);
    return await executeRoute(output, res);
  }
  catch (err) {
    logAllMessage("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// All Searches 
Router.get("/search", async (req, res, next) => {
  const { search } = req.body;
  const searchTerm = '%' + search + '%';
  const Value = [searchTerm, searchTerm, searchTerm, searchTerm];
  try {
    const output = await Searches(Value);
    return executeRoute(output, res);
  }
  catch (err) {
    logAllMessage("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// Get user information based on the ID
Router.get("/:id", async (req, res, next) => {
  const userID = req.params.id;
  try {
    const output = await CustomerByTIn(userID);
    return executeRoute(output, res);
  }
  catch (err) {
    logAllMessage("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

module.exports = Router;
