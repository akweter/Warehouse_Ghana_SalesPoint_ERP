const { executeQuery} = require("../database/index");

/******************  GET REQUESTS  *********************/

// Return all inventory
const allProducts = async () => {
  const sql = `
  SELECT 
    i.Itm_autoincrement AS productIncrement,
    i.Itm_id AS productID,
    i.Itm_name AS productName,
    i.Itm_cat AS productCategory,
    i.Itm_status AS productStatus,
    i.Itm_UOM AS productUOM,
    i.Itm_qty AS stockQTY,
    i.Itm_price AS unitPrice,
    i.Itm_taxable AS taxType,
    i.itm_date AS dateAdded,
    s.SnC_name AS supplierName,
    s.SnC_id AS supplierID,
    u.Usr_name AS userName,
    u.Usr_id AS userID
  FROM 
    inventory AS i
  LEFT JOIN 
    suppliersncustomers AS s ON i.Itm_sup_id = s.SnC_id 
  LEFT JOIN 
    usermanagement AS u ON i.Itm_usr_id = u.Usr_id
  `;
  return await executeQuery(sql);
};

//searchOnlyProduct
const searchOnlyProduct = async (product) => {
  const sql = `
  SELECT 
    i.Itm_autoincrement AS productIncrement,
    i.Itm_id AS productID,
    i.Itm_name AS productName,
    i.Itm_cat AS productCategory,
    i.Itm_status AS productStatus,
    i.Itm_UOM AS productUOM,
    i.Itm_qty AS stockQTY,
    i.Itm_price AS unitPrice,
    i.Itm_taxable AS taxType,
    i.itm_date AS dateAdded,
    s.SnC_name AS supplierName,
    s.SnC_id AS supplierID,
    u.Usr_name AS userName,
    u.Usr_id AS userID
  FROM 
    inventory AS i
  LEFT JOIN 
    suppliersncustomers AS s ON i.Itm_sup_id = s.SnC_id 
  LEFT JOIN 
    usermanagement AS u ON i.Itm_usr_id = u.Usr_id
  WHERE
    Itm_status <> 'Inactive' AND (Itm_name LIKE ?) LIMIT 10
  `;
  // "SELECT * FROM inventory WHERE Itm_status <> 'Inactive' AND (Itm_name LIKE ?) LIMIT 10";
  return await executeQuery(sql, product);
};

// Return inventory based on the inventory status
const oneProduct = async (prop) => {
  const sql = "SELECT  Itm_autoincrement, Itm_id, Itm_cat, Itm_name, Itm_status, Itm_qty, Itm_price, Itm_sup_id, Itm_usr_id, Itm_taxable, itm_date FROM inventory WHERE Itm_id = ?";
  return await executeQuery(sql, prop);
};

// Return products based on auto increment
const oneProductAutoIncrement = async (prop) => {
  const sql = "SELECT  Itm_autoincrement, Itm_id, Itm_cat, Itm_name, Itm_status, Itm_qty, Itm_price, Itm_sup_id, Itm_usr_id, Itm_taxable, itm_date FROM inventory WHERE Itm_autoincrement = ?";
  return await executeQuery(sql, prop);
};

// Return exempted products
const Exempt = async (prop) => {
  const sql = "SELECT  Itm_autoincrement, Itm_id, Itm_cat, Itm_name, Itm_status, Itm_qty, Itm_price, Itm_sup_id, Itm_usr_id, Itm_taxable, itm_date FROM inventory WHERE Itm_status <> 'Inactive' AND  Itm_taxable = ?";
  return await executeQuery(sql, prop);
};

// Return products based on tax value
const taxOnProduct = async (prop) => {
  const sql = "SELECT  Itm_autoincrement, Itm_id, Itm_cat, Itm_name, Itm_status, Itm_qty, Itm_price, Itm_sup_id, Itm_usr_id, Itm_taxable, itm_date FROM inventory WHERE Itm_status <> 'Inactive' AND  Itm_taxable = ?";
  return await executeQuery(sql, prop);
};

// Return products/product based the user who add the product
const addedUser = async (prop) => {
    const sql = "SELECT  Itm_autoincrement, Itm_id, Itm_cat, Itm_name, Itm_status, Itm_qty, Itm_price, Itm_sup_id, Itm_usr_id, Itm_taxable, itm_date FROM inventory WHERE Itm_status <> 'Inactive' AND  Itm_usr_id = ?";
    return await executeQuery(sql, prop);
};

// Return products/product based on product supplier
const productSupplier = async (prop) => {
  const sql = "SELECT  Itm_autoincrement, Itm_id, Itm_cat, Itm_name, Itm_status, Itm_qty, Itm_price, Itm_sup_id, Itm_usr_id, Itm_taxable, itm_date FROM inventory WHERE Itm_status <> 'Inactive' AND  Itm_sup_id = ?";
  return await executeQuery(sql, prop);
};

// Return products/product based on date selection
const dateAdded = async (prop) => {
  const sql = "SELECT  Itm_autoincrement, Itm_id, Itm_cat, Itm_name, Itm_status, Itm_qty, Itm_price, Itm_sup_id, Itm_usr_id, Itm_taxable, itm_date FROM inventory WHERE Itm_status <> 'Inactive' AND  Itm_date >= ? AND Itm_date <= ?";
  return await executeQuery(sql, prop);
};

// Return search products/product
const searchProduct = async (prop) => {
  const sql = "SELECT  Itm_autoincrement, Itm_id, Itm_cat, Itm_name, Itm_status, Itm_qty, Itm_price, Itm_sup_id, Itm_usr_id, Itm_taxable, itm_date FROM inventory WHERE Itm_status <> 'Inactive' AND (Itm_name LIKE ? OR Itm_price LIKE ? OR itm_date LIKE ?); ";
  return await executeQuery(sql, prop);
};


/***************    ADD PRODUCTS    ********************/

// add s using excel
const addExcelProducts = async (prop) => {
  const sql = "INSERT INTO inventory (Itm_autoincrement, Itm_cat, Itm_name, Itm_status, Itm_img, Itm_qty, Itm_price, Itm_sup_id, Itm_usr_id, Itm_taxable, itm_date, Itm_id, Itm_UOM) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return await executeQuery(sql, prop);
};


const allActions = {
  allProducts,
  oneProduct,
  oneProductAutoIncrement,
  taxOnProduct,
  addedUser,
  productSupplier,
  dateAdded,
  searchProduct,
  Exempt,
  searchOnlyProduct,
  addExcelProducts,
};

module.exports = allActions;
