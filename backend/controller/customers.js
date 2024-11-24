const { executeQuery } = require("../database/index");

/******************  GET REQUESTS  *********************/

// Return all customers and product bought
const allCus_Inv_Pro = async () => {
  const sql = `
    SELECT 
      i.C_name as customerName, 
      i.C_tin as customerTIN, 
      i.C_address as customerAddress, 
      i.C_phone as customerPhone, 
      i.C_region as customerRegion, 
      i.C_status as customerStatus, 
      i.C_email as customerEmail,
      i.C_exempted as customerExemption, 
      i.C_rating as customerRating, 
      i.C_id as customerID, 
      i.C_Added_date as customerAddedDate,
      COUNT(ip.Product_Quantity) As ProBoughtQty
    FROM
      customers i
    LEFT JOIN
      invoice iv ON i.C_tin = iv.Inv_Customer_Tin
    LEFT JOIN
      invoice_products ip ON iv.Inv_Number = ip.InvoiceNum_ID
    WHERE
      i.C_status = 'active' AND i.C_tin <> 'C0000000000'
    GROUP BY
      i.C_name,
      i.C_tin,
      i.C_address,  
      i.C_phone,
      i.C_region, 
      i.C_status, 
      i.C_email,
      i.C_exempted, 
      i.C_rating, 
      i.C_id, 
      i.C_Added_date
    ORDER BY 
      i.C_Added_date DESC
  `;
  return await executeQuery(sql);
};

// Return all active customers
const allCustomers = async () => {
  const sql = "SELECT * FROM customers WHERE C_status IN ('active')";
  return await executeQuery(sql);
};

// Return only given status customers
const status = async (prop) => {
  const sql = "SELECT * FROM customers WHERE AND C_status = ?";
  return await executeQuery(sql, prop);
};

// Select active customers based on their TIN
const CustomerByTIn = async (id) => {
  const sql = "SELECT * FROM customers WHERE C_status = 'active' AND C_tin = ?";
  return await executeQuery(sql, id);
};

// Select active customers based on their region
const Region = async (prop) => {
  const sql = "SELECT * FROM customers WHERE C_status = 'active' AND C_region = ?";
  return await executeQuery(sql, prop);
};

// Select local and active customers based on their Exemption
const Exempt = async (prop) => {
  const sql = `
    SELECT 
      C_id as customerID,
      C_name as customerName, 
      C_tin as customerTIN
    FROM customers 
    WHERE 
      C_status = 'active' AND C_region = 'local' AND C_exempted = ?`;
  return await executeQuery(sql, prop);
};

// Select active customers based on their Status
const oneRating = async (prop) => {
  const sql = `
    SELECT 
      C_name as customerName, 
      C_tin as customerTIN, 
      C_address as customerAddress, 
      C_phone as customerPhone, 
      C_region as customerRegion, 
      C_status as customerStatus, 
      C_email as customerEmail,
      C_exempted as customerExemption, 
      C_rating as customerRating, 
      C_id as customerID, 
      C_Added_date as customerAddedDate
    FROM customers 
    WHERE C_status = 'active' AND C_rating = ?
  `;
  return await executeQuery(sql, prop);
};

// Return Search Customer
const queryCustomer = async (customer) => {
  const sql = `
    SELECT
      C_name as customerName, 
      C_tin as customerTIN, 
      C_address as customerAddress, 
      C_phone as customerPhone, 
      C_region as customerRegion, 
      C_status as customerStatus, 
      C_email as customerEmail,
      C_exempted as customerExemption, 
      C_rating as customerRating, 
      C_id as customerID, 
      C_Added_date as customerAddedDate
    FROM 
      customers 
    WHERE 
      C_status  <> 'inactive' AND (C_name LIKE ?) 
    LIMIT 10`;
  return await executeQuery(sql, customer);
};


// Retrieve the total sales amount and quantity of each product, excluding refunded items
const fortyThree = async () => {
  const sql = `
    SELECT Itm_name, SUM(Product_Price * (Product_Quantity - Product_Refunded_Quantity)) AS total_sales
    FROM inventory
    JOIN invoice_products ON inventory.Itm_id = invoice_products.Product_ID
    GROUP BY Itm_name
    ORDER BY total_sales DESC;
    `;
  return await executeQuery(sql);
};


// Retrieve the top 3 customers who made the highest total purchases in a specific category
const fortyTwo = async () => {
  const sql = `
    SELECT C_name as customerName, Itm_cat, SUM(Product_Price * Product_Quantity) AS total_purchases
    FROM customers
    JOIN invoice ON customers.C_id = invoice.Inv_Customer_Tin
    JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    JOIN inventory ON invoice_products.Product_ID = inventory.Itm_id
    WHERE Itm_cat = 'specific_category'
    GROUP BY C_name
    ORDER BY total_purchases 
    DESC LIMIT 3;
    `;
  return await executeQuery(sql);
};


// Retrieve the top 3 customers with the highest total purchases in the last year
const thirtyTwo = async () => {
  const sql = `
    SELECT C_name as customerName, SUM(Inv_total_amt) AS total_purchases
    FROM customers cs
    JOIN invoice ON cs.C_id = invoice.Inv_Customer_Tin
    WHERE Inv_date >= CURDATE() - INTERVAL 1 YEAR
    GROUP BY C_name
    ORDER BY total_purchases DESC
    LIMIT 3;
    `;
  return await executeQuery(sql);
};


// Retrieve the top 5 customers with the highest average purchase amount per invoice
const fortyEight = async () => {
  const sql = `
    SELECT SnC_name as customerName, AVG(Inv_total_amt) AS avg_purchase_amount
    FROM suppliers
    JOIN invoice ON suppliers.SnC_id = invoice.Inv_Customer_Tin
    GROUP BY SnC_name
    ORDER BY avg_purchase_amount DESC
    LIMIT 5;
    `;
  return await executeQuery(sql);
};


// Sales Dept customers
const Searches = async (prop) => {
  const sql = `
    SELECT
      C_name as customerName, 
      C_tin as customerTIN, 
      C_address as customerAddress, 
      C_phone as customerPhone, 
      C_region as customerRegion, 
      C_status as customerStatus, 
      C_email as customerEmail,
      C_exempted as customerExemption, 
      C_rating as customerRating, 
      C_id as customerID, 
      C_Added_date as customerAddedDate
    FROM 
      customers 
    WHERE 
      C_status = 'active' AND (C_name LIKE ? OR C_tin LIKE ? OR C_phone LIKE ? OR C_email LIKE ?)`;
  return await executeQuery(sql, prop);
}

// Add new custoner
const addCustomer = async (prop) => {
  const sql = `
    INSERT IGNORE INTO customers(
      C_name, 
      C_tin,
      C_address,  
      C_phone,
      C_region,
      C_status,
      C_email,
      C_exempted, 
      C_rating, 
      C_id, 
      C_Added_date
    )
    VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )`;
  return await executeQuery(sql, prop);
}

// Update customer
const updateCustomer = async (customerData, customerId) => {
  const sql = "UPDATE customers SET ? WHERE C_id = ?";
  return await executeQuery(sql, [customerData, customerId]);
}

module.exports = {
  CustomerByTIn,
  allCustomers,
  status,
  Exempt,
  oneRating,
  queryCustomer,
  Searches,
  Region,
  allCus_Inv_Pro,
  addCustomer,
  updateCustomer,
};
