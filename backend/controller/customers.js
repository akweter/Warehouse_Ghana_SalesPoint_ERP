const { executeQuery } = require("../database/index");

/******************  GET REQUESTS  *********************/

// Return all customers and suppliers
const allCustomersNSuplliers = async () => {
  const sql = `
    SELECT
      i.SnC_Type as userType, 
      i.SnC_name as userName, 
      i.SnC_tin as userTIN, 
      i.SnC_address as userAddress, 
      i.SnC_phone as userPhone, 
      i.SnC_region as userRegion, 
      i.SnC_status as userStatus, 
      i.SnC_email as userEmail,
      i.SnC_exempted as userExemption, 
      i.SnC_rating as userRating, 
      i.SnC_id as userID, 
      i.SnC_date as userAddedDate,
      COUNT(ip.Product_Quantity) As ProBoughtQty
    FROM
      suppliersncustomers i
    LEFT JOIN
      invoice iv ON i.SnC_tin = iv.Inv_Customer_Tin
    LEFT JOIN
      invoice_products ip ON iv.Inv_Number = ip.InvoiceNum_ID
    GROUP BY
      i.SnC_Type, 
      i.SnC_name, 
      i.SnC_tin, 
      i.SnC_address, 
      i.SnC_phone, 
      i.SnC_region, 
      i.SnC_status, 
      i.SnC_email,
      i.SnC_exempted, 
      i.SnC_rating, 
      i.SnC_id, 
      i.SnC_date
    ORDER BY 
      i.SnC_date DESC
  `;
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Return all customers
const allCustomers = async () => {
  const sql = "SELECT * FROM suppliersncustomers WHERE SnC_status IN ('active')  AND SnC_Type = 'customer'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Return only active customers
const status = async (prop) => {
  const sql = "SELECT * FROM suppliersncustomers WHERE  SnC_Type = 'customer' AND SnC_status = ?";
  try {
    const result = await executeQuery(sql, prop);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Only one customer
const CustomerByTIn = async (id) => {
  const sql = "SELECT * FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'customer' AND SnC_tin = ?";
  try {
    const result = await executeQuery(sql, id);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// User Region
const Region = async (prop) => {
  const sql = "SELECT * FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'customer' AND SnC_region = ?";
  try {
    const result = await executeQuery(sql, prop);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// User Type
const Type = async () => {
  const sql = "SELECT * FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'customer'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// All Exempted
const Exempt = async (prop) => {
  const sql = "SELECT SnC_id, SnC_name, SnC_Type, SnC_tin FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'customer' AND SnC_region = 'local' AND SnC_exempted = ?";
  try {
    const result = await executeQuery(sql, prop);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// One Exempted
const oneExempt = async (prop) => {
  const sql = "SELECT SnC_id, SnC_name, SnC_Type, SnC_tin FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'customer' AND SnC_region = 'local' AND SnC_id = ?";
  try {
    const result = await executeQuery(sql, prop);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// One Rating
const allRating = async () => {
  const sql = "SELECT SnC_id, SnC_name, SnC_Type, SnC_rating FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'customer'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// All rating
const oneRating = async (prop) => {
  const sql = "SELECT SnC_id, SnC_name, SnC_Type, SnC_tin, SnC_region FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_rating = ?  AND SnC_Type = 'customer'";
  try {
    return await executeQuery(sql, prop);
  }
  catch (error) {
    return error;
  }
};

// Return Search Customer
const queryProduct = async (user) => {
  const sql = `
    SELECT 
      SnC_Type as userType, 
      SnC_name as userName, 
      SnC_tin as userTIN, 
      SnC_address as userAddress, 
      SnC_phone as userPhone, 
      SnC_region as userRegion, 
      SnC_status as userStatus, 
      SnC_email as userEmail,
      SnC_exempted as userExemption, 
      SnC_rating as userRating, 
      SnC_id as userID, 
      SnC_date as userAddedDate
    FROM 
      suppliersncustomers 
    WHERE 
      SnC_status  <> 'inactive' AND SnC_Type = 'customer' AND (SnC_name LIKE ?) 
    LIMIT 10`;
  try {
    const result = await executeQuery(sql, user);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Sales Dept customers
const Searches = async (prop) => {
  const sql = `
    SELECT
      SnC_Type as userType, 
      SnC_name as userName, 
      SnC_tin as userTIN, 
      SnC_address as userAddress, 
      SnC_phone as userPhone, 
      SnC_region as userRegion, 
      SnC_status as userStatus, 
      SnC_email as userEmail,
      SnC_exempted as userExemption, 
      SnC_rating as userRating, 
      SnC_id as userID, 
      SnC_date as userAddedDate
    FROM 
      suppliersncustomers 
    WHERE 
      SnC_status = 'active' AND SnC_Type = 'customer' AND (SnC_name LIKE ? OR SnC_tin LIKE ? OR SnC_phone LIKE ? OR SnC_email LIKE ?)`;
  try {
    const result = await executeQuery(sql, prop);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Add new custoner or supplier
const AddCustomerSupplier = async (prop) => {
  const sql = `
    INSERT INTO suppliersncustomers(
      SnC_Type, SnC_name, SnC_tin, SnC_address, SnC_phone, SnC_region, SnC_status, SnC_email, SnC_exempted, SnC_rating, SnC_id, SnC_date
    )
    VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )`;
  try {
    const result = await executeQuery(sql, prop);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
}

// Update customer or supplier
const updateCustomerNSupplier = async (userData, userId) => {
  const sql = "UPDATE suppliersncustomers SET ? WHERE SnC_id = ?";
  try {
    const result = await executeQuery(sql, [userData, userId]);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
}

module.exports = {
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
  AddCustomerSupplier,
  updateCustomerNSupplier,
};
