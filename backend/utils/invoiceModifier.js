const restructureInvoiceResult = (result) => {
    const modifiedResult = [];
    if (result) {
        result.forEach((row) => {
            const existingInvoice = modifiedResult.find(item => item.AutoID === row.AutoID);

            if (!existingInvoice) {
                const { ProductName, ProductPrice, ProductDiscount, Quantity, RefundedQuantity, ProductCategory, itemCode, IPID, uom, ...invoiceData } = row;
                const newInvoice = {
                    ...invoiceData,
                    products: [
                        { ProductName, ProductPrice, ProductDiscount, Quantity, RefundedQuantity, ProductCategory, itemCode, uom, IPID,}
                    ]
                };
                modifiedResult.push(newInvoice);
            }
            else {
                const existingProduct = existingInvoice.products.find(product => product.ProductName === row.ProductName);
                if (!existingProduct) {
                    existingInvoice.products.push({
                        ProductName: row.ProductName,
                        ProductPrice: row.ProductPrice,
                        ProductDiscount: row.ProductDiscount,
                        Quantity: row.Quantity,
                        RefundedQuantity: row.RefundedQuantity,
                        ProductCategory: row.ProductCategory,
                        itemCode: row.itemCode,
                        uom: row.uom,
                    });
                }
            }
        });
    }
    return modifiedResult;
};
module.exports = restructureInvoiceResult;
