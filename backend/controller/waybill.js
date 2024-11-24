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

module.exports = {
    saveNewWayBill,
}
