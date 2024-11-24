// Database records
const { executeQuery } = require("../database");
const db = require("../database/connection");

/****************************     GET REQUESTS    ***********************************/ //

// Return Search supplier
const querySupplier = async (user) => {
	const sql = `SELECT
		S_name AS supplierName, 
		S_tin AS supplierTin, 
		S_address AS supplierAddress, 
		S_phone AS supplierPhone, 
		S_region AS supplierRegion, 
		S_status AS supplierStatus, 
		S_email AS supplierEmail, 
		S_exempted AS supplierExempted, 
		S_rating AS supplierRating, 
		S_id AS supplierID, 
		S_Added_date AS supplierAddedDate
	FROM 
		suppliers 
	WHERE 
		S_status  <> 'inactive' 
	AND 
		(S_name LIKE ?) 
	LIMIT 10`;
		return await executeQuery(sql, user);
};

// Retrieve All Suppliers
const allSuppliers = async () => {
	const sql = `
		SELECT 
			S_name AS supplierName, 
			S_tin AS supplierTin, 
			S_address AS supplierAddress, 
			S_phone AS supplierPhone, 
			S_region AS supplierRegion, 
			S_status AS supplierStatus, 
			S_email AS supplierEmail, 
			S_exempted AS supplierExempted, 
			S_rating AS supplierRating, 
			S_id AS supplierID, 
			S_Added_date AS supplierAddedDate 
		FROM suppliers`;	
		return await executeQuery(sql);
};

// Fetch all active foreign suppliers
const foreignSuppliers = async () => {
	const sql = `SELECT * FROM suppliers WHERE S_status = 'active' AND S_region = 'foreign'`;
	return await executeQuery(sql);
}

// Fetch all active local suppliers
const localSuppliers = async () => {
	const sql = `SELECT * FROM suppliers WHERE S_status = 'active' AND S_region = 'local'`;
		return await executeQuery(sql);
}

// Retrieve Suppliers by ID
const oneSupplier = async (id) => {
	const sql = "SELECT * FROM suppliers WHERE S_id = ?";
		return await executeQuery(sql, id);
};

// Retrieve Active/Non Active Suppliers
const supplierStats = async (id) => {
	const sql = "SELECT * FROM suppliers S_status = ?";
	return await executeQuery(sql, id);
};

// Retrieve Suppliers by Type
const suppliersByType = async (id) => {
	const sql = "SELECT * FROM suppliers WHERE S_region = ?";
	return await executeQuery(sql, id);
};

// Retrieve Suppliers by Rating
const suppliersByRating = async (rating) => {
	const sql = "SELECT * FROM suppliers WHERE S_rating = ?";
	return await executeQuery(sql, rating);
};

// Retrieve Suppliers by Product ID:
const suppliersByProduct = async (id) => {
	const sql = "SELECT S_name, S_tin, S_region, S_status FROM suppliers S_pro_sell_id = ?";
	return await executeQuery(sql, id);
};

// Retrieve Suppliers by Exemption Status
const suppliersByExemption = async (id) => {
	const sql = "SELECT S_name, S_tin, S_region, S_status FROM suppliers WHERE Sup_exempted = ?";
	return await executeQuery(sql, id);
};

// Retrieve Suppliers by Tin Number
const suppliersByTin = async (id) => {
	const sql = "SELECT * FROM suppliers WHERE S_tin = ?";
	return await executeQuery(sql, id);
};

// Retrieve Suppliers by Email
const suppliersByEmail = async (email) => {
	const sql = "SELECT S_name, S_tin, S_region, S_status, S_email FROM suppliers WHERE S_email = ?";
	return await executeQuery(sql, email);
};

// Retrieve Suppliers by Status = active and Type = ?
const activeSupplierByType = async (id) => {
	const sql = "SELECT S_name, S_tin, S_region, S_status FROM suppliers WHERE S_status = 'active' AND S_region = ?";
	return await executeQuery(sql, id);
};

// Retrieve Suppliers by Status = inactive and Type = ?
const inactiveSuppliersByType = async (id) => {
	const sql = "SELECT S_name, S_tin, S_region, S_status Suppliers WHERE S_status = 'inactive' AND S_region = ?";
	return await executeQuery(sql, id);
};

// Retrieve the percentage of total sales contributed by each supplier in the last 6 months
const salesPercentBySuppliers = async () => {
	const sql = `
	  SELECT
	  	S_name, 
		(SUM(Product_Price * Product_Quantity) / (SELECT SUM(Product_Price * Product_Quantity) FROM invoice_products)) * 100 AS sales_percentage
	  FROM suppliers
	  JOIN inventory ON suppliers.S_id = inventory.Itm_sup_id
	  JOIN invoice_products ON inventory.Itm_id = invoice_products.Product_ID
	  WHERE Inv_date >= NOW() - INTERVAL 6 MONTH
	  GROUP BY S_name`;	
	return await executeQuery(sql);
};


// Retrieve the total number of suppliers
const sumAllSuppliers = async () => {
	const sql = `
	  SELECT COUNT(*) AS total_suppliers FROM suppliers`
	return await executeQuery(sql);
};


// Retrieve active Suppliers with specific Rating
const activeSuppliersByRating = async (prop) => {
	const sql = "SELECT S_name, S_rating, S_region FROM suppliers WHERE S_status = 'active' AND S_rating = ?";
	return await executeQuery(sql);
};

// Retrieve inactive Suppliers with specific Rating
const inactiveSuppliersByRating = async (inrate) => {
	const sql = "SELECT S_name, S_rating, S_region FROM suppliers WHERE S_status = 'inactive' AND S_rating = ? ";
	return await executeQuery(sql, inrate);
};

/********************************     END OF GET REQUESTS     **************************************/
// Add new supplier
const addSupplier = async (prop) => {
	const sql = `
	  INSERT IGNORE INTO customers(
		S_name, 
		S_tin,
		S_address,  
		S_phone,
		S_region,
		S_status,
		S_email,
		S_exempted, 
		S_rating, 
		S_id, 
		S_Added_date
	  )
	  VALUES (
		?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
	  )`;
	return await executeQuery(sql, prop);
  }

// Update customer or supplier
const updateSupplier = async (supplieData, supplierrId) => {
	const sql = `
		UPDATE suppliers 
		SET ? 
		WHERE C_id = ?
	`;
	return await executeQuery(sql, [supplieData, supplierrId]);
  }


module.exports = {
	allSuppliers,
	oneSupplier,
	supplierStats,
	suppliersByType,
	suppliersByRating,
	suppliersByProduct,
	suppliersByExemption,
	suppliersByTin,
	suppliersByEmail,
	activeSupplierByType,
	inactiveSuppliersByType,
	activeSuppliersByRating,
	inactiveSuppliersByRating,
	querySupplier,
	foreignSuppliers,
	localSuppliers,
	sumAllSuppliers,
	salesPercentBySuppliers,
	addSupplier,
	updateSupplier,
};
