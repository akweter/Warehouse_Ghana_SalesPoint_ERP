const { executeQuery} = require("../database/index");

/******************  GET REQUESTS  *********************/

// Return all customers and suppliers
const allCustomersNSuplliers = async () => {
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
    FROM suppliersncustomers
    ORDER BY SnC_date DESC`;
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
  return executeQuery(sql, user);
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
  return await executeQuery(sql, prop);
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
  return await executeQuery(sql, prop);
}

// Update customer or supplier
const updateCustomerNSupplier = (userData, userId) => {
  const sql = "UPDATE suppliersncustomers SET ? WHERE SnC_id = ?";
  return executeQuery(sql, [userData, userId]);
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
