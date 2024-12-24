const { executeQuery } = require("../database/index");

/******************  GET REQUESTS  *********************/

// Return first ten invoices
const tenInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'Invoice' ORDER BY Inv_ID_auto DESC LIMIT 10";
	return await executeQuery(sql);
}


// Retrieve the names of customers who have made purchases and the total amount they spent
const customersMadePurchase = async () => {
	const sql = `
	  SELECT
		C_name, 
		SUM(Inv_total_amt) AS total_amount 
	  FROM 
		invoice
	  JOIN 
		customers 
	  ON 
		invoice.Inv_user = customers.C_id
	  GROUP BY 
		C_name;
	  `;
	return await executeQuery(sql);
}


// Retrieve the average number of items sold per month over the last 6 months
const sixMonthAverageItemsSold = async () => {
	const sql = `
	  SELECT YEAR(Inv_date) AS year, MONTH(Inv_date) AS month, AVG(Product_Quantity) AS avg_items_sold
	  FROM invoice
	  JOIN invoice_products ON invoice.Inv_Number = invoice_products.InvoiceNum_ID
	  WHERE Inv_date >= NOW() - INTERVAL 6 MONTH
	  GROUP BY YEAR(Inv_date), MONTH(Inv_date)
	  ORDER BY year DESC, month DESC`;
	return await executeQuery(sql);
}


// Retrieve all sales or refunded invoices or quotation invoices
const salesNRefundInvoices = async (a, b, c, d) => {
	let qrCodeFilter;
	if (d === 'http') {
		qrCodeFilter = "qr_code IS NOT NULL AND qr_code LIKE 'http%'";
	} else if (d === 'null') {
		qrCodeFilter = "qr_code IS NULL";
	} else {
		throw new Error('Invalid qrCodeCondition parameter');
	}
	const sql = `
	  SELECT
		inv.Inv_ID_auto  AS AutoID,
		inv.Inv_Check AS checkdID,
		inv.Inv_Number AS InvoiceNumber,
		inv.Inv_user AS IssuerName,
		inv.Inv_status AS InvoiceStatus,
		inv.Inv_Calc_Type AS CalculationType,
		inv.Inv_date AS InvoiceDate,
		inv.currency AS Currency,
		inv.Inv_Sale_Type AS SaleType,
		inv.Inv_Reference AS Reference,
		inv.remarks AS Remarks,
		inv.Inv_ext_Rate AS ExchangeRate,
		inv.Inv_Discount_Type AS DiscountType,
		inv.Inv_total_amt AS TotalAmount,
		inv.Inv_discount AS InvoiceDiscount,
		inv.Inv_vat AS VatAmount,
		inv.nhil AS NHIL,
		inv.getfund AS GETFund,
		inv.covid AS COVID,
		inv.cst AS CST,
		inv.tourism AS Tourism,
		inv.ysdcid AS YSDCID,
		inv.ysdcrecnum AS YSDCRecNum,
		inv.ysdcintdata AS YSDCIntData,
		inv.ysdcregsig AS YSDCRegSig,
		inv.ysdcmrc AS YSDCMRC,
		inv.ysdcmrctim AS YSDCMRCTime,
		inv.ysdctime AS YSDCTime,
		inv.qr_code AS QRCode,
		inv.Inv_delivery_fee AS DeliveryFee,
		invt.Itm_id AS itemCode,
		invt.Itm_UOM AS uom,
		invt.Itm_name AS ProductName,
		invt.Itm_taxable AS ProductCategory,
		ip._ID AS IPID,
		ip.Product_Price AS ProductPrice,
		ip.Product_Discount AS ProductDiscount,
		ip.Product_Quantity AS Quantity,
		ip.Product_Refunded_Quantity AS RefundedQuantity,
		user.Usr_type AS IssuerType,
		user.Usr_dept AS IssuerDept,
		ct.C_name AS CustomerName,
		ct.C_id AS CustomerID,
		ct.C_tin AS CustomerTIN,
		ct.C_phone AS customerPhone,
		ct.C_status AS CustomerStatus,
		ct.C_exempted AS CustomerExempted
	  FROM
		invoice inv
	  LEFT JOIN
		usermanagement user ON inv.Inv_user = user.Usr_name
	  LEFT JOIN
		customers ct ON inv.Inv_Cus_ID = ct.C_id
	  LEFT JOIN
		invoice_products ip ON inv.Inv_Number = ip.InvoiceNum_ID
	  LEFT JOIN
		inventory invt ON ip.Product_ID = invt.Itm_id
	  WHERE
		Inv_status IN (?, ?, ?)
	  AND (${qrCodeFilter})
	  ORDER BY
		inv.Inv_ID_auto
	  DESC`;
	return await executeQuery(sql, [a, b, c]);
}


