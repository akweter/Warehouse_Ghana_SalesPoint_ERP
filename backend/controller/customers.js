const { executeQuery} = require("../database/index");

/******************  GET REQUESTS  *********************/

// Return all customers and suppliers
const allCustomersNSuplliers = async () => {
  const sql = "SELECT * FROM suppliersncustomers";
  return await executeQuery(sql);
};

// Return all customers
const allCustomers = async () => {
  const sql = "SELECT * FROM suppliersncustomers WHERE SnC_status IN ('active')  AND SnC_Type = 'customer'";
  return await executeQuery(sql);
};

// Return only active customers
const status = async (prop) => {
  const sql = "SELECT * FROM suppliersncustomers WHERE  SnC_Type = 'customer' AND SnC_status = ?";
  return await executeQuery(sql, prop);
};

// Only one customer
const CustomerByTIn = async (id) => {
  const sql = "SELECT * FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'customer' AND SnC_tin = ?";
  return await executeQuery(sql, id);
};

// User Region
const Region = async (prop) => {
  const sql = "SELECT * FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'customer' AND SnC_region = ?";
  return await executeQuery(sql, prop);
};

// User Type
const Type = async () => {
  const sql = "SELECT * FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'customer'";
  return await executeQuery(sql);
};

// All Exempted
const Exempt = async (prop) => {
  const sql = "SELECT SnC_id, SnC_name, SnC_Type, SnC_tin FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'customer' AND SnC_region = 'local' AND SnC_exempted = ?";
  return await executeQuery(sql, prop);
};

// One Exempted
const oneExempt = async (prop) => {
    const sql = "SELECT SnC_id, SnC_name, SnC_Type, SnC_tin FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'customer' AND SnC_region = 'local' AND SnC_id = ?";
    return await executeQuery(sql, prop);
};

// One Rating
const allRating = async () => {
  const sql = "SELECT SnC_id, SnC_name, SnC_Type, SnC_rating FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'customer'";
  return await executeQuery(sql);
};

// All rating
const oneRating = async (prop) => {
    const sql = "SELECT SnC_id, SnC_name, SnC_Type, SnC_tin, SnC_region FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_rating = ?  AND SnC_Type = 'customer'";
    return await executeQuery(sql, prop);
};

// Return Search Customer
const queryProduct = async (user) => {
  const sql = "SELECT * FROM suppliersncustomers WHERE SnC_status  <> 'inactive' AND SnC_Type = 'customer' AND (SnC_name LIKE ?) LIMIT 10";
  return executeQuery(sql, user);
};

// Sales Dept customers
const Searches = async (prop) => {
  const sql = "SELECT SnC_id, SnC_name, SnC_Type, SnC_tin, SnC_region FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'customer' AND (SnC_name LIKE ? OR SnC_tin LIKE ? OR SnC_phone LIKE ? OR SnC_email LIKE ?); ";
  return await executeQuery(sql, prop);
};

const allActions = {
  CustomerByTIn,
  allCustomers,
  status,
  Type,
  Exempt,
  allRating,
  oneRating,
  oneExempt,
  queryProduct,
  Searches,
  Region,
  allCustomersNSuplliers,
};

module.exports = allActions;
