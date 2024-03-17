const { executeQuery } = require("../database/index");

// Return all invoice
const one = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status IN ('INVOICE', 'REFUND', 'PARTIAL_REFUND') ORDER BY Inv_ID_auto DESC";
	return await executeQuery(sql);
};

// Retrieve all active inventory items
const two = async () => {
    const sql = `SELECT * FROM inventory WHERE Itm_status = 'Active'`;
    return await executeQuery(sql);
};

// Retrieve all invoices with a total amount greater than 1000
const three = async () => {
    const sql = ` SELECT * FROM invoice WHERE Inv_total_amt > 1000`;
    return await executeQuery(sql);
};

// Retrieve all invoice products with a quantity greater than 50
const four = async () => {
    const sql = `SELECT * FROM invoice_products WHERE Product_Quantity > 50`;
    return await executeQuery(sql);
};

// Retrieve the total number of suppliers
const five = async () => {
    const sql = `
    SELECT COUNT(*) AS total_suppliers FROM suppliersncustomers WHERE SnC_Type = 'supplier';
    `;
    return await executeQuery(sql);
};

// Retrieve the average price of items in the 'COMPUTER' category
const six = async () => {
    const sql = `
    SELECT AVG(Itm_price) AS avg_price FROM inventory WHERE Itm_cat = 'COMPUTER';
    `;
    return await executeQuery(sql);
};

// Retrieve the total amount of all invoices in GHS currency
const seven = async () => {
    const sql = `
    SELECT SUM(Inv_total_amt) AS total_amount FROM invoice WHERE currency = 'GHS';
    `;
    return await executeQuery(sql);
};

// Retrieve the names and email addresses of active users in the 'sales' department
const eight = async () => {
    const sql = `
    SELECT Usr_FName, Usr_LName, Usr_email FROM usermanagement WHERE Usr_status = 'active' AND Usr_dept = 'sales';
    `;
    return await executeQuery(sql);
};

// Retrieve the invoices with the highest total amount
const nine = async () => {
    const sql = `SELECT * FROM invoice ORDER BY Inv_total_amt DESC LIMIT 1`;
    return await executeQuery(sql);
};

