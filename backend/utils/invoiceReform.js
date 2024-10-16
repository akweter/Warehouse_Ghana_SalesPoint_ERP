const { addCustomer } = require("../controller/customers");
const {
    AddNewInvoices,
    saveInInvoiceProduct,
    updateQuotation,
    deleteQuotationProducts,
    updateRefundProducts,
} = require("../controller/salesNinvoices");
const generateUUID = require("./generateIDs");

// FIlter and remove unnecessary fields
const filterFields = (obj, fieldsToRemove) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !fieldsToRemove.includes(key))
    );
};

// Trim the payload to GRA Standard
const sanitizePayload = (data) => {
    const itemLevel = [
        "itemSubtotal",
        "totalVat",
        "totalLevy",
        "totalAmount",
        "saleType",
        "calculationType",
        "currency",
        "exchangeRate",
        "alt",
        "refProQty",
        "invoiceType",
        "businessPartnerName",
        "userPhone",
        "invProID",
    ];

    const documentLevel = [
        "invCusId",
        "remarks",
        "unitPrice",
        "quantity",
        "itemSubtotal",
        "remarks",
        "nhil",
        "getfund",
        "covid",
        "cst",
        "tourism",
        "increment",
        "status",
        "delivery",
        "invoiceType",
        "quote",
        "infoMsg",
        "userPhone",
        "callback",
    ];

    let sanitizedPayload = { ...data };
    sanitizedPayload = filterFields(sanitizedPayload, documentLevel);
    sanitizedPayload.items = sanitizedPayload.items.map((item) =>
        filterFields(item, itemLevel)
    );
    return sanitizedPayload;
};

// update Database with gra QR code for a particular invoice number
const updateDBWithGRAResponse = async (response) => {
    const {
        qr_code,
        message: {
            flag,
            ysdcmrctim,
            ysdcid,
            ysdcrecnum,
            ysdcintdata,
            ysdcregsig,
            ysdcmrc,
            ysdctime,
            num,
        }
    } = response.response;
    const payload = [
        flag,
        ysdcmrctim,
        ysdcid,
        ysdcrecnum,
        ysdcintdata,
        ysdcregsig,
        ysdcmrc,
        ysdcmrctim,
        ysdctime,
        qr_code,
        num,
        flag,
    ];
    return await updateQuotation(payload);
}

// Save invoice or quotation
// const saveInvoiceToDB = async (Data, responseData) => {
//     const {
//         AutoID,
//         checkdID,
//         userName,
//         totalAmount,
//         transactionDate,
//         currency,
//         invoiceNumber,
//         businessPartnerTin,
//         businessPartnerName,
//         discountAmount,
//         totalVat,
//         exchangeRate,
//         remarks,
//         nhil,
//         getfund,
//         covid,
//         cst,
//         tourism,
//         calculationType,
//         saleType,
//         discountType,
//         reference,
//         delivery,
//         invoiceType,
//         userPhone,
//         invCusId,
//         items,
//         flag,
//     } = Data;

//     // Customer basket
//     let checkID = null;

//     // Customer basket
//     let CID = null;

//     // Generate customer ID
//     const customerID = (id) => {
//         if (CID === null) {
//             if (!id || id === "") {
//                 CID = generateUUID();
//             } else {
//                 CID = id;
//             }
//         }
//         return CID;
//     }
    
//     // Generate unique ID to track and avoid saving duplicated info
//     const generateCheckID = (id) => {
//         if (checkID === null) {
//             if (!id || id === "") {
//                 checkID = generateUUID();
//             } else {
//                 checkID = id;
//             }
//         }
//         return checkID;
//     }

//     const payload = [
//         AutoID,
//         generateCheckID(checkdID),
//         userName,
//         totalAmount,
//         invoiceType,
//         calculationType,
//         transactionDate,
//         currency,
//         saleType,
//         invoiceNumber,
//         businessPartnerTin,
//         customerID(invCusId),
//         discountAmount,
//         exchangeRate,
//         totalVat,
//         generateUUID(),
//         reference,
//         remarks,
//         nhil,
//         getfund,
//         covid,
//         cst,
//         tourism,
//         discountType,
//         responseData.response.message.ysdcid,
//         responseData.response.message.ysdcrecnum,
//         responseData.response.message.ysdcintdata,
//         responseData.response.message.ysdcregsig,
//         responseData.response.message.ysdcmrc,
//         responseData.response.message.ysdcmrctim,
//         responseData.response.message.ysdctime,
//         responseData.response.qr_code,
//         delivery,
//     ];

//     const customerAdd = [
//         businessPartnerName,
//         businessPartnerTin,
//         "",
//         userPhone,
//         "",
//         "Active",
//         "",
//         "Taxable",
//         2,
//         customerID(invCusId),
//         new Date(),
//     ];

//     try {
//         //saving into DB invoice, refund, quotattion, quotation edit
//         await AddNewInvoices(payload);

//         // saving cash customers to DB
//         if (businessPartnerTin === "C0000000000") {
//             await addCustomer(customerAdd);
//         }

//         // saving invoice products
//         if (items) {
//             if (flag === 'REFUND' || flag === 'PARTIAL_REFUND') {
//                 const result = await Promise.all(items.map(async (item) => {
//                     const {
//                         quantity,
//                         invProID,
//                     } = item;
                    
