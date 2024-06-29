// Modules
const Router = require("express").Router();

// Projects
const { executeRoute } = require("../utils/handler");
const { logErrorMessages, logSuccessMessages } = require("../utils/saveLogfile");

// controller
const restructureInvoiceResult = require("../utils/invoiceModifier");
const {
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
  ThisMonthTaxes,
  ThisMonthTotalInvoicenDate,
  getAllQuoteInvoices,
  getWaybillInvoice,
} = require("../controller/salesNinvoices");
const { thirtySeven } = require("../controller/selectQueries");

// All invoices transaction
Router.get("/", async (req, res) => {
  try {
    const output = await thirtySeven("Invoice", "Quotation", "");
    const modifiedOutput = restructureInvoiceResult(output);
    return res.status(200).json(modifiedOutput);
  }
  catch (err) {
    logErrorMessages(`Error fetching all invoices: ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// 10 recent transactions only
Router.get("/ten", async (req, res) => {
  try {
    const output = await thirtySeven('Invoice','Partial_Refund', 'Refund');
    return res.status(200).json(output);
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
    return res.status(200).json(output);
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
    return res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(`Error fetching today sales invoices ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Get all today invoices
Router.get("/quote", async (req, res) => {
  try {
    const output = await getAllQuoteInvoices();
    return res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(`Error fetching quotation invoices ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Get all today invoices
Router.get("/waybill/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const output = await getWaybillInvoice(id);
    const modifiedOutput = restructureInvoiceResult(output);
    return res.status(200).json(modifiedOutput);
  }
  catch (err) {
    logErrorMessages(`Error fetching quotation invoices ${err}`);
    return res.status(500).send("Something unexpected happened. Kindly try again");
  }
});

// Get all this month taxes
Router.get("/tax/month", async (req, res) => {
  try {
    const output = await ThisMonthTaxes();
    return res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(`Error fetching this month taxes ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Get all this month taxes
Router.get("/day/invoice", async (req, res) => {
  try {
    const output = await ThisMonthTotalInvoicenDate();
    return res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(`Error fetching this month taxes ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Get all today invoices
Router.get("/today/sales", async (req, res) => {
  try {
    const output = await getSalesCurDay();
    return res.status(200).json(output);
  }
  catch (error) {
    logErrorMessages(`Error fetching today sales invoices ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Get current week invoices
Router.get("/week/sales", async (req, res) => {
  try {
    const output = await WeekAllSalesInvoice();
    return res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(`Error fetching week sales invoices ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Get current month invoices
Router.get("/month/sales", async (req, res) => {
  try {
    const output = await MonthAllSalesInvoice();
    return res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(`Error fetching month sales invoices ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Get current year invoices
Router.get("/year/sales", async (req, res) => {
  try {
    const output = await YearAllSalesInvoice();
    return res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(`Error fetching year sales today invoices ${err}`);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// all purchase Invoices
Router.get("/purchase", async (req, res) => {
  try {
    const output = await purchaseInvoices();
    return res.status(200).json(output);
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
