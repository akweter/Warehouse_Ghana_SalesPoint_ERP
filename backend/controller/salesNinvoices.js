const { executeQuery } = require("../database/index");

/******************  GET REQUESTS  *********************/

// Return first ten invoices
const tenInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'INVOICE' ORDER BY Inv_ID_auto DESC LIMIT 10";
	return await executeQuery(sql);
};

// Return only autocomplte recent record
const allSalesInvNumbers = async () => {
	const sql = `
    SELECT autoIncrementID, Inv_Number, Inv_date
    FROM invoice
    WHERE Inv_status = 'INVOICE'
      AND MONTH(Inv_date) = MONTH(CURDATE())
      AND YEAR(Inv_date) = YEAR(CURDATE())
    ORDER BY autoIncrementID DESC
    LIMIT 1;
  `;
	return await executeQuery(sql);
};

// Return only autocomplte recent record
const getAllSalesInvoices = async () => {
	const sql = `SELECT * FROM invoice WHERE Inv_status = 'INVOICE' ORDER BY Inv_ID_auto DESC`;
	return await executeQuery(sql);
};

// Fetch by Date
const getByDate = async () => {
	const sql = `SELECT * FROM invoice WHERE Inv_date = ${new Date('yy-mm-dd')}`;
	return await executeQuery(sql);
}

// Sum and fetch total invoice
const getTotalInv = async () => {
	const sql = `SELECT COUNT(*) as total_invoices FROM invoice`;
	return await executeQuery(sql);
}

// Fetchs sales invoice by current day
const getSalesCurDay = async () => {
	const sql = `SELECT * FROM invoice WHERE Inv_status = 'INVOICE' AND Inv_date = CURDATE()`;
	return await executeQuery(sql);
}

// Fetch by current week
const WeekAllSalesInvoice = async () => {
	const sql = `SELECT Inv_total_amt FROM invoice WHERE Inv_status = 'INVOICE' AND WEEK(Inv_date) = WEEK(CURDATE())`;
	return await executeQuery(sql);
}

// Fetch by curent month
const MonthAllSalesInvoice = async () => {
	const sql = `SELECT Inv_total_amt FROM invoice WHERE Inv_status = 'INVOICE' AND MONTH(Inv_date) = MONTH(CURDATE())`;
	return await executeQuery(sql);
}

// Fetch by current year
const YearAllSalesInvoice = async () => {
	const sql = `SELECT Inv_total_amt FROM invoice WHERE Inv_status = 'INVOICE' AND YEAR(Inv_date) = YEAR(CURDATE())`;
	return await executeQuery(sql);
}

// Fetchs sales invoice by current day
const TodayAllRefundsInvoice = async () => {
	const sql = `SELECT * FROM invoice WHERE Inv_status = 'REFUND' OR Inv_status = 'PARTIAL_REFUND' AND Inv_date = CURDATE()`;
	return await executeQuery(sql);
}

// Fetch today refund cancellation invoices
const TodayRefundsCancellationInvoice = async () => {
	const sql = `SELECT * FROM invoice WHERE Inv_status = 'REFUND_CANCELATION' AND Inv_date = CURDATE()`;
	return await executeQuery(sql);
}

// Return all purchase invoice
const refundInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'REFUND' OR Inv_status = 'PARTIAL_REFUND' ORDER BY Inv_ID_auto DESC";
	return await executeQuery(sql);
};

// Return all invoice numbers and their respective number of products
const countALlrefundInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status IN ('REFUND', 'PARTIAL_REFUND') GROUP BY Inv_Number ORDER BY Inv_ID_auto DESC";
	return await executeQuery(sql);
};

// Return all invoice numbers and their respective number of products
const allRefundedProducts = async () => {
	const sql = "SELECT Inv_Number FROM invoice WHERE Inv_status IN ('REFUND', 'PARTIAL_REFUND') ORDER BY Inv_ID_auto DESC";
	return await executeQuery(sql);
};

// Return only cancelled 
const cancelledRefundInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'REFUND_CANCELATION' ORDER BY Inv_Number DESC";
	return await executeQuery(sql);
};

// Return all purchase invoice
const purchaseInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'PURCHASE' ORDER BY Inv_ID_auto  DESC";
	return await executeQuery(sql);
};

// Only one Invoice
const oneInvoice = async (id) => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'INVOICE' AND Inv_id = ? ORDER BY Inv_ID_auto  DESC";
	return await executeQuery(sql, id);
};

// Sales Dept invoice
const Searches = async (prop) => {
	const sql = "SELECT Inv_user, Inv_Type, Inv_Number FROM invoice WHERE Inv_status = 'INVOICE' AND (Inv_Number LIKE ? OR Inv_user LIKE ?) ORDER BY Inv_id DESC";
	return await executeQuery(sql, prop);
};

/******************  BEGIN POST REQUESTS *****************/

// Save invoices to the DB
const AddNewInvoices = async (payload) => {
    const sql = "INSERT INTO invoice(Inv_ID_auto, autoIncrementID, Inv_user, Inv_total_amt, Inv_status, Inv_Calc_Type, Inv_date, Inv_Type, currency, Inv_Sale_Type, Inv_Number, Inv_Customer_Tin, Inv_discount, Inv_ext_Rate, Inv_vat, Inv_id, Inv_Reference, remarks, nhil, getfund, covid, cst, tourism, Inv_Discount_Type, ysdcid, ysdcrecnum, ysdcintdata, ysdcregsig, ysdcmrc, ysdcmrctim, ysdctime, qr_code, Inv_delivery_fee) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    return await executeQuery(sql, payload);
};

const saveRefundInvoice = async (payload) => {
    const sql = "INSERT INTO invoice(Inv_ID_auto, autoIncrementID, Inv_user, Inv_total_amt, Inv_status, Inv_Calc_Type, Inv_date, Inv_Type, currency, Inv_Sale_Type, Inv_Number, Inv_Customer_Tin, Inv_discount, Inv_ext_Rate, Inv_vat, Inv_id, Inv_Reference, remarks, nhil, getfund, covid, cst, tourism, Inv_Discount_Type, ysdcid, ysdcrecnum, ysdcintdata, ysdcregsig, ysdcmrc, ysdcmrctim, ysdctime, qr_code, Inv_delivery_fee) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    return await executeQuery(sql, payload);
}

// Save procust for each invoice
const saveInInvoiceProduct = async (payload) => {
    const sql = "INSERT INTO invoice_products(_ID, InvoiceNum_ID, Product_ID, Product_Price, Product_Discount, Product_Quantity, Product_Refunded_Quantity) VALUES (?, ?, ?, ?, ?, ?, ?)";
	return await executeQuery(sql, payload);
};

const allActions = {
	oneInvoice,
	Searches,
	AddNewInvoices,
	saveInInvoiceProduct,
	purchaseInvoices,
	tenInvoices,
	allSalesInvNumbers,
	refundInvoices,
	saveRefundInvoice,
	cancelledRefundInvoices,
	getByDate,
	getSalesCurDay,
	WeekAllSalesInvoice,
	MonthAllSalesInvoice,
	YearAllSalesInvoice,
	getTotalInv,
	TodayAllRefundsInvoice,
	TodayRefundsCancellationInvoice,
	getAllSalesInvoices,
	countALlrefundInvoices,
	allRefundedProducts,
};

module.exports = allActions;
