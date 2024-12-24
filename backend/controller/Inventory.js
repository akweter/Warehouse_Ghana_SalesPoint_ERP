const { executeQuery } = require("../database/index");

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
    s.S_Name AS supplierName,
    s.S_id AS supplierID,
    u.Usr_name AS userName,
    u.Usr_id AS userID
  FROM 
    inventory AS i
  LEFT JOIN 
    suppliers AS s ON i.Itm_sup_id = s.S_id 
  LEFT JOIN 
    usermanagement AS u ON i.Itm_usr_id = u.Usr_id
  `;
  return await executeQuery(sql);
};

// Return the number for all products
const sumAllProducts = async () => {
  const sql = `SELECT SUM(Itm_qty) AS TotalStock FROM inventory`;
  return await executeQuery(sql);
}

// Return the number for all out pf stock products
const allOutOfStockProducts = async () => {
  const sql = `SELECT COUNT(Itm_qty) As lowStock FROM inventory WHERE Itm_qty = 0`;
  return await executeQuery(sql);
}

// Return the number for low stock products
const allLowProducts = async () => {
  const sql = `
    SELECT 
      inventory.Itm_id AS productCode,
      suppliers.S_id AS suplierID,
      inventory.Itm_name AS ProductName,
      inventory.Itm_cat AS ProductCategory,
      suppliers.S_Name AS supplierName
    FROM 
      inventory
    JOIN
      suppliers ON inventory.Itm_sup_id = suppliers.S_id
    WHERE 
      Itm_qty <= 50`;
      return await executeQuery(sql);
}

// Return the number of Top products
const allTopProducts = async () => {
  const sql =
    `SELECT 
      YEAR(invoice.Inv_date) AS InvoiceYear,
      MONTH(invoice.Inv_date) AS InvoiceMonth,
      inventory.Itm_id AS productCode,
      usermanagement.Usr_id AS userID,
      suppliers.S_id AS customerID,
      inventory.Itm_name AS ProductName,
      inventory.Itm_cat AS ProductCategory,
      suppliers.S_Name AS CustomerName,
      SUM(invoice_products.Product_Quantity) AS TotalQuantitySold
    FROM 
      inventory
    INNER JOIN
      invoice_products ON inventory.Itm_id = invoice_products.Product_ID
    JOIN
      invoice ON invoice_products.InvoiceNum_ID = invoice.Inv_Number
    JOIN
      usermanagement ON inventory.Itm_usr_id = usermanagement.Usr_id
    JOIN
      suppliers ON inventory.Itm_sup_id = suppliers.S_id
    WHERE 
      YEAR(invoice.Inv_date) = YEAR(CURRENT_DATE())
      AND MONTH(invoice.Inv_date) = MONTH(CURRENT_DATE())
    GROUP BY
      YEAR(invoice.Inv_date),
      MONTH(invoice.Inv_date),
      inventory.Itm_id, 
      inventory.Itm_name, 
      inventory.Itm_cat,
      usermanagement.Usr_id, 
      suppliers.S_id, 
      suppliers.S_Name
    ORDER BY 
      InvoiceYear DESC, InvoiceMonth DESC, TotalQuantitySold DESC
  `;
  return await executeQuery(sql);
}

// Return the number of Top products
const noStockProducts = async () => {
  const sql = `SELECT COUNT(*) AS ZeroStockCount FROM inventory WHERE Itm_qty = 0`;
  return await executeQuery(sql);
}

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
    s.S_Name AS supplierName,
    s.S_id AS supplierID,
    u.Usr_name AS userName,
    u.Usr_id AS userID
  FROM 
    inventory AS i
  LEFT JOIN 
    suppliers AS s ON i.Itm_sup_id = s.S_id 
  LEFT JOIN 
    usermanagement AS u ON i.Itm_usr_id = u.Usr_id
  WHERE
    Itm_status <> 'Inactive' AND (Itm_name LIKE ?)`;
  return await executeQuery(sql, product);
};

// Return inventory based on the inventory status
const oneProduct = async (prop) => {
  const sql = `
    SELECT  
      Itm_autoincrement, 
      Itm_id, 
      Itm_cat, 
      Itm_name, 
      Itm_status, 
      Itm_qty, 
      Itm_price, 
      Itm_sup_id, 
      Itm_usr_id, 
      Itm_taxable, 
      itm_date 
    FROM 
      inventory 
    WHERE 
      Itm_id = ?"`;
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
  const sql = "INSERT IGNORE INTO inventory (Itm_autoincrement, Itm_cat, Itm_name, Itm_status, Itm_img, Itm_qty, Itm_price, Itm_sup_id, Itm_usr_id, Itm_taxable, itm_date, Itm_id, Itm_UOM) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return await executeQuery(sql, prop); 
};

/***********  UPDATE PRODUCT  ***********/

// Update product
const updateProduct = (payload, id) => {
  const sql = "UPDATE inventory SET ? WHERE Itm_id = ?";
  return executeQuery(sql, [payload, id]);
}

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
  updateProduct,
  sumAllProducts,
  allLowProducts,
  allOutOfStockProducts,
  allTopProducts,
  noStockProducts,
};

module.exports = allActions;
