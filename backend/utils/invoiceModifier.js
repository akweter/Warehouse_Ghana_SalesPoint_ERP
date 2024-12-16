// Restructure invoice, refund, waybill invoices
const restructureInvoiceResult = (result) => {
    const modifiedResult = [];
    if (result) {
        result.forEach((row) => {
            const existingInvoice = modifiedResult.find(item => item.AutoID === row.AutoID);

            if (!existingInvoice) {
                const {
                    ProductName,
                    ProductPrice,
                    ProductDiscount,
                    Quantity,
                    RefundedQuantity,
                    ProductCategory,
                    itemCode,
                    IPID,
                    uom,
                    ...invoiceData
                } = row;
                const newInvoice = {
                    ...invoiceData,
                    products: [
                        {
                            ProductName,
                            ProductPrice,
                            ProductDiscount,
                            Quantity,
                            RefundedQuantity,
                            ProductCategory,
                            itemCode,
                            uom,
                            IPID,
                        }
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
                        IPID: row.IPID,
                    });
                }
            }
        });
    }
    return modifiedResult;
};

// Restructure delivery products transaction products
const restructureWaybillOutput = (result) => {
    const modifiedResult = [];

    if (result) {
        result.forEach((row) => {
            const existingWaybill = modifiedResult.find(item => item.WaybillID === row.WaybillID);

            if (!existingWaybill) {
                const {
                    SKU,
                    ProductName,
                    ProductUOM,
                    OrderedProducts,
                    DeliveredProducts,
                    OutstandingProducts,
                    ProductCategory,
                    ...waybillData
                } = row;

                const newWaybill = {
                    ...waybillData,
                    products: [
                        {
                            SKU,
                            ProductName,
                            ProductUOM,
                            OrderedProducts,
                            DeliveredProducts,
                            OutstandingProducts,
                            ProductCategory
                        }
                    ]
                };
                modifiedResult.push(newWaybill);
            } else {
                const existingProduct = existingWaybill.products.find(
                    product => product.ProductName === row.ProductName
                );

                if (!existingProduct) {
                    existingWaybill.products.push({
                        ProductName: row.ProductName,
                        SKU: row.SKU,
                        ProductUOM: row.ProductUOM,
                        OrderedProducts: row.OrderedProducts,
                        DeliveredProducts: row.DeliveredProducts,
                        OutstandingProducts: row.OutstandingProducts,
                        ProductCategory: row.ProductCategory
                    });
                }
            }
        });
    }
    return modifiedResult;
};

module.exports = {
    restructureInvoiceResult,
    restructureWaybillOutput,
};
