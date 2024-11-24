// Packages
const Router = require("express").Router();

// projects
const { logErrorMessages } = require("../utils/saveLogfile");
const {
  getAllOrders,
  getOneOrder,
  getAllProducts,
  getOneProduct,
  getAllCustomers,
  getOneCustomer
} = require("../controller/woocommerce");

// Get all orders
Router.get("/order", async (req, res, next) => {
  try {
    const allOrders = await getAllOrders();
    res.status(200).json({ status: 'success', data: allOrders });
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).send(null);
  }
});

// Get orders by ID
Router.get("/order/:id", async (req, res, next) => {
  try {
    const order = req.params.id;
    const oneOrder = await getOneOrder(order);
    res.status(200).json({ status: 'success', data: oneOrder });
  }
  catch (err) {
    logErrorMessages(`error fetching product: ${req.params.id} error: ${err}`, req.headers.keyid);
    res.status(500).send(null);
  }
});

// Get all products
Router.get("/product", async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();
    res.status(200).json({ status: 'success', data: allProducts });
  }
  catch (err) {
    logErrorMessages(`Could not query woocommerce product. error: ${err}`, req.headers.keyid);
    res.status(500).send(null);
  }
});

// Get product by ID
Router.get("/product/:id", async (req, res, next) => {
  try {
    const order = req.params.id;
    const oneProduct = await getOneProduct(order);
    res.status(200).json({ status: 'success', data: oneProduct });
  }
  catch (err) {
    logErrorMessages(`Error fetching product: ${req.params.id}. error: ${err}`, req.headers.keyid);
    res.status(500).send(null);
  }
});

// Get all customers
Router.get("/customer", async (req, res, next) => {
  try {
    const allCustomers = await getAllCustomers();
    res.status(200).json(allCustomers);
  }
  catch (err) {
    logErrorMessages(`error fetching customer. error: ${err}`, req.headers.keyid);
    res.status(500).send(null);
  }
});

// Get custoner by ID
Router.get("/customer/:id", async (req, res, next) => {
  try {
    const order = req.params.id;
    const oneCustomer = await getOneCustomer(order);
    res.status(200).json(oneCustomer);
  }
  catch (err) {
    logErrorMessages(`cannot fetch customer ${req.params.id}. error: ${err}`, req.headers.keyid);
    res.status(500).send(null);
  }
});

module.exports = Router;
