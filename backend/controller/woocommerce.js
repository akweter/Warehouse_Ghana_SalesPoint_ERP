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
    return await axios.get(WC_ORDERS_URL, {Auth});
};

// Get single wooCommerce order
const getOneOrder = async (id) => {
    return await axios(`${WC_ORDERS_URL}/wc/v3/orders/${id}`, Auth);
};

// Get all wooCommerce products
const getAllProducts = async () => {  
    return await axios(`${WC_ORDERS_URL}/wc/v3/products`, Auth);
};

// Get one wooCommerce product
const getOneProduct = async (id) => {  
    return await axios(`${WC_ORDERS_URL}/wc/v3/products/${id}`, Auth);
};

// Get all wooCommerce customers
const getAllCustomers = async () => {
      return await axios(`${WC_ORDERS_URL}/wc/v3/customers`, Auth);
};

// Get one wooCommerce customer
const getOneCustomer = async (id) => {  
    return await axios(`${WC_ORDERS_URL}/wc/v3/customers/${id}`, Auth);
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
