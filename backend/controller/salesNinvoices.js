const { executeQuery } = require("../database/index");
const { logMessage } = require("../utils/saveLogfile");

/******************  GET REQUESTS  *********************/

// Return first ten invoices
const tenInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'Invoice' ORDER BY Inv_ID_auto DESC LIMIT 10";
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
};

// Return only autocomplte recent record
const allSalesInvNumbers = async () => {
	const sql = `
    SELECT autoIncrementID, Inv_Number, Inv_date
    FROM invoice
    WHERE Inv_status = 'Invoice'
      AND MONTH(Inv_date) = MONTH(CURDATE())
      AND YEAR(Inv_date) = YEAR(CURDATE())
    ORDER BY autoIncrementID DESC
    LIMIT 1;
  `;
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
};

// Return only sales recent record
const getAllSalesInvoices = async () => {
	const sql = `SELECT * FROM invoice WHERE Inv_status = 'Invoice' ORDER BY Inv_ID_auto DESC`;
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
};

// Return only quotation invoices
const getAllQuoteInvoices = async () => {
	const sql = `SELECT * FROM invoice WHERE Inv_status = 'Quotation' ORDER BY Inv_ID_auto DESC`;
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
};

// Fetch by Date
const getByDate = async () => {
	const sql = `SELECT * FROM invoice WHERE Inv_date = ${new Date('yy-mm-dd')}`;
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
}

// Sum and fetch total invoice
const getTotalInv = async () => {
	const sql = `SELECT COUNT(*) as total_invoices FROM invoice`;
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
}

// Fetchs sales invoice by current day
const getSalesCurDay = async () => {
	const sql = `SELECT * FROM invoice WHERE Inv_status = 'Invoice' AND Inv_date = CURDATE()`;
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
}

// Fetch by current week
const WeekAllSalesInvoice = async () => {
	const sql = `SELECT Inv_total_amt FROM invoice WHERE Inv_status = 'Invoice' AND WEEK(Inv_date) = WEEK(CURDATE())`;
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
}

// Fetch by curent month
const MonthAllSalesInvoice = async () => {
	const sql = `SELECT Inv_total_amt FROM invoice WHERE Inv_status = 'Invoice' AND MONTH(Inv_date) = MONTH(CURDATE())`;
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
}

// Fetch by current year
const YearAllSalesInvoice = async () => {
	const sql = `SELECT Inv_total_amt FROM invoice WHERE Inv_status = 'Invoice' AND YEAR(Inv_date) = YEAR(CURDATE())`;
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
}

// Fetchs sales invoice by current day
const TodayAllRefundsInvoice = async () => {
	const sql = `SELECT * FROM invoice WHERE Inv_status = 'Refund' OR Inv_status = 'Partial_Refund' AND Inv_date = CURDATE()`;
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
}

// Fetch today refund cancellation invoices
const TodayRefundsCancellationInvoice = async () => {
	const sql = `SELECT * FROM invoice WHERE Inv_status = 'Refund_Cancellation' AND Inv_date = CURDATE()`;
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
}

// Various tax component for this month
const ThisMonthTaxes = async () => {
	const sql = `
		SELECT
			SUM(Inv_vat) AS totalVat,
			SUM(nhil) AS totalNHIL,
			SUM(covid) AS totalCovid,
			SUM(getfund) AS totalGetfund,
			SUM(cst) AS totalCST,
			SUM(tourism) AS totalTourism
		FROM
			invoice
		WHERE
			MONTH(Inv_date) = MONTH(CURRENT_DATE())
			AND YEAR(Inv_date) = YEAR(CURRENT_DATE());
	`
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
}

// Total amount and date for this month
const ThisMonthTotalInvoicenDate = async () => {
	const sql = `
		SELECT 
			ip.Inv_date AS Date,
			SUM(ip.Inv_total_amt) AS totalAmount,
			GROUP_CONCAT(inv_num.invoice_number) AS invoiceList,
			SUM(ip.Inv_total_amt - (ip.nhil + ip.getfund + ip.covid + ip.cst + ip.tourism) - ipd.total_discount) AS Dailyprofit
		FROM 
			invoice ip
		JOIN 
			(
				SELECT 
					InvoiceNum_ID,
					SUM(Product_Discount) AS total_discount
				FROM 
					invoice_products
				GROUP BY 
					InvoiceNum_ID
			) ipd ON ip.Inv_Number = ipd.InvoiceNum_ID
		JOIN
			(
				SELECT 
					Inv_ID_auto,
					Inv_Number,
					ROW_NUMBER() OVER (ORDER BY Inv_date) AS invoice_number
				FROM 
					invoice
			) inv_num ON ip.Inv_ID_auto = inv_num.Inv_ID_auto
		WHERE 
			MONTH(ip.Inv_date) = MONTH(CURRENT_DATE())
			AND YEAR(ip.Inv_date) = YEAR(CURRENT_DATE())
			AND Inv_status IN ('INVOICE')
		GROUP BY 
			ip.Inv_date
		LIMIT 0, 25;
	`
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
}

// Return all purchase invoice
const refundInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'REFUND' OR Inv_status = 'Partial_Refund' ORDER BY Inv_ID_auto DESC";
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
};

// Return all invoice numbers and their respective number of products
const countALlrefundInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status IN ('REFUND', 'Partial_Refund') GROUP BY Inv_Number ORDER BY Inv_ID_auto DESC";
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
};

// Return all invoice numbers and their respective number of products
const allRefundedProducts = async () => {
	const sql = "SELECT Inv_Number FROM invoice WHERE Inv_status IN ('REFUND', 'Partial_Refund') ORDER BY Inv_ID_auto DESC";
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
};