// Return records to set invoice number
const allSalesInvNumbers = async () => {
	const sql = `
    SELECT COUNT(*) AS numList
	FROM invoice
	WHERE MONTH(Inv_date) = MONTH(CURRENT_DATE())
	AND YEAR(Inv_date) = YEAR(CURRENT_DATE())`;
	return await executeQuery(sql);
}


// Return only sales recent record
const getAllSalesInvoices = async () => {
	const sql = `SELECT * FROM invoice WHERE Inv_status = 'Invoice' ORDER BY Inv_ID_auto DESC`;
	return await executeQuery(sql);
}


// Return only Proforma Invoices
const getAllQuoteInvoices = async () => {
	const sql = `
		SELECT * 
		FROM 
			invoice 
		WHERE 
			Inv_status = 'Proforma Invoice' 
		ORDER BY 
			Inv_ID_auto 
		DESC`;
}


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
	const sql = `SELECT * FROM invoice WHERE Inv_status = 'Invoice' AND Inv_date = CURDATE()`;
	return await executeQuery(sql);
}

// Fetch by current week
const WeekAllSalesInvoice = async () => {
	const sql = `SELECT Inv_total_amt FROM invoice WHERE Inv_status = 'Invoice' AND WEEK(Inv_date) = WEEK(CURDATE())`;
	return await executeQuery(sql);
}

// Fetch by curent month
const MonthAllSalesInvoice = async () => {
	const sql = `SELECT Inv_total_amt FROM invoice WHERE Inv_status = 'Invoice' AND MONTH(Inv_date) = MONTH(CURDATE())`;
	return await executeQuery(sql);
}

// Fetch by current year
const YearAllSalesInvoice = async () => {
	const sql = `SELECT Inv_total_amt FROM invoice WHERE Inv_status = 'Invoice' AND YEAR(Inv_date) = YEAR(CURDATE())`;
	return await executeQuery(sql);
}

// Fetchs sales invoice by current day
const TodayAllRefundsInvoice = async () => {
	const sql = `SELECT * FROM invoice WHERE Inv_status = 'Refund' OR Inv_status = 'Partial_Refund' AND Inv_date = CURDATE()`;
	return await executeQuery(sql);
}

// Fetch today refund cancellation invoices
const TodayRefundsCancellationInvoice = async () => {
	const sql = `SELECT * FROM invoice WHERE Inv_status = 'Refund_Cancellation' AND Inv_date = CURDATE()`;
	return await executeQuery(sql);
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
			AND YEAR(Inv_date) = YEAR(CURRENT_DATE())`;
	return await executeQuery(sql);
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
		LIMIT 0, 25`;
}

// Return all purchase invoice
const refundInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'REFUND' OR Inv_status = 'Partial_Refund' ORDER BY Inv_ID_auto DESC";
	return await executeQuery(sql);
}


// Return all invoice numbers and their respective number of products
const countALlrefundInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status IN ('REFUND', 'Partial_Refund') GROUP BY Inv_Number ORDER BY Inv_ID_auto DESC";
	return await executeQuery(sql);
}


// Return all invoice numbers and their respective number of products
const allRefundedProducts = async () => {
	const sql = "SELECT Inv_Number FROM invoice WHERE Inv_status IN ('REFUND', 'Partial_Refund') ORDER BY Inv_ID_auto DESC";
	return await executeQuery(sql);
}


// Return only cancelled 
const cancelledRefundInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'Refund_Cancellation' ORDER BY Inv_Number DESC";
	return await executeQuery(sql);
}


// Return all purchase invoice
const purchaseInvoices = async () => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'PURCHASE' ORDER BY Inv_ID_auto  DESC";
	return await executeQuery(sql);
}


// Only one Invoice
const oneInvoice = async (payload) => {
	const sql = "SELECT * FROM invoice WHERE Inv_status = 'Invoice' AND Inv_id = ? ORDER BY Inv_ID_auto  DESC";
	return await executeQuery(sql, payload);
}


