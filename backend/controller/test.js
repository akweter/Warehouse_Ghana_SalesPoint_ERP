const { executeQuery } = require("../database/index");

// View inventory items along with supplier details
const inventoryItemsWithSupplier = async () => {
	const sql = "SELECT inventory.*, suppliersncustomers.* FROM inventory JOIN suppliersncustomers ON inventory.Itm_sup_id = suppliersncustomers.SnC_id";
	return await executeQuery(sql);
};

// Calculate the total quantity of items in the inventory
const totalItemsQuantity = async () => {
	const sql = "SELECT SUM(Itm_qty) AS TotalQuantity FROM inventory";
	return await executeQuery(sql);
};

// View inventory items along with supplier details
const Inv_Sale_Type = async () => {
	const sql = "SELECT Inv_Sale_Type, SUM(Inv_total_amt) AS TotalSales FROM invoice GROUP BY Inv_Sale_Type";
	return await executeQuery(sql);
};


// invoices along with customer information:
const invoiceWithCustomers = async () => {
	const sql = "SELECT invoice.*, suppliersncustomers.SnC_name, suppliersncustomers.SnC_tin, suppliersncustomers.SnC_email FROM invoice JOIN suppliersncustomers ON invoice.Inv_Customer_Tin = suppliersncustomers.SnC_tin";
	return await executeQuery(sql);
};

// // View inventory items along with supplier details
// const inventoryItemsWithSupplier = async () => {
// 	const sql = "SELECT inventory.*, suppliersncustomers.* FROM inventory JOIN suppliersncustomers ON inventory.Itm_sup_id = suppliersncustomers.SnC_id";
// 	return await executeQuery(sql);
// };

const allActions = {
	inventoryItemsWithSupplier,
    totalItemsQuantity,
    Inv_Sale_Type,
    invoiceWithCustomers,
};

module.exports = allActions;