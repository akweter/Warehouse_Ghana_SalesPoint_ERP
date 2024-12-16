const { executeQuery } = require("../database/index");

// Fetch deliveries
const fetchAllDeliveries = async () => {
	const sql = `
        SELECT
            w.id AS WaybillID,
            w.invoiceNumber AS InvoiceNumber,
            i.Inv_total_amt AS TotalAMount,
            i.currency AS Currency,
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
            wp.Product_Ordered AS OrderedProducts,
            wp.Product_Delivered AS DeliveredProducts,
            wp.Product_Outstanding AS OutstandingProducts,
            invt.Itm_id AS SKU,
            invt.Itm_UOM AS ProductUOM,
            invt.Itm_name AS ProductName,
            invt.Itm_taxable AS ProductCategory
        FROM
            waybill w
        LEFT JOIN
            customers c ON w.customerID = c.C_id
        LEFT JOIN
            invoice i ON c.C_id = i.Inv_Cus_ID
        LEFT JOIN
            waybill_products wp ON w.invoiceNumber = wp.InvoiceNum_ID
        LEFT JOIN
		    inventory invt ON wp.Product_ID = invt.Itm_id
        ORDER BY
            w.id DESC;
    `;
    return await executeQuery(sql);
}

module.exports = {
    fetchAllDeliveries,
}