//                     // Single product payload
//                     const updateProductVoid = [
//                         quantity,
//                         invProID,
//                         invoiceNumber
//                     ];
//                     const updaterefundqty = await updateRefundProducts(updateProductVoid);
//                     console.log(`update one product refund qty => ${updateProductVoid}  \n response`, updaterefundqty);
//                 }));
//                 console.log('update all refund products', result);
//                 return result;
//             } else {
//                 await deleteQuotationProducts(invoiceNumber);
//                 const result = await Promise.all(items.map(async (item) => {
//                     const {
//                         itemCode,
//                         unitPrice,
//                         discountAmount,
//                         quantity,
//                         invProID,
//                     } = item;

//                     // Generate product ID
//                     const product_ID = (id) => {
//                         let productID = null;
                        
//                         if (productID === null) {
//                             if (!id || id === "") {
//                                 productID = generateUUID();
//                             } else {
//                                 productID = id;
//                             }
//                         }
//                         return productID;
//                     }
//                     // Single product payload
//                     const productPayload = [
//                         product_ID(invProID),
//                         invoiceNumber,
//                         itemCode,
//                         unitPrice,
//                         discountAmount,
//                         quantity,
//                         0,
//                     ];
//                     const savingProduct = await saveInInvoiceProduct(productPayload);
//                     console.log(`adding product => ${productPayload}  \n response`, savingProduct);
//                 }));
//                 return result;
//             }
//         }
//         return { status: 'success', message: 'Transaction successful' }
//     } catch (error) {
//         return ({ status: 'error', message: error });
//     }
// };

// Save invoice or quotation
const saveInvoiceToDB = async (Data, responseData) => {
    const {
        AutoID,
        checkdID,
        userName,
        totalAmount,
        transactionDate,
        currency,
        invoiceNumber,
        businessPartnerTin,
        businessPartnerName,
        discountAmount,
        totalVat,
        exchangeRate,
        remarks,
        nhil,
        getfund,
        covid,
        cst,
        tourism,
        calculationType,
        saleType,
        discountType,
        reference,
        delivery,
        invoiceType,
        userPhone,
        invCusId,
        items,
        flag,
    } = Data;

    let checkID = null;
    let CID = null;

    const customerID = (id) => {
        if (CID === null) {
            CID = id || generateUUID();
        }
        return CID;
    };

    const generateCheckID = (id) => {
        if (checkID === null) {
            checkID = id || generateUUID();
        }
        return checkID;
    };

    const payload = [
        AutoID,
        generateCheckID(checkdID),
        userName,
        totalAmount,
        invoiceType,
        calculationType,
        transactionDate,
        currency,
        saleType,
        invoiceNumber,
        businessPartnerTin,
        customerID(invCusId),
        discountAmount,
        exchangeRate,
        totalVat,
        generateUUID(),
        reference,
        remarks,
        nhil,
        getfund,
        covid,
        cst,
        tourism,
        discountType,
        responseData.response.message.ysdcid,
        responseData.response.message.ysdcrecnum,
        responseData.response.message.ysdcintdata,
        responseData.response.message.ysdcregsig,
        responseData.response.message.ysdcmrc,
        responseData.response.message.ysdcmrctim,
        responseData.response.message.ysdctime,
        responseData.response.qr_code,
        delivery,
    ];

    const customerAdd = [
        businessPartnerName,
        businessPartnerTin,
        "",
        userPhone,
        "",
        "Active",
        "",
        "Taxable",
        2,
        customerID(invCusId),
        new Date(),
    ];

    try {
        await AddNewInvoices(payload);
        if (businessPartnerTin === "C0000000000") {
            await addCustomer(customerAdd);
        }
        if (items) {
            if (flag === 'REFUND' || flag === 'PARTIAL_REFUND') {
                return await handleRefundItems(items, invoiceNumber);
            } else {
                await deleteQuotationProducts(invoiceNumber);
                return await handleInvoiceItems(items, invoiceNumber);
            }
        }
        return { status: 'success', message: 'Transaction successful' };
    } catch (error) {
        return { status: 'error', message: error };
    }
};

const handleRefundItems = async (items, invoiceNumber) => {
    const results = await Promise.all(items.map(async (item) => {
        const { quantity, invProID } = item;
        const updateProductVoid = [quantity, invProID, invoiceNumber];
        const result = await updateRefundProducts(updateProductVoid);
        console.log(`Update one product refund qty => ${updateProductVoid}  \n response`, result);
        return result;
    }));
    console.log('Update all refund products', results);
    return results;
};

const handleInvoiceItems = async (items, invoiceNumber) => {
    const results = await Promise.all(items.map(async (item) => {
        const { itemCode, unitPrice, discountAmount, quantity, invProID } = item;
        const product_ID = invProID || generateUUID();

        const productPayload = [
            product_ID,
            invoiceNumber,
            itemCode,
            unitPrice,
            discountAmount,
            quantity,
            0,
        ];

        const savingProduct = await saveInInvoiceProduct(productPayload);
        console.log(`Adding product => ${productPayload}  \n response`, savingProduct);
        return savingProduct;
    }));
    return results;
};

module.exports = { 
    sanitizePayload, 
    saveInvoiceToDB, 
    updateDBWithGRAResponse,
}
