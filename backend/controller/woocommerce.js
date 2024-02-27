// Import packages
const axios = require("axios");
require("dotenv").config();

// WooCommerce API Auth
const { WC_SECRET, WC_KEY, WC_ORDERS_URL, WC_AUTH } = process.env;

// Define Authorization
const Auth = {
  auth: { ussername: WC_KEY, password: WC_SECRET },
  headers: { "Content-Type": "application/json" }
};

// Get all wooCommerce orders
const getAllOrders = async () => {
  try {
    const data = await axios.get(WC_ORDERS_URL, {Auth});
    return data;
  }
  catch (err) {
    return err;
  }
};

// Get single wooCommerce order
const getOneOrder = async (id) => {
  try {
    const response = await axios(`${WC_ORDERS_URL}/wc/v3/orders/${id}`, Auth);
    return(response.data);
  }
  catch (err) {
    return err;
  }
};

// Get all wooCommerce products
const getAllProducts = async () => {
  try {
    const response = await axios(`${WC_ORDERS_URL}/wc/v3/products`, Auth);
    return(response.data);
  }
  catch (err) {
    return err;
  }
};

// Get one wooCommerce product
const getOneProduct = async (id) => {
  try {
    const response = await axios(`${WC_ORDERS_URL}/wc/v3/products/${id}`, Auth);
    return(response.data);
  }
  catch (err) {
    return err;
  }
};

// Get all wooCommerce customers
const getAllCustomers = async () => {
  try {
    const response = await axios(`${WC_ORDERS_URL}/wc/v3/customers`, Auth);
    return(response.data);
  }
  catch (err) {
    return err;
  }
};

// Get one wooCommerce customer
const getOneCustomer = async (id) => {
  try {
    const response = await axios(`${WC_ORDERS_URL}/wc/v3/customers/${id}`, Auth);
    return(response.data);
  }
  catch (err) {
    return err;
  }
};


const allActions = {
  getAllOrders,
  getOneOrder,
  getAllProducts,
  getOneProduct,
  getAllCustomers,
  getOneCustomer,
};

module.exports = allActions;