// Get Proforma Invoice
const getWaybillInvoice = async (id) => {
	const sql = `
		SELECT
			i.Inv_ID_auto  AS AutoID,
			i.Inv_Number AS InvoiceNumber,
			i.Inv_date AS InvoiceDate,
			inv.Itm_id AS itemCode,
			inv.Itm_name AS ProductName,
			ip.Product_Quantity AS Quantity,
			c.C_name AS CustomerName,
			c.C_tin AS CustomerTIN,
			c.C_address AS CustomerAddress,
			c.C_email AS CustomerEmail,
			c.C_phone AS CustomerPhone,
			c.C_id AS CustomerID
		FROM
			invoice i
		JOIN
			customers c ON i.Inv_Cus_ID = c.C_id
		LEFT JOIN
			invoice_products ip ON i.Inv_Number = ip.InvoiceNum_ID
		LEFT JOIN
			inventory inv ON ip.Product_ID = inv.Itm_id
		WHERE
			i.Inv_Number IN (?)
		ORDER BY
			inv.Itm_name ASC`;
	return await executeQuery(sql, id);
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
	return await executeQuery(sql, payload);
}


/******************  BEGIN POST REQUESTS *****************/

// Save invoices to the DB
const AddNewInvoices = async (payload) => {
	const sql = `
        INSERT INTO invoice (
			Inv_ID_auto,
			Inv_Check,
			Inv_user,
			Inv_total_amt,
			Inv_status,
			Inv_Calc_Type,
			Inv_date, currency,
			Inv_Sale_Type,
			Inv_Number,
			Inv_Customer_Tin,
			Inv_Cus_ID,
			Inv_discount,
			Inv_ext_Rate,
			Inv_vat,
			Inv_id,
			Inv_Reference,
			remarks,
			nhil,
			getfund,
			covid,
			cst,
			tourism,
			Inv_Discount_Type,
			ysdcid,
			ysdcrecnum,
			ysdcintdata,
			ysdcregsig,
			ysdcmrc,
			ysdcmrctim,
			ysdctime,
			qr_code,
			Inv_delivery_fee
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        ON DUPLICATE KEY UPDATE
            Inv_user = CASE
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(Inv_user)
				ELSE Inv_user
			END,
			Inv_total_amt = CASE
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(Inv_total_amt)
				ELSE Inv_total_amt
			END,
			Inv_status = VALUES(Inv_status), -- Keep the same status
			Inv_Calc_Type = CASE
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(Inv_Calc_Type)
				ELSE Inv_Calc_Type
			END,
			Inv_date = CASE
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(Inv_date)
				ELSE Inv_date
			END,
			currency = CASE
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(currency)
				ELSE currency
			END,
			Inv_Sale_Type = CASE
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(Inv_Sale_Type) 
				ELSE Inv_Sale_Type 
			END,
			Inv_Number = VALUES(Inv_Number), -- Allow updating the number if needed
			Inv_Customer_Tin = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(Inv_Customer_Tin) 
				ELSE Inv_Customer_Tin 
			END,
			Inv_Cus_ID = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(Inv_Cus_ID) 
				ELSE Inv_Cus_ID 
			END,
			Inv_discount = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(Inv_discount) 
				ELSE Inv_discount 
			END,
			Inv_ext_Rate = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(Inv_ext_Rate) 
				ELSE Inv_ext_Rate 
			END,
			Inv_vat = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(Inv_vat) 
				ELSE Inv_vat 
			END,
			Inv_id = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(Inv_id) 
				ELSE Inv_id 
			END,
			Inv_Reference = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(Inv_Reference) 
				ELSE Inv_Reference 
			END,
			remarks = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(remarks) 
				ELSE remarks 
			END,
			nhil = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(nhil) 
				ELSE nhil 
			END,
			getfund = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(getfund) 
				ELSE getfund 
			END,
			covid = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(covid) 
				ELSE covid 
			END,
			cst = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(cst) 
				ELSE cst 
			END,
			tourism = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(tourism) 
				ELSE tourism 
			END,
			Inv_Discount_Type = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(Inv_Discount_Type) 
				ELSE Inv_Discount_Type 
			END,
			ysdcid = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(ysdcid) 
				ELSE ysdcid 
			END,
			ysdcrecnum = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(ysdcrecnum) 
				ELSE ysdcrecnum 
			END,
			ysdcintdata = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(ysdcintdata) 
				ELSE ysdcintdata 
			END,
			ysdcregsig = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(ysdcregsig) 
				ELSE ysdcregsig 
			END,
			ysdcmrc = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(ysdcmrc) 
				ELSE ysdcmrc 
			END,
			ysdcmrctim = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(ysdcmrctim) 
				ELSE ysdcmrctim 
			END,
			ysdctime = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(ysdctime) 
				ELSE ysdctime 
			END,
			qr_code = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(qr_code) 
				ELSE qr_code 
			END,
			Inv_delivery_fee = CASE 
				WHEN Inv_status <> VALUES(Inv_status) THEN VALUES(Inv_delivery_fee) 
				ELSE Inv_delivery_fee 
			END`;
	return await executeQuery(sql, payload);
}


