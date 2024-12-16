const { executeQuery } = require("../database/index")

// Save Waybill Data in Database
const saveNewWayBill = async (data) => {
    const sql = `
	  INSERT INTO 
        waybill(
            id, 
            invoiceNumber, 
            issuerName, 
            customerID, 
            _mod, 
            despatchDate,         
            receipientName, 
            receipientAddress, 
            receipientPhone, 
            deliveryName, 
            deliveryPhone
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        ON DUPLICATE KEY UPDATE
            issuerName = VALUES(issuerName),
            customerID = VALUES(customerID),
            _mod = VALUES(_mod),
            despatchDate = VALUES(despatchDate),
            receipientName = VALUES(receipientName),
            receipientAddress = VALUES(receipientAddress),
            receipientPhone = VALUES(receipientPhone),
            deliveryName = VALUES(deliveryName),
            deliveryPhone = VALUES(deliveryPhone)
	  `;
    return await executeQuery(sql, data);
};

// save waybill products into database
const checkBillProducts = async (invoiceNumber, SKU) => {
    const checkQuery = `
    SELECT 
        InvoiceNum_ID, Product_ID
    FROM 
        waybill_products
    WHERE
        InvoiceNum_ID = ? AND Product_ID = ?
    LIMIT 1
    `;
    return await executeQuery(checkQuery, [invoiceNumber, SKU]);
}

// save waybill products into database
const saveWaybillProducts = async (payload) => {
    const sql = `
        INSERT INTO
            waybill_products (
                _ID,
                InvoiceNum_ID, 
                Product_ID, 
                Product_Ordered, 
                Product_Delivered, 
                Product_Outstanding,
                CheckID
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?
            )
        `;
    return await executeQuery(sql, payload);
}

// save waybill products into database
const updateWaybillProducts = async (payload) => {
    const sql = `
            UPDATE 
                waybill_products
            SET 
                Product_Delivered = Product_Delivered + ?,
                Product_Outstanding = Product_Outstanding + ?
            WHERE 
                InvoiceNum_ID = ? AND Product_ID = ?
        `;
    return await executeQuery(sql, payload);

}

module.exports = {
    saveNewWayBill,
    checkBillProducts,
    saveWaybillProducts,
    updateWaybillProducts,
}

// ON DUPLICATE KEY UPDATE
//     Product_Delivered = Product_Delivered + VALUES(Product_Delivered),
//     Product_Outstanding = Product_Outstanding + VALUES(Product_Outstanding)