// Retrieve the products in the 'ROOM' category sorted by quantity in descending order
const ten = async () => {
    const sql = `
    SELECT * FROM inventory WHERE Itm_cat = 'ROOM' ORDER BY Itm_qty DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the total quantity of all active items in the inventory
const eleven = async () => {
    const sql = `
    SELECT SUM(Itm_qty) AS total_quantity FROM inventory WHERE Itm_status = 'Active';
    `;
    return await executeQuery(sql);
};

// Retrieve the names and total amounts of invoices for a specific user ('James')
const twelve = async () => {
    const sql = `SELECT Inv_user, SUM(Inv_total_amt) AS total_amount FROM invoice WHERE Inv_user = 'James' GROUP BY Inv_user`;
    return await executeQuery(sql);
};

// Retrieve the unique categories of items in the inventory
const thirteen = async () => {
    const sql = `
    SELECT DISTINCT Itm_cat FROM inventory;
    `;
    return await executeQuery(sql);
};

// Retrieve the total amount and quantity of each item in the 'NETWORK' category
const fourteen = async () => {
    const sql = `
    SELECT Itm_name, SUM(Itm_qty) AS total_quantity, SUM(Itm_price * Itm_qty) AS total_amount FROM inventory WHERE Itm_cat = 'NETWORK' GROUP BY Itm_name;
    `;
    return await executeQuery(sql);
};

// Retrieve the invoices with a refund status
const fifteen = async () => {
    const sql = `SELECT * FROM invoice WHERE Inv_status IN ('REFUND', 'REFUND_CANCELATION', 'PARTIAL_REFUND')`;
    return await executeQuery(sql);
};

// Retrieve the average product price in each invoice
const sixteen = async () => {
    const sql = `
    SELECT InvoiceNum_ID, AVG(Product_Price) AS avg_product_price FROM invoice_products GROUP BY InvoiceNum_ID;
    `;
    return await executeQuery(sql);
};

// Retrieve the suppliers and customers with a 'reliable' rating
const seventeen = async () => {
    const sql = `SELECT * FROM suppliersncustomers WHERE SnC_rating = 'reliable'`;
    return await executeQuery(sql);
};

// Retrieve the total amount and quantity of each item sold in the last month
const eighteen = async () => {
    const sql = `
    SELECT Itm_name, SUM(Product_Quantity) AS total_quantity, SUM(Product_Price * Product_Quantity) AS total_amount
    FROM invoice_products
    JOIN inventory ON invoice_products.Product_ID = inventory.Itm_id
    JOIN invoice ON invoice_products.InvoiceNum_ID = invoice.Inv_Number
    WHERE Inv_date >= NOW() - INTERVAL 1 MONTH
    GROUP BY Itm_name`;
    return await executeQuery(sql);
};

// Retrieve the invoices with a specific reference
const nineteen = async () => {
    const sql = `SELECT * FROM invoice WHERE Inv_Reference IS NOT NULL`;
    return await executeQuery(sql);
};

// Retrieve the total amount of VAT for each invoice
const twenty = async () => {
    const sql = `
    SELECT Inv_id, SUM(Inv_vat) AS total_vat FROM invoice GROUP BY Inv_id;
    `;
    return await executeQuery(sql);
};

// Retrieve the names of customers who have made purchases and the total amount they spent
const twentyOne = async () => {
    const sql = `
    SELECT SnC_name, SUM(Inv_total_amt) AS total_amount FROM invoice
    JOIN suppliersncustomers ON invoice.Inv_user = suppliersncustomers.SnC_id
    WHERE SnC_Type = 'customer'
    GROUP BY SnC_name;
    `;
    return await executeQuery(sql);
};

// Retrieve the top 5 items with the highest total sales amount
const twentyTwo = async () => {
    const sql = `
    SELECT Itm_name, SUM(Product_Price * Product_Quantity) AS total_sales
    FROM inventory
    JOIN invoice_products ON inventory.Itm_id = invoice_products.Product_ID
    GROUP BY Itm_name
    ORDER BY total_sales DESC
    LIMIT 5;
    `;
    return await executeQuery(sql);
};

// Retrieve the average quantity of items sold per invoice for each category
const twentyThree = async () => {
    const sql = `
    SELECT Itm_cat, AVG(Product_Quantity) AS avg_quantity
    FROM inventory
    JOIN invoice_products ON inventory.Itm_id = invoice_products.Product_ID
    GROUP BY Itm_cat;
    `;
    return await executeQuery(sql);
};

// Not using more
// Retrieve complete invoice from the DB
const twentyFour = async () => {
    const sql = `
//     SELECT
//         invoice.Inv_Number AS InvoiceNumber,
//         invoice.Inv_user AS IssuerName,
//         usermanagement.Usr_type AS IssuerType,
//         usermanagement.Usr_dept AS IssuerDept,
//         suppliersncustomers.SnC_name AS CustomerName,
//         suppliersncustomers.SnC_tin AS CustomerTIN,
//         suppliersncustomers.SnC_status AS CustomerStatus,
//         suppliersncustomers.SnC_exempted AS CustomerExempted,
//         invoice.Inv_status AS InvoiceStatus,
//         invoice.Inv_Calc_Type AS CalculationType,
//         invoice.Inv_date AS InvoiceDate,
//         invoice.Inv_Sale_Type AS SaleType,
//         invoice.Inv_Type AS InvoiceType,
//         invoice.Inv_Reference AS Reference,
//         invoice.remarks AS Remarks,
//         invoice.currency AS Currency,
//         invoice.Inv_ext_Rate AS ExchangeRate,
//         invoice.Inv_Discount_Type AS DiscountType,
//         invoice.Inv_total_amt AS TotalAmount,
//         invoice.Inv_discount AS InvoiceDiscount,
//         invoice.Inv_vat AS VatAmount,
//         invoice.nhil AS NHIL,
//         invoice.getfund AS GETFund,
//         invoice.covid AS COVID,
//         invoice.cst AS CST,
//         invoice.tourism AS Tourism,
//         invoice.ysdcid AS YSDCID,
//         invoice.ysdcrecnum AS YSDCRecNum,
//         invoice.ysdcintdata AS YSDCIntData,
//         invoice.ysdcregsig AS YSDCRegSig,
//         invoice.ysdcmrc AS YSDCMRC,
//         invoice.ysdcmrctim AS YSDCMRCTime,
//         invoice.ysdctime AS YSDCTime,
//         invoice.qr_code AS QRCode,
//         invoice.Inv_delivery_fee AS DeliveryFee,
//         inventory.Itm_id AS itemCode,
//         inventory.Itm_name AS ProductName,
//         inventory.Itm_taxable AS ProductCategory,
//         invoice_products.Product_Price AS ProductPrice,
//         invoice_products.Product_Discount AS ProductDiscount,
//         invoice_products.Product_Quantity AS Quantity,
//         invoice_products.Product_Refunded_Quantity AS RefundedQuantity
//     FROM
//         invoice
//     JOIN
//         usermanagement ON invoice.Inv_user = usermanagement.Usr_name
//     JOIN
//         suppliersncustomers ON invoice.Inv_Customer_Tin = suppliersncustomers.SnC_tin
//     LEFT JOIN
//         invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
//     LEFT JOIN
//         inventory ON invoice_products.Product_ID = inventory.Itm_id
//     WHERE
//         Inv_status IN ('INVOICE')
//     ORDER BY
        invoice.Inv_date DESC`;
    return await executeQuery(sql);
};

// Retrieve the total quantity of each product sold and the percentage of total sales it represents
const twentyFive = async () => {
    const sql = `
    SELECT Product_ID, SUM(Product_Quantity) AS total_quantity,
           (SUM(Product_Quantity) / (SELECT SUM(Product_Quantity) FROM invoice_products)) * 100 AS sales_percentage
    FROM invoice_products
    GROUP BY Product_ID;
    `;
    return await executeQuery(sql);
};

// Retrieve the invoices with the highest and lowest total amounts
const twentySix = async () => {
    const sql = `SELECT * FROM invoice
    WHERE Inv_total_amt = (SELECT MAX(Inv_total_amt) FROM invoice)
    OR Inv_total_amt = (SELECT MIN(Inv_total_amt) FROM invoice)`;
    return await executeQuery(sql);
};

// Retrieve the total amount of sales for each user in the 'sales' department
const twentySeven = async () => {
    const sql = `
    SELECT Inv_user, SUM(Inv_total_amt) AS total_sales
    FROM invoice
    WHERE Inv_user IN (SELECT Usr_name FROM usermanagement WHERE Usr_dept = 'sales')
    GROUP BY Inv_user;
    `;
    return await executeQuery(sql);
};

// Retrieve the names of suppliers who have provided items with a total quantity greater than 100
const twentyEight = async () => {
    const sql = `
    SELECT SnC_name
    FROM suppliersncustomers
    JOIN inventory ON suppliersncustomers.SnC_id = inventory.Itm_sup_id
    WHERE Itm_qty > 100 AND SnC_Type = 'supplier';
    `;
    return await executeQuery(sql);
};

// Retrieve the items that have never been sold in an invoice
const twentyNine = async () => {
    const sql = `
    SELECT * FROM inventory
    WHERE Itm_id NOT IN (SELECT DISTINCT Product_ID FROM invoice_products);
    `;
    return await executeQuery(sql);
};

// Retrieve the average number of items sold per month over the last 6 months
const thirty = async () => {
    const sql = `
    SELECT YEAR(Inv_date) AS year, MONTH(Inv_date) AS month, AVG(Product_Quantity) AS avg_items_sold
    FROM invoice
    JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    WHERE Inv_date >= NOW() - INTERVAL 6 MONTH
    GROUP BY YEAR(Inv_date), MONTH(Inv_date)
    ORDER BY year DESC, month DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the total sales amount for each category in the last quarter
const thirtyOne = async () => {
    const sql = `
    SELECT Itm_cat, SUM(Product_Price * Product_Quantity) AS total_sales
    FROM inventory
    JOIN invoice_products ON inventory.Itm_id = invoice_products.Product_ID
    JOIN invoice ON invoice_products.InvoiceNum_ID = invoice.Inv_Number
    WHERE Inv_date >= CURDATE() - INTERVAL 3 MONTH
    GROUP BY Itm_cat;
    `;
    return await executeQuery(sql);
};

// Retrieve the top 3 customers with the highest total purchases in the last year
const thirtyTwo = async () => {
    const sql = `
    SELECT SnC_name, SUM(Inv_total_amt) AS total_purchases
    FROM suppliersncustomers
    JOIN invoice ON suppliersncustomers.SnC_id = invoice.Inv_Customer_Tin
    WHERE SnC_Type = 'customer' AND Inv_date >= CURDATE() - INTERVAL 1 YEAR
    GROUP BY SnC_name
    ORDER BY total_purchases DESC
    LIMIT 3;
    `;
    return await executeQuery(sql);
};

// Retrieve the average quantity and price of items sold per month for a specific user
const thirtyThree = async () => {
    const sql = `
    SELECT Inv_user, YEAR(Inv_date) AS year, MONTH(Inv_date) AS month,
           AVG(Product_Quantity) AS avg_quantity, AVG(Product_Price) AS avg_price
    FROM invoice
    JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    WHERE Inv_user = 'specific_user'
    GROUP BY Inv_user, YEAR(Inv_date), MONTH(Inv_date)
    ORDER BY year DESC, month DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the percentage of total sales contributed by each supplier in the last 6 months
const thirtyFour = async () => {
    const sql = `
    SELECT SnC_name, (SUM(Product_Price * Product_Quantity) / (SELECT SUM(Product_Price * Product_Quantity) FROM invoice_products)) * 100 AS sales_percentage
    FROM suppliersncustomers
    JOIN inventory ON suppliersncustomers.SnC_id = inventory.Itm_sup_id
    JOIN invoice_products ON inventory.Itm_id = invoice_products.Product_ID
    WHERE SnC_Type = 'supplier' AND Inv_date >= NOW() - INTERVAL 6 MONTH
    GROUP BY SnC_name;
    `;
    return await executeQuery(sql);
};

// Retrieve the number of invoices and the total sales amount for each user in the 'sales' department
const thirtyFive = async () => {
    const sql = `SELECT Inv_user, COUNT(*) AS num_invoices, SUM(Inv_total_amt) AS total_sales
    FROM invoice
    WHERE Inv_user IN (SELECT Usr_name FROM usermanagement WHERE Usr_dept = 'sales')
    GROUP BY Inv_user`;
    return await executeQuery(sql);
};

// Retrieve the total sales amount and average discount for each item category
const thirtySix = async () => {
    const sql = `
    SELECT Itm_cat, SUM(Product_Price * Product_Quantity) AS total_sales, AVG(Product_Discount) AS avg_discount
    FROM inventory
    JOIN invoice_products ON inventory.Itm_id = invoice_products.Product_ID
    GROUP BY Itm_cat;
    `;
    return await executeQuery(sql);
};

// Retrieve all refunded or sales invoices
const thirtySeven = async (a, b) => {
    const sql = `
    SELECT
        invoice.Inv_Number AS InvoiceNumber,
        invoice.Inv_user AS IssuerName,
        usermanagement.Usr_type AS IssuerType,
        usermanagement.Usr_dept AS IssuerDept,
        suppliersncustomers.SnC_name AS CustomerName,
        suppliersncustomers.SnC_tin AS CustomerTIN,
        suppliersncustomers.SnC_status AS CustomerStatus,
        suppliersncustomers.SnC_exempted AS CustomerExempted,
        invoice.Inv_status AS InvoiceStatus,
        invoice.Inv_Calc_Type AS CalculationType,
        invoice.Inv_date AS InvoiceDate,
        invoice.Inv_Sale_Type AS SaleType,
        invoice.Inv_Type AS InvoiceType,
        invoice.Inv_Reference AS Reference,
        invoice.remarks AS Remarks,
        invoice.currency AS Currency,
        invoice.Inv_ext_Rate AS ExchangeRate,
        invoice.Inv_Discount_Type AS DiscountType,
        invoice.Inv_total_amt AS TotalAmount,
        invoice.Inv_discount AS InvoiceDiscount,
        invoice.Inv_vat AS VatAmount,
        invoice.nhil AS NHIL,
        invoice.getfund AS GETFund,
        invoice.covid AS COVID,
        invoice.cst AS CST,
        invoice.tourism AS Tourism,
        invoice.ysdcid AS YSDCID,
        invoice.ysdcrecnum AS YSDCRecNum,
        invoice.ysdcintdata AS YSDCIntData,
        invoice.ysdcregsig AS YSDCRegSig,
        invoice.ysdcmrc AS YSDCMRC,
        invoice.ysdcmrctim AS YSDCMRCTime,
        invoice.ysdctime AS YSDCTime,
        invoice.qr_code AS QRCode,
        invoice.Inv_delivery_fee AS DeliveryFee,
        inventory.Itm_id AS itemCode,
        inventory.Itm_name AS ProductName,
        inventory.Itm_taxable AS ProductCategory,
        invoice_products.Product_Price AS ProductPrice,
        invoice_products.Product_Discount AS ProductDiscount,
        invoice_products.Product_Quantity AS Quantity,
        invoice_products.Product_Refunded_Quantity AS RefundedQuantity
    FROM
        invoice
    JOIN
        usermanagement ON invoice.Inv_user = usermanagement.Usr_name
    JOIN
        suppliersncustomers ON invoice.Inv_Customer_Tin = suppliersncustomers.SnC_tin
    LEFT JOIN
        invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    LEFT JOIN
        inventory ON invoice_products.Product_ID = inventory.Itm_id
    WHERE
        Inv_status IN (?, ?)
    ORDER BY
        invoice.Inv_date DESC`;
    return await executeQuery(sql, [a, b]);
};

// Retrieve the average number of items sold per month, grouped by the user's department
const thirtyEight = async () => {
    const sql = `
    SELECT Usr_dept, YEAR(Inv_date) AS year, MONTH(Inv_date) AS month, AVG(Product_Quantity) AS avg_items_sold
    FROM invoice
    JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    JOIN usermanagement ON invoice.Inv_user = usermanagement.Usr_name
    GROUP BY Usr_dept, YEAR(Inv_date), MONTH(Inv_date)`;
    return await executeQuery(sql);
};

// Retrieve the top 5 items with the highest average price and quantity per invoice
const thirtyNine = async () => {
    const sql = `
    SELECT Itm_name, AVG(Product_Price) AS avg_price, AVG(Product_Quantity) AS avg_quantity
    FROM inventory
    JOIN invoice_products ON inventory.Itm_id = invoice_products.Product_ID
    GROUP BY Itm_name
    ORDER BY avg_price DESC, avg_quantity DESC
    LIMIT 5`;
    return await executeQuery(sql);
};

// Retrieve the percentage of total sales contributed by each user in the last quarter
const forty = async () => {
    const sql = `
    SELECT Inv_user, (SUM(Inv_total_amt) / (SELECT SUM(Inv_total_amt) FROM invoice WHERE Inv_date >= CURDATE() - INTERVAL 3 MONTH)) * 100 AS sales_percentage
    FROM invoice
    WHERE Inv_date >= CURDATE() - INTERVAL 3 MONTH
    GROUP BY Inv_user;
    `;
    return await executeQuery(sql);
};

// Retrieve the total sales amount and quantity of each product, grouped by month, for the last year
const fortyOne = async () => {
    const sql = `
    SELECT Itm_name, YEAR(Inv_date) AS year, MONTH(Inv_date) AS month,
           SUM(Product_Price * Product_Quantity) AS total_sales,
           SUM(Product_Quantity) AS total_quantity
    FROM inventory
    JOIN invoice_products ON inventory.Itm_id = invoice_products.Product_ID
    JOIN invoice ON invoice_products.InvoiceNum_ID = invoice.Inv_Number
    WHERE Inv_date >= CURDATE() - INTERVAL 1 YEAR
    GROUP BY Itm_name, YEAR(Inv_date), MONTH(Inv_date)
    ORDER BY year DESC, month DESC, total_sales DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the top 3 customers who made the highest total purchases in a specific category
const fortyTwo = async () => {
    const sql = `
    SELECT SnC_name, Itm_cat, SUM(Product_Price * Product_Quantity) AS total_purchases
    FROM suppliersncustomers
    JOIN invoice ON suppliersncustomers.SnC_id = invoice.Inv_Customer_Tin
    JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    JOIN inventory ON invoice_products.Product_ID = inventory.Itm_id
    WHERE SnC_Type = 'customer' AND Itm_cat = 'specific_category'
    GROUP BY SnC_name
    ORDER BY total_purchases DESC
    LIMIT 3;
    `;
    return await executeQuery(sql);
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

// Retrieve the average sales amount per invoice for each user in the last 6 months
const fortyFour = async () => {
    const sql = `
    SELECT Inv_user, AVG(Inv_total_amt) AS avg_sales_per_invoice
    FROM invoice
    WHERE Inv_date >= CURDATE() - INTERVAL 6 MONTH
    GROUP BY Inv_user
    ORDER BY avg_sales_per_invoice DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the total sales amount and quantity of each product, grouped by the user's department
const fortyFive = async () => {
    const sql = `
    SELECT Usr_dept, Itm_name, SUM(Product_Price * Product_Quantity) AS total_sales,
           SUM(Product_Quantity) AS total_quantity
    FROM usermanagement
    JOIN invoice ON usermanagement.Usr_name = invoice.Inv_user
    JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    JOIN inventory ON invoice_products.Product_ID = inventory.Itm_id
    GROUP BY Usr_dept, Itm_name
    ORDER BY total_sales DESC, total_quantity DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the total sales amount for each product, considering different currencies
const fortySix = async () => {
    const sql = `
    SELECT Itm_name, currency, SUM(Inv_total_amt) AS total_sales
    FROM invoice
    JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    JOIN inventory ON invoice_products.Product_ID = inventory.Itm_id
    GROUP BY Itm_name, currency
    ORDER BY total_sales DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the percentage of total sales contributed by each user in the last quarter, excluding refunds
const fortySeven = async () => {
    const sql = `
    SELECT Inv_user, (SUM(Inv_total_amt) / (SELECT SUM(Inv_total_amt) FROM invoice WHERE Inv_date >= CURDATE() - INTERVAL 3 MONTH AND Inv_status <> 'REFUND')) * 100 AS sales_percentage
    FROM invoice
    WHERE Inv_date >= CURDATE() - INTERVAL 3 MONTH AND Inv_status <> 'REFUND'
    GROUP BY Inv_user;
    `;
    return await executeQuery(sql);
};

// Retrieve the top 5 customers with the highest average purchase amount per invoice
const fortyEight = async () => {
    const sql = `
    SELECT SnC_name, AVG(Inv_total_amt) AS avg_purchase_amount
    FROM suppliersncustomers
    JOIN invoice ON suppliersncustomers.SnC_id = invoice.Inv_Customer_Tin
    GROUP BY SnC_name
    ORDER BY avg_purchase_amount DESC
    LIMIT 5;
    `;
    return await executeQuery(sql);
};

// Retrieve the total sales amount and quantity of each product, grouped by the customer's region
const fortyNine = async () => {
    const sql = `
    SELECT SnC_region, Itm_name, SUM(Product_Price * Product_Quantity) AS total_sales,
           SUM(Product_Quantity) AS total_quantity
    FROM suppliersncustomers
    JOIN invoice ON suppliersncustomers.SnC_id = invoice.Inv_Customer_Tin
    JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    JOIN inventory ON invoice_products.Product_ID = inventory.Itm_id
    GROUP BY SnC_region, Itm_name
    ORDER BY SnC_region, total_sales DESC, total_quantity DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the total sales amount and quantity of each product, grouped by the user's department and month
const fifty = async () => {
    const sql = `
    SELECT Usr_dept, Itm_name, YEAR(Inv_date) AS year, MONTH(Inv_date) AS month,
           SUM(Product_Price * Product_Quantity) AS total_sales,
           SUM(Product_Quantity) AS total_quantity
    FROM usermanagement
    JOIN invoice ON usermanagement.Usr_name = invoice.Inv_user
    JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    JOIN inventory ON invoice_products.Product_ID = inventory.Itm_id
    GROUP BY Usr_dept, Itm_name, YEAR(Inv_date), MONTH(Inv_date)
    ORDER BY Usr_dept, year DESC, month DESC, total_sales DESC, total_quantity DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the total sales amount and quantity of each product, grouped by the supplier's region
const fiftyOne = async () => {
    const sql = `
    SELECT SnC_region, Itm_name, SUM(Product_Price * Product_Quantity) AS total_sales,
           SUM(Product_Quantity) AS total_quantity
    FROM suppliersncustomers
    JOIN inventory ON suppliersncustomers.SnC_id = inventory.Itm_sup_id
    JOIN invoice_products ON inventory.Itm_id = invoice_products.Product_ID
    GROUP BY SnC_region, Itm_name
    ORDER BY SnC_region, total_sales DESC, total_quantity DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the top 3 products with the highest total sales amount and their respective suppliers
const fiftyTwo = async () => {
    const sql = `
    SELECT Itm_name, SnC_name, SUM(Product_Price * Product_Quantity) AS total_sales
    FROM inventory
    JOIN invoice_products ON inventory.Itm_id = invoice_products.Product_ID
    JOIN suppliersncustomers ON inventory.Itm_sup_id = suppliersncustomers.SnC_id
    GROUP BY Itm_name, SnC_name
    ORDER BY total_sales DESC
    LIMIT 3;
    `;
    return await executeQuery(sql);
};

// Retrieve the total sales amount and quantity of each product, grouped by the supplier's rating
const fiftyThree = async () => {
    const sql = `
    SELECT SnC_rating, Itm_name, SUM(Product_Price * Product_Quantity) AS total_sales,
           SUM(Product_Quantity) AS total_quantity
    FROM suppliersncustomers
    JOIN inventory ON suppliersncustomers.SnC_id = inventory.Itm_sup_id
    JOIN invoice_products ON inventory.Itm_id = invoice_products.Product_ID
    GROUP BY SnC_rating, Itm_name
    ORDER BY SnC_rating DESC, total_sales DESC, total_quantity DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the total sales amount and quantity of each product, grouped by the user's department and supplier's region
const fiftyFour = async () => {
    const sql = `
    SELECT Usr_dept, SnC_region, Itm_name, SUM(Product_Price * Product_Quantity) AS total_sales,
           SUM(Product_Quantity) AS total_quantity
    FROM usermanagement
    JOIN invoice ON usermanagement.Usr_name = invoice.Inv_user
    JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    JOIN inventory ON invoice_products.Product_ID = inventory.Itm_id
    JOIN suppliersncustomers ON inventory.Itm_sup_id = suppliersncustomers.SnC_id
    GROUP BY Usr_dept, SnC_region, Itm_name
    ORDER BY Usr_dept, SnC_region, total_sales DESC, total_quantity DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the total sales amount and quantity of each product, excluding items with CST tax
const fiftyFive = async () => {
    const sql = `
    SELECT Itm_name, SUM(Product_Price * Product_Quantity) AS total_sales
    FROM inventory
    JOIN invoice_products ON inventory.Itm_id = invoice_products.Product_ID
    WHERE Itm_taxable <> 'CST'
    GROUP BY Itm_name
    ORDER BY total_sales DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the total sales amount and quantity of each product, grouped by the supplier's exempted status
const fiftySix = async () => {
    const sql = `
    SELECT SnC_exempted, Itm_name, SUM(Product_Price * Product_Quantity) AS total_sales,
           SUM(Product_Quantity) AS total_quantity
    FROM suppliersncustomers
    JOIN inventory ON suppliersncustomers.SnC_id = inventory.Itm_sup_id
    JOIN invoice_products ON inventory.Itm_id = invoice_products.Product_ID
    GROUP BY SnC_exempted, Itm_name
    ORDER BY SnC_exempted DESC, total_sales DESC, total_quantity DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the total sales amount and quantity of each product, grouped by the user's region and month
const fiftySeven = async () => {
    const sql = `
    SELECT SnC_region, Itm_name, YEAR(Inv_date) AS year, MONTH(Inv_date) AS month,
           SUM(Product_Price * Product_Quantity) AS total_sales,
           SUM(Product_Quantity) AS total_quantity
    FROM usermanagement
    JOIN invoice ON usermanagement.Usr_name = invoice.Inv_user
    JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    JOIN inventory ON invoice_products.Product_ID = inventory.Itm_id
    JOIN suppliersncustomers ON inventory.Itm_sup_id = suppliersncustomers.SnC_id
    GROUP BY SnC_region, Itm_name, YEAR(Inv_date), MONTH(Inv_date)
    ORDER BY SnC_region, year DESC, month DESC, total_sales DESC, total_quantity DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the total sales amount and quantity of each product, grouped by the supplier's exempted status and user's department
const fiftyEight = async () => {
    const sql = `
    SELECT SnC_exempted, Usr_dept, Itm_name, SUM(Product_Price * Product_Quantity) AS total_sales,
           SUM(Product_Quantity) AS total_quantity
    FROM usermanagement
    JOIN invoice ON usermanagement.Usr_name = invoice.Inv_user
    JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    JOIN inventory ON invoice_products.Product_ID = inventory.Itm_id
    JOIN suppliersncustomers ON inventory.Itm_sup_id = suppliersncustomers.SnC_id
    GROUP BY SnC_exempted, Usr_dept, Itm_name
    ORDER BY SnC_exempted DESC, Usr_dept, total_sales DESC, total_quantity DESC;
    `;
    return await executeQuery(sql);
};

// Retrieve the total sales amount and quantity of each product, grouped by the supplier's rating and user's department
const fiftyNine = async () => {
    const sql = `
    SELECT SnC_rating, Usr_dept, Itm_name, SUM(Product_Price * Product_Quantity) AS total_sales,
           SUM(Product_Quantity) AS total_quantity
    FROM usermanagement
    JOIN invoice ON usermanagement.Usr_name = invoice.Inv_user
    JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    JOIN inventory ON invoice_products.Product_ID = inventory.Itm_id
    JOIN suppliersncustomers ON inventory.Itm_sup_id = suppliersncustomers.SnC_id
    GROUP BY SnC_rating, Usr_dept, Itm_name
    ORDER BY SnC_rating DESC, Usr_dept, total_sales DESC, total_quantity DESC;
    `;
    return await executeQuery(sql);
};

const sixty = async () => {
    const sql = `
    SELECT SnC_exempted, Itm_name, YEAR(Inv_date) AS year, MONTH(Inv_date) AS month,
           SUM(Product_Price * Product_Quantity) AS total_sales,
           SUM(Product_Quantity) AS total_quantity
    FROM usermanagement
    JOIN invoice ON usermanagement.Usr_name = invoice.Inv_user
    JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
    JOIN inventory ON invoice_products.Product_ID = inventory.Itm_id
    JOIN suppliersncustomers ON inventory.Itm_sup_id = suppliersncustomers.SnC_id
    GROUP BY SnC_exempted, Itm_name, YEAR(Inv_date), MONTH(Inv_date)
    ORDER BY SnC_exempted DESC, year DESC, month DESC, total_sales DESC, total_quantity DESC;
    `;
    return await executeQuery(sql);
};

module.exports = {
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine,
    ten,
    eleven,
    twelve,
    thirteen,
    fourteen,
    fifteen,
    sixteen,
    seventeen,
    eighteen,
    nineteen,
    twenty,
    twentyOne,
    twentyTwo,
    twentyThree,
    twentyFour,
    twentyFive,
    twentySix,
    twentySeven,
    twentyEight,
    twentyNine,
    thirty,
    thirtyOne,
    thirtyTwo,
    thirtyThree,
    thirtyFour,
    thirtyFive,
    thirtySix,
    thirtySeven,
    thirtyEight,
    thirtyNine,
    forty,
    fortyOne,
    fortyTwo,
    fortyThree,
    fortyFour,
    fortyFive,
    fortySix,
    fortySeven,
    fortyEight,
    fortyNine,
    fifty,
    fiftyOne,
    fiftyTwo,
    fiftyThree,
    fiftyFour,
    fiftyFive,
    fiftySix,
    fiftySeven,
    fiftyEight,
    fiftyNine,
    sixty,
};
