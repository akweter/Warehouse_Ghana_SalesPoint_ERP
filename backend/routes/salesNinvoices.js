// Modules
const Router = require("express").Router();

// Projects
const { executeRoute } = require("../utils/handler");
const { logErrorMessages } = require("../utils/saveLogfile");

// controller
const {
  allinvoices,
  oneInvoice,
  Searches,
  purchaseInvoices,
  tenInvoices,
  allSalesInvNumbers,
  getSalesCurDay,
  WeekAllSalesInvoice,
  MonthAllSalesInvoice,
  YearAllSalesInvoice,
  getAllSalesInvoices,
} = require("../controller/salesNinvoices");

// only all sales invoices numbers
Router.get("/", async (req, res) => {
  try {
    const output = await allinvoices();
    return await executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages(`Error fetching all invoices: ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// 10 recent invoice only
Router.get("/ten", async (req, res) => {
  try {
    const output = await tenInvoices();
    return await executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages(`Error fetching tenInvoices: ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Only Recent autocomplete placeholder value
Router.get("/all", async (req, res) => {
  try {
    const output = await allSalesInvNumbers();
    return await executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages(`Error fetching allSalesInvNumbers: ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Get all today invoices
Router.get("/sales", async (req, res) => {
  try {
    const output = await getAllSalesInvoices();
    return await executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages(`Error fetching today invoices ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Get all today invoices
Router.get("/today/sales", async (req, res) => {
  try {
    const output = await getSalesCurDay();
    return await executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages(`Error fetching today invoices ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Get current week invoices
Router.get("/week/sales", async (req, res) => {
  try {
    const output = await WeekAllSalesInvoice();
    return await executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages(`Error fetching today invoices ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Get current month invoices
Router.get("/month/sales", async (req, res) => {
  try {
    const output = await MonthAllSalesInvoice();
    return await executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages(`Error fetching today invoices ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Get current year invoices
Router.get("/year/sales", async (req, res) => {
  try {
    const output = await YearAllSalesInvoice();
    return await executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages(`Error fetching today invoices ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// all purchase Invoices
Router.get("/purchase", async (req, res) => {
  try {
    const output = await purchaseInvoices();
    return await executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages(`Error fetching purchase invoices: ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Get all Admins
Router.get("/search", async (req, res) => {
  const query = req.query.q;
  const result = ['%' + query + '%', '%' + query + '%']
  try {
    const output = await Searches(result);
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages(`Error searching through invoices: ${err}`);
    return res.status(500).send("Internal server error");
  }
});

// Get invoice information based on the ID
Router.get("/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    const output = await oneInvoice(userID);
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages(`Error fetching invoice with id: ${userID}, Error: ${err}`);
    return res.status(500).send("Internal server error");
  }
});

module.exports = Router;


