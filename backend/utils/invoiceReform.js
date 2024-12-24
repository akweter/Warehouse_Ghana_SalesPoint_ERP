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
        "checkdID",
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
    ];
    return await updateQuotation(payload);    
    
}

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

    // Customer basket
    let checkID = null;

    // Customer basket
    let CID = null;

    // Generate customer ID
    const customerID = (id) => {
        if (CID === null) {
            if (!id || id === "") {
                CID = generateUUID();
            } else {
                CID = id;
            }
        }
        return CID;
    }
    
    // Generate unique ID to track and avoid saving duplicated info
    const generateCheckID = (id) => {
        if (checkID === null) {
            if (!id || id === "") {
                checkID = generateUUID();
            } else {
                checkID = id;
            }
        }
        return checkID;
    }

    const invoiceValue = flag === "REFUND" ? "REFUND" : invoiceType

    const payload = [
        AutoID,
        generateCheckID(checkdID),
        userName,
        totalAmount,
        invoiceValue,
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
        if (invoiceType === "Invoice" && checkID !== '') {
            await updateDBWithGRAResponse(responseData);
        } else {
            //saving into DB invoice, refund, quotattion, quotation edit
            await AddNewInvoices(payload);

            // saving cash customers to DB
            if (businessPartnerTin === "C0000000000") {
                await addCustomer(customerAdd);
            }

            // saving invoice products
            if (items) {
                if (flag === 'REFUND' || flag === 'PARTIAL_REFUND') {
                    const result = await Promise.all(items.map(async (item) => {
                        const {
                            quantity,
                            itemCode,
                        } = item;
                        
                        // Single product payload
                        const updateProductVoid = [
                            quantity,
                            itemCode,
                            invoiceNumber
                        ];
                        await updateRefundProducts(updateProductVoid);
                    }));
                    return result;
                } else {
                    await deleteQuotationProducts(invoiceNumber);
                    const result = await Promise.all(items.map(async (item) => {
                        const {
                            itemCode,
                            unitPrice,
                            discountAmount,
                            quantity,
                            invProID,
                        } = item;

                        // Generate product ID
                        const product_ID = (id) => {
                            let productID = null;
                            
                            if (productID === null) {
                                if (!id || id === "") {
                                    productID = generateUUID();
                                } else {
                                    productID = id;
                                }
                            }
                            return productID;
                        }
                        // Single product payload
                        const productPayload = [
                            product_ID(invProID),
                            invoiceNumber,
                            itemCode,
                            unitPrice,
                            discountAmount,
                            quantity,
                            0,
                        ];
                        await saveInInvoiceProduct(productPayload);
                    }));
                    return result;
                }
            }
        }
        return { status: 'success', message: 'Transaction successful' }
    } catch (error) {
        return ({ status: 'error', message: error });
    }
};

module.exports = { 
    sanitizePayload, 
    saveInvoiceToDB, 
    updateDBWithGRAResponse,
}
