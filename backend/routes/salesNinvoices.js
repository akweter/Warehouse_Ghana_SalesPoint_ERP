// Modules
const Router = require("express").Router();

// Projects
const { logErrorMessages } = require("../utils/saveLogfile");

// controller
const restructureInvoiceResult = require("../utils/invoiceModifier");
const {
  oneInvoice,
  Searches,
  purchaseInvoices,
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
  salesNRefundInvoices,
  deleteQuotation,
  deleteQuotationProducts,
  fetchQuotations,
} = require("../controller/salesNinvoices");

// All original GRA invoices transaction
Router.get("/", async (req, res) => {
  try {
    const output = await salesNRefundInvoices("Invoice", "Invoice", "Invoice");
    const modifiedOutput = restructureInvoiceResult(output);
    return res.status(200).json(modifiedOutput);
  }
  catch (err) {
    logErrorMessages(`Error fetching all invoices: ${err}`);
    res.status(500).json({status: "error", message: "Operations failed. Kindly refresh"});
  }
});

// 10 recent transactions only
Router.get("/ten", async (req, res) => {
  try {
    const output = await salesNRefundInvoices('Invoice','Partial_Refund', 'Refund');
    return res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(`Error fetching tenInvoices: ${err}`);
    res.status(500).json({status: "error", message: "Operations failed. Kindly refresh"});
  }
});

// Only Recent autocomplete placeholder value
Router.get("/number", async (req, res) => {
  try {
    const output = await allSalesInvNumbers();
    return res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(`Error fetching allSalesInvNumbers: ${err}`);
    res.status(500).json({status: "error", message: "Operations failed. Kindly refresh"});
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
    res.status(500).json({status: "error", message: "Operations failed. Kindly refresh"});
  }
});

// Get all quote || quotaion invoices
Router.get("/quotes", async (req, res) => {
  try {
    const output = await salesNRefundInvoices("Proforma Invoice", "Proforma Invoice", "Proforma Invoice");
    const modifiedOutput = restructureInvoiceResult(output);
    return res.status(200).json(modifiedOutput);
  }
  catch (err) {
    logErrorMessages(`Error fetching Proforma Invoices ${err}`);
    return res.status(500).send("Fetching quotation invoice failed. Kindly refresh");
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
    logErrorMessages(`Error fetching Proforma Invoices ${JSON.stringify(err)}`);
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
    res.status(500).json({status: "error", message: "Operations failed. Kindly refresh"});
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
    res.status(500).json({status: "error", message: "Operations failed. Kindly refresh"});
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
    res.status(500).json({status: "error", message: "Operations failed. Kindly refresh"});
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
    res.status(500).json({status: "error", message: "Operations failed. Kindly refresh"});
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
    res.status(500).json({status: "error", message: "Operations failed. Kindly refresh"});
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
    res.status(500).json({status: "error", message: "Operations failed. Kindly refresh"});
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
    res.status(500).json({status: "error", message: "Operations failed. Kindly refresh"});
  }
});

// delete quotation
Router.delete("/quote/del/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const output = await deleteQuotation(id);
    if (output) {
      await deleteQuotationProducts(id);
    }
    res.status(200).json({message: `Transaction: ${id} removed!`});
  }
  catch (error) {
    logErrorMessages(error);
    res.status(500).json({message: "Delete failed!. Kindly refresh and retry"});
  }
});

// Search Invoice
Router.get("/search", async (req, res) => {
  const query = req.query.q;
  const result = ['%' + query + '%', '%' + query + '%']
  try {
    const output = await Searches(result);
    return res.status(200).json(output);
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
    return res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(`Error fetching invoice with id: ${userID}, Error: ${err}`);
    return res.status(500).send("Internal server error");
  }
});

module.exports = Router;
