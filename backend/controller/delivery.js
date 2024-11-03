const { executeQuery } = require("../database/index");

// Fetch deliveries
const fetchAllDeliveries = async () => {
	const sql = `
        SELECT
            w.id AS WaybillID,
            w.invoiceNumber AS InvoiceNumber,
            w.issuerName AS IssuerName,
            c.C_name AS CustomerName,
            c.C_tin AS CustomerTin,
            w.customerID AS CustomerID,
            w._mod AS Mode,
            w.despatchDate AS DespatchDate,
            w.receipientName AS RecipientName,
            w.receipientAddress AS RecipientAddress,
            w.receipientPhone AS RecipientPhone,
            w.deliveryName AS DeliveryName,
            w.deliveryPhone AS DeliveryPhone
        FROM
            waybill w
        LEFT JOIN
            customers c ON w.customerID = c.C_id
        ORDER BY
            w.id DESC;
    `;
	try {
		return await executeQuery(sql);
		
	}
	catch (error) {
		return error;
	}
}

module.exports = {
    fetchAllDeliveries,
}




