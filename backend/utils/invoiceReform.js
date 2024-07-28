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

// Generate customer ID
let customer_id = null;
const customerID = (id) => {
    if (customer_id === null) {
        customer_id = id || generateUUID();
    }
    return customer_id;
};

// Save invoice or quotation products
const addInvoiceProducts = async (items, invoiceType, flag, invoiceNumber) => {
    if (items) {
        await Promise.all(items.map(async (item) => {
            const {
                itemCode,
                unitPrice,
                discountAmount,
                quantity,
                refProQty,
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
            const update = [
                quantity,
                itemCode,
                invoiceNumber,
            ];

            if (invoiceType && invoiceType === 'Proforma Invoice') {
                try {
                    const deletePRoducts = await deleteQuotationProducts(invoiceNumber);
                    if(deletePRoducts){
                        return await saveInInvoiceProduct(data);
                    }
                }
                catch (error) {
                    return error;
                }
            }
            else if (['REFUND', 'PARTIAL_REFUND'].includes(flag)) {
                try {
                    return await updateRefundProducts(update);
                }
                catch (err) {
                    return err;
                }
            }
            else {
                try {
                    return await saveInInvoiceProduct(data);
                } catch (error) {
                    return error;
                }
            }
        }));
    }
}

// Save invoice or quotation
const saveInvoiceToDB = async (Data, responseData) => {
    const {
        items,
        flag,
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
        quote,
        userPhone,
        invCusId,
    } = Data;

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

    const load = [
        "Invoice",
        transactionDate,
        responseData.response.message.ysdcid,
        responseData.response.message.ysdcrecnum,
        responseData.response.message.ysdcintdata,
        responseData.response.message.ysdcregsig,
        responseData.response.message.ysdcmrc,
        responseData.response.message.ysdcmrctim,
        responseData.response.message.ysdctime,
        responseData.response.qr_code,
        invoiceNumber,
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
        return await addInvoiceProducts(items, invoiceType, flag, invoiceNumber);
    }
    catch (err) {
        return err;
    }
};

module.exports = { sanitizePayload, saveInvoiceToDB, addInvoiceProducts }