// Return only cancelled 
const cancelledRefundInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'Refund_Cancellation' ORDER BY Inv_Number DESC";
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
};

// Return all purchase invoice
const purchaseInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'PURCHASE' ORDER BY Inv_ID_auto  DESC";
	try {
		const result = await executeQuery(sql);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
};

// Only one Invoice
const oneInvoice = async (payload) => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'Invoice' AND Inv_id = ? ORDER BY Inv_ID_auto  DESC";
	try {
		return await executeQuery(sql, payload);
	}
	catch (error) {
		return error;
	}
};

// Get Quotation invoices
const getWaybillInvoice = async (payload) => {
	const sql = `
		SELECT
			invoice.Inv_ID_auto  AS AutoID,
			invoice.Inv_Number AS InvoiceNumber,
			inventory.Itm_id AS itemCode,
			inventory.Itm_name AS ProductName,
			invoice_products.Product_Quantity AS Quantity,
			suppliersncustomers.SnC_name AS CustomerName,
			suppliersncustomers.SnC_tin AS CustomerTIN,
			suppliersncustomers.SnC_phone AS customerPhone
		FROM
			invoice
		JOIN
			suppliersncustomers ON invoice.Inv_Customer_Tin = suppliersncustomers.SnC_tin
		LEFT JOIN
			invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
		LEFT JOIN
			inventory ON invoice_products.Product_ID = inventory.Itm_id
		WHERE
			Inv_status IN ("Invoice") AND Inv_Number IN (?)
		ORDER BY
			invoice.Inv_ID_auto DESC
	`;
	try {
		return await executeQuery(sql, payload);
	}
	catch (error) {
		return error;
	}
}

// Sales Dept invoice
const Searches = async (payload) => {
	const sql = `
	SELECT 
		Inv_user, Inv_status, Inv_Number FROM invoice 
	WHERE
		Inv_status = 'Invoice' AND (Inv_Number LIKE ? OR Inv_user LIKE ?) 
	ORDER BY
		Inv_id DESC`;
	try {
		return await executeQuery(sql, payload);
	}
	catch (error) {
		return error;
	}
};

/******************  BEGIN POST REQUESTS *****************/

// Save invoices to the DB
const AddNewInvoices = async (payload) => {
	const sql = `
	INSERT INTO invoice(
		Inv_ID_auto, autoIncrementID, Inv_user, Inv_total_amt, Inv_status, Inv_Calc_Type, Inv_date, currency, Inv_Sale_Type, Inv_Number, Inv_Customer_Tin, Inv_discount, Inv_ext_Rate, Inv_vat, Inv_id, Inv_Reference, remarks, nhil, getfund, covid, cst, tourism, Inv_Discount_Type, ysdcid, ysdcrecnum, ysdcintdata, ysdcregsig, ysdcmrc, ysdcmrctim, ysdctime, qr_code, Inv_delivery_fee
	) VALUES(
		?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
	)`;
	try {
		const result = await executeQuery(sql, payload);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
};

const saveRefundInvoice = async (payload) => {
	const sql = `
	INSERT INTO invoice(
		Inv_ID_auto, autoIncrementID, Inv_user, Inv_total_amt, Inv_status, Inv_Calc_Type, Inv_date, currency, Inv_Sale_Type, Inv_Number, Inv_Customer_Tin, Inv_discount, Inv_ext_Rate, Inv_vat, Inv_id, Inv_Reference, remarks, nhil, getfund, covid, cst, tourism, Inv_Discount_Type, ysdcid, ysdcrecnum, ysdcintdata, ysdcregsig, ysdcmrc, ysdcmrctim, ysdctime, qr_code, Inv_delivery_fee
	) VALUES(
		?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
	)`;
	try {
		const result = await executeQuery(sql, payload);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
}

// Save procust for each invoice
const saveInInvoiceProduct = async (payload) => {
	const sql = `INSERT INTO invoice_products(
		_ID, InvoiceNum_ID, Product_ID, Product_Price, Product_Discount, Product_Quantity, Product_Refunded_Quantity
	) VALUES (
		?, ?, ?, ?, ?, ?, ?
	)`;
	try {
		const result = await executeQuery(sql, payload);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
};

// update invoice with qr code
const updateInvoiceQRCodes = async (payload) => {
	const sql = `
	UPDATE invoice SET
		Inv_status = ?,
		Inv_date = ?,
		ysdcid = ?,
		ysdcrecnum = ?,
		ysdcintdata = ?,
		ysdcregsig = ?,
		ysdcmrc = ?,
		ysdcmrctim = ?,
		ysdctime = ?,
		qr_code = ?
	WHERE
		Inv_Number = ?
    `;
	try {
		const result = await executeQuery(sql, payload);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
}

// Update products refunded quantity
const updateRefundProducts = async (payload) => {
	const sql = "UPDATE invoice_products SET Product_Refunded_Quantity = Product_Refunded_Quantity + ? WHERE Product_ID = ? AND InvoiceNum_ID = ?";
	try {
		const result = await executeQuery(sql, payload);
    	if(result ){ return result }
	}
	catch (error) {
		return error;
	}
}

module.exports = {
	oneInvoice,
	Searches,
	AddNewInvoices,
	saveInInvoiceProduct,
	updateRefundProducts,
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
	ThisMonthTaxes,
	ThisMonthTotalInvoicenDate,
	getAllQuoteInvoices,
	updateInvoiceQRCodes,
	getWaybillInvoice,
};
