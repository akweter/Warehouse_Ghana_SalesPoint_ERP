// const restructureInvoiceResult = (result) => {
//     const modifiedResult = [];

//     result.forEach((row) => {
//         const existingInvoice = modifiedResult.find(item => item.InvoiceID === row.InvoiceID);

//         if (!existingInvoice) {
//             const newInvoice = {
//                 ...row,
//                 products: [{
//                     ProductName: row.ProductName,
//                     ProductPrice: row.ProductPrice,
//                     ProductDiscount: row.ProductDiscount,
//                     Quantity: row.Quantity,
//                     RefundedQuantity: row.RefundedQuantity,
//                     ProductCategory: row.ProductCategory,
//                 }]
//             };
//             modifiedResult.push(newInvoice);
//         } else {
//             existingInvoice.products.push({
//                 ProductName: row.ProductName,
//                 ProductPrice: row.ProductPrice,
//                 ProductDiscount: row.ProductDiscount,
//                 Quantity: row.Quantity,
//                 RefundedQuantity: row.RefundedQuantity,
//                 ProductCategory: row.ProductCategory
//             });
//         }
//     });

//     return modifiedResult;
// };

const restructureInvoiceResult = (result) => {
    const modifiedResult = [];

    result.forEach((row) => {
        const existingInvoice = modifiedResult.find(item => item.InvoiceID === row.InvoiceID);

        if (!existingInvoice) {
            const { ProductName, ProductPrice, ProductDiscount, Quantity, RefundedQuantity, ProductCategory, ...invoiceData } = row;
            const newInvoice = {
                ...invoiceData,
                products: [{
                    ProductName,
                    ProductPrice,
                    ProductDiscount,
                    Quantity,
                    RefundedQuantity,
                    ProductCategory,
                }]
            };
            modifiedResult.push(newInvoice);
        } else {
            const existingProduct = existingInvoice.products.find(product => product.ProductName === row.ProductName);
            if (!existingProduct) {
                existingInvoice.products.push({
                    ProductName: row.ProductName,
                    ProductPrice: row.ProductPrice,
                    ProductDiscount: row.ProductDiscount,
                    Quantity: row.Quantity,
                    RefundedQuantity: row.RefundedQuantity,
                    ProductCategory: row.ProductCategory
                });
            }
        }
    });

    return modifiedResult;
};

module.exports = restructureInvoiceResult;
