const { addCustomer } = require("../controller/customers");
const {
    AddNewInvoices,
    saveInInvoiceProduct,
    updateRefundProducts,
    deleteQuotationProducts,
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
    const itemsFieldsToRemove = [
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
    ];

    const mainFieldsToRemove = [
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
    ];

    let sanitizedPayload = { ...data };
    sanitizedPayload = filterFields(sanitizedPayload, mainFieldsToRemove);
    sanitizedPayload.items = sanitizedPayload.items.map((item) =>
        filterFields(item, itemsFieldsToRemove)
    );
    return sanitizedPayload;
};

// Save invoice or quotation products
const addInvoiceProducts = async (Data) => {
    const { items, invoiceType, flag, invoiceNumber, infoMsg } = Data;
    if (items) {
        // Save Refund invoice
        if (['REFUND', 'PARTIAL_REFUND'].includes(flag)) {
            return await updateRefundProducts(update);
        }
        else {
            await deleteQuotationProducts(invoiceNumber);
            await Promise.all(items.map(async (item) => {
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
                try {
                    await saveInInvoiceProduct(data);
                }
                catch (error) {
                    throw error;
                }
            }));
        }
    }
}

// Save invoice or quotation
const saveInvoiceToDB = async (Data, responseData) => {
    const {
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
        increment,
        reference,
        delivery,
        invoiceType,
        userPhone,
        invCusId,
    } = Data;

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

    const payload = [
        0,
        increment,
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
        return await addInvoiceProducts(Data);
    }
    catch (err) {
        return err;
    }
};

module.exports = { sanitizePayload, saveInvoiceToDB, addInvoiceProducts }
