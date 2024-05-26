const {
    updateInvoiceQRCodes,
    AddNewInvoices, 
    saveInInvoiceProduct, 
    updateRefundProducts 
} = require("../controller/salesNinvoices");
const { logErrorMessages, logSuccessMessages } = require("./saveLogfile");

const filterFields = (obj, fieldsToRemove) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !fieldsToRemove.includes(key))
    );
};

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
    ];

    let sanitizedPayload = { ...data };
    sanitizedPayload = filterFields(sanitizedPayload, mainFieldsToRemove);
    sanitizedPayload.items = sanitizedPayload.items.map((item) =>
        filterFields(item, itemsFieldsToRemove)
    );
    return sanitizedPayload;
};

const saveInvoiceToDB = async (Data, sanitizedPayload, responseData) => {
    const { items } = Data;

    const {
        userName,
        totalAmount,
        transactionDate,
        currency,
        invoiceNumber,
        businessPartnerTin,
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
        discountAmount,
        exchangeRate,
        totalVat,
        UUID(),
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

    try {
        if (quote || quote === "Yes") {
            await updateInvoiceQRCodes(load)
                .then((success) => { return success })
                .catch((err) => {
                    logErrorMessages(`Error saving QR code info for invoice ${invoiceNumber}, Error: ${JSON.stringify(err)}`);
                    return { status: 'error', message: 'Operation Failed! Try it again' };
                })
        }
        else {
            await AddNewInvoices(payload)
                .then(async () => {
                    if (items) {
                        items.map(async (item) => {
                            const {
                                itemCode,
                                unitPrice,
                                discountAmount,
                                quantity,
                                refProQty,
                            } = item;
                            const data = [
                                UUID(),
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
                            ]

                            if (invoiceType === 'Invoice' || invoiceType === 'Quotation') {
                                await saveInInvoiceProduct(data)
                                    .then(() => { null })
                                    .catch((err) => {
                                        logErrorMessages(`Error saving products: ${itemCode} for invoice ${invoiceNumber}, <> ${JSON.stringify(err)}`);
                                        return { status: 'error', message: 'Please refresh and Issue new invoice' };
                                    })
                            }
                            else if (invoiceType === 'REFUND' || invoiceType === 'Partial_Refund') {
                                await updateRefundProducts(update)
                                    .then(() => { null })
                                    .catch((err) => {
                                        logErrorMessages(`Error updating products refunded qty:${itemCode} for invoice ${invoiceNumber}, <> ${JSON.stringify(err)}`);
                                        return { status: 'error', message: 'Please refresh and Issue new invoice' };
                                    });
                            }
                        });
                    }
                    logSuccessMessages(`${Data.userName} - ${invoiceType} ${invoiceNumber} added successfully`);
                    return { status: 'success', gra: responseData.response, payload: sanitizedPayload };
                })
                .catch((error) => {
                    logErrorMessages(`Error saving invoice: ${invoiceNumber} to Database ${JSON.stringify(error)}`)
                    return { status: 'error', message: 'Please refresh and Issue new invoice' };
                });
        }
    } catch (err) {
        logErrorMessages(`Error adding Invoice ${invoiceNumber}: ${err.message}`);
        return `Error saving invoice: "${invoiceNumber}"`;
    }
};

module.exports = { sanitizePayload, saveInvoiceToDB }
