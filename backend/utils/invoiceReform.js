const { addCustomer } = require("../controller/customers");
const {
    AddNewInvoices,
    saveInInvoiceProduct,
    updateRefundProducts,
    updateQuotation,
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

// Save invoice or quotation products
const addInvoiceProducts = async (Data) => {
    const { items, flag, invoiceNumber } = Data;
    if (items) {
        // Save Refund invoice
        if (['REFUND', 'PARTIAL_REFUND'].includes(flag)) {
            return await updateRefundProducts(update);
        }
        else {
            // await deleteQuotationProducts(invoiceNumber);
            const result = await Promise.all(items.map(async (item) => {
                const {
                    itemCode,
                    unitPrice,
                    discountAmount,
                    quantity,
                } = item;
                const data = [
                    generateUUID(),
                    invoiceNumber,
                    itemCode,
                    unitPrice,
                    discountAmount,
                    quantity,
                    0,
                ];
                return await saveInInvoiceProduct(data);
            }));
            return result;
        }
    }
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
        await addInvoiceProducts(Data);
        return { status: 'success' }
    } catch (error) {
        return error;
    }
};

module.exports = { sanitizePayload, saveInvoiceToDB, addInvoiceProducts, updateDBWithGRAResponse }
