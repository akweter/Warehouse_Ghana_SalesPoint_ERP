// Database records
const { executeQuery } = require("../database");
const db = require("../database/connection");
const { logErrorMessages } = require("../utils/saveLogfile");

/****************************     GET REQUESTS    ***********************************/ //AND SnC_Type = 'supplier'

// Return Search supplier
const querySupplier = async (user) => {
	const sql = "SELECT * FROM suppliersncustomers WHERE SnC_status  <> 'inactive' AND SnC_Type = 'supplier' AND (SnC_name LIKE ?) LIMIT 10";
	return executeQuery(sql, user);
};

// Retrieve All Suppliers
const allSuppliers = async () => {
	const sql = "SELECT * FROM suppliersncustomers WHERE SnC_Type = 'supplier'";
	return await executeQuery(sql);
};

// Fetch all active foreign suppliers
const foreignSuppliers = async () => {
	const sql = `SELECT * FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'supplier' AND SnC_region = 'foreign'`;
	return await executeQuery(sql);
}

// Fetch all active local suppliers
const localSuppliers = async () => {
	const sql = `SELECT * FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'supplier' AND SnC_region = 'local'`;
	return await executeQuery(sql);
}

// Retrieve Suppliers by ID
const oneSupplier = async (id) => {
	const sql = "SELECT * FROM suppliersncustomers WHERE SnC_Type = 'supplier' AND SnC_id = ?";
	return await executeQuery(sql, id);
};

// Retrieve Active/Non Active Suppliers
const supplierStats = async (id) => {
	const sql = "SELECT * FROM suppliersncustomers WHERE SnC_Type = 'supplier' SnC_status = ?";
	return await executeQuery(sql, id);
};

// Retrieve Suppliers by Type
const suppliersByType = async (id) => {
	const sql = "SELECT * FROM suppliersncustomers WHERE SnC_Type = 'supplier' WHERE SnC_region = ?";
	return await executeQuery(sql, id);
};

// Retrieve Suppliers by Rating
const suppliersByRating = async (rating) => {
	const sql = "SELECT * FROM suppliersncustomers WHERE SnC_Type = 'supplier' AND SnC_rating = ?";
	return await executeQuery(sql, rating);
};

// Retrieve Suppliers by Product ID:
const suppliersByProduct = async (id) => {
	const sql = "SELECT SnC_name, SnC_tin, SnC_region, SnC_status FROM suppliersncustomers WHERE SnC_Type = 'supplier' SnC_pro_sell_id = ?";
	return await executeQuery(sql, id);
};

// Retrieve Suppliers by Exemption Status
const suppliersByExemption = async (id) => {
	const sql = "SELECT SnC_name, SnC_tin, SnC_region, SnC_status FROM suppliersncustomers WHERE SnC_Type = 'supplier' AND Sup_exempted = ?";
	return await executeQuery(sql, id);
};

// Retrieve Suppliers by Tin Number
const suppliersByTin = async (id) => {
	const sql = "SELECT * FROM suppliersncustomers WHERE SnC_Type = 'supplier' AND SnC_tin = ?";
	return await executeQuery(sql, id);
};

// Retrieve Suppliers by Email
const suppliersByEmail = async (email) => {
	const sql = "SELECT SnC_name, SnC_tin, SnC_region, SnC_status, SnC_email FROM suppliersncustomers WHERE SnC_Type = 'supplier' AND SnC_email = ?";
	return await executeQuery(sql, email);
};

// Retrieve Suppliers by Status = active and Type = ?
const activeSupplierByType = async (id) => {
	const sql = "SELECT SnC_name, SnC_tin, SnC_region, SnC_status FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'supplier' AND SnC_region = ?";
	return await executeQuery(sql, id);
};

// Retrieve Suppliers by Status = inactive and Type = ?
const inactiveSuppliersByType = async (id) => {
	const sql = "SELECT SnC_name, SnC_tin, SnC_region, SnC_status Suppliers WHERE SnC_status = 'inactive' AND SnC_Type = 'supplier' AND SnC_region = ?";
	return await executeQuery(sql, id);
};

// Retrieve active Suppliers with specific Rating
const activeSuppliersByRating = async (prop) => {
	const sql = "SELECT SnC_name, SnC_rating, SnC_region FROM suppliersncustomers WHERE SnC_status = 'active' AND SnC_Type = 'supplier' AND SnC_rating = ?";
	return await executeQuery(sql, prop);
};

// Retrieve inactive Suppliers with specific Rating
const inactiveSuppliersByRating = async (inrate) => {
	const sql = "SELECT SnC_name, SnC_rating, SnC_region FROM suppliersncustomers WHERE SnC_status = 'inactive' AND SnC_Type = 'supplier' AND SnC_rating = ? ";
	return await executeQuery(sql, inrate);
};

/********************************     END OF GET REQUESTS     **************************************/

const allActions = {
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
	localSuppliers
};

module.exports = allActions;