const saveRefundInvoice = async (payload) => {
	const sql = `
	INSERT IGNORE INTO 
		invoice(
			Inv_ID_auto, Inv_Check, Inv_user, Inv_total_amt, Inv_status, Inv_Calc_Type, Inv_date, currency, Inv_Sale_Type, Inv_Number, Inv_Customer_Tin, Inv_discount, Inv_ext_Rate, Inv_vat, Inv_id, Inv_Reference, remarks, nhil, getfund, covid, cst, tourism, Inv_Discount_Type, ysdcid, ysdcrecnum, ysdcintdata, ysdcregsig, ysdcmrc, ysdcmrctim, ysdctime, qr_code, Inv_delivery_fee
	) VALUES(
		?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
	)`;
	return await executeQuery(sql, payload);
}

// Save product for each invoice
const saveInInvoiceProduct = async (payload) => {
	const sql = `
        INSERT INTO 
            invoice_products (
                _ID, 
                InvoiceNum_ID, 
                Product_ID, 
                Product_Price, 
                Product_Discount, 
                Product_Quantity, 
                Product_Refunded_Quantity
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?
            )
        ON DUPLICATE KEY UPDATE 
            InvoiceNum_ID = VALUES(InvoiceNum_ID),
            Product_ID = VALUES(Product_ID),
            Product_Price = VALUES(Product_Price),
            Product_Discount = VALUES(Product_Discount),
            Product_Quantity = VALUES(Product_Quantity),
            Product_Refunded_Quantity = VALUES(Product_Refunded_Quantity)`;
	return await executeQuery(sql, payload);
}

// update invoice products in the database
const updateInvoiceProducts = async (payload, productID, invoiceNum) => {
	const sql = `
		UPDATE invoice_products
		SET ?
		WHERE _ID = ?
		AND InvoiceNum_ID = ?`;
	return await executeQuery(sql, [payload, productID, invoiceNum]);
}

// Update complete invoice
const updateInvoice_Quotation = async (invoice, checkID) => {
	const sql = `UPDATE invoice SET ? WHERE Inv_Check = ?`;
	return await executeQuery(sql, [invoice, checkID]);
}

// Update quote invoice with GRA response
const updateQuotation = async (payload) => {
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
		Inv_Number = ?`;
	return await executeQuery(sql, payload);
}

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
	AND 
		Inv_status = ?`;
	return await executeQuery(sql, payload);
}

// Update products refunded quantity
const updateRefundProducts = async (payload) => {
	console.log('refunds', payload);
	const sql = `
		UPDATE 
			invoice_products
		SET 
			Product_Refunded_Quantity = Product_Refunded_Quantity + ?
		WHERE 
			Product_ID = ?
		AND 
			InvoiceNum_ID = ?`;
	const res = await executeQuery(sql, payload);
		console.log('ref results', res);
		return res;
}


// Delete products for quotation
const deleteQuotation = async (invoiceNumber) => {
	const sql = `DELETE FROM invoice WHERE Inv_Number = ?`;
	return await executeQuery(sql, invoiceNumber);
}

// Delete products from invoice products table for new entry
const deleteQuotationProducts = async (invoiceNumber) => {
	const sql = `DELETE FROM invoice_products WHERE InvoiceNum_ID = ?`;
	return await executeQuery(sql, invoiceNumber);
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
	salesNRefundInvoices,
	customersMadePurchase,
	sixMonthAverageItemsSold,
	updateQuotation,
	deleteQuotation,
	deleteQuotationProducts,
	updateInvoice_Quotation,
	updateInvoiceProducts,
}