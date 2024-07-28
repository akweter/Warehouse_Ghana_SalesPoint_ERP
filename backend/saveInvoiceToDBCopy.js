const saveInvoiceToDB = async (Data, sanitizedPayload, responseData) => {
    const { items } = Data;
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
        quote,
        userPhone,
        invCusId,
    } = Data;

    let customer_id = null;

    function customerID(id) {
        if (customer_id === null) {
            if (!id || id === "") {
                customer_id = generateUUID();
            } else {
                customer_id = id;
            }
        }
        return customer_id;
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
    ]

    try {
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
                        ]

                        if (invoiceType && invoiceType === 'Proforma Invoice') {
                            // Either post new items or update them and add the items
                            // if invoiceNumber do not have a particular itemCode, it should add it
                            // If we do not have the invoiceNumber in the invoice_products table, then run await saveInInvoiceProduct(data) to save the products in the invoice
                            return true;
                        }
                        else if (invoiceType === 'REFUND' || invoiceType === 'Partial_Refund') {
                            // Update product redunded quantity
                            await updateRefundProducts(update)
                            .then(() => { return true })
                            .catch((err) => {
                                logErrorMessages(`Error updating products refunded qty:${itemCode} for invoice ${invoiceNumber}: ${JSON.stringify(err)}`);
                                return { status: 'error', message: 'Please refresh and Issue new invoice' };
                            });
                        }

                        // Save cash customers to DB
                        await saveInInvoiceProduct(data)
                        .then( async() => {
                            if (businessPartnerTin === "C0000000000") {
                                return await addCustomer(customerAdd);
                            }
                            return true;
                        })
                        .catch( async(err) => {
                            await logErrorMessages(`Error saving products: ${itemCode} for invoice ${invoiceNumber}: ${(err)}`);
                            return { status: 'error', message: 'Please refresh and Issue new invoice' };
                        });
                    });
                }
                logSuccessMessages(`${Data.userName} - ${invoiceType} ${invoiceNumber} added successfully`);
                return { status: 'success', gra: responseData.response, payload: sanitizedPayload };
            })
            .catch((error) => {
                logErrorMessages(`Error saving invoice: ${invoiceNumber} to Database ${JSON.stringify(error)}`)
                return { status: 'error', message: 'Please refresh and Issue new invoice' };
            });
    } catch (err) {
        logErrorMessages(`Error adding Invoice ${invoiceNumber}: ${err.message}`);
        return `Error saving invoice: "${invoiceNumber}"`;
    }
};