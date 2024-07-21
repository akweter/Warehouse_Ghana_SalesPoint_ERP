import requestMaking from "../../auth/setHeaderToken";

/*------------------------------------------------------------------------------*/
/*CHECK GRA SERVER STATUS*/
export const checkGRAServerStatus = async () => {
    const response = await requestMaking('gra/status', 'GET', null);
    try {
        if (response) {
            return response;
        }
    }
    catch (error) {
        return 'error';
    }
};

// Verify TIN
export const verifyTIN = async (id) => {
    const response = await requestMaking(`gra/verify/tin/${id}`, 'GET', null);
    try {
        if (response.ok) {
            return await response.json();
        }
    }
    catch (error) {
        return error;
    }
};
/*-------------------------------------------------------------------------------*/

// Fetch all invoice
export const fetchAllInvoices = async () => {
    const response = await requestMaking('invoices', 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all invoice
export const fetchAllQuotations = async () => {
    const response = await requestMaking('invoices/quote', 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all today sales invoices
export const fetchAllSalesInvoices = async () => {
    const response = await requestMaking('invoices/sales', 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all taxes for this montth
export const fetchAllThisMonthTaxes = async () => {
    const response = await requestMaking('invoices/tax/month', 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all invoice total amount and for this montth
export const fetchAllThisMonthDailyInvoiceAmount = async () => {
    const response = await requestMaking('invoices/day/invoice', 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all today sales invoices
export const fetchAllTodaySalesInvoices = async () => {
    const response = await requestMaking('invoices/today/sales', 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all week sales invoices
export const fetchAllWeekSalesInvoices = async () => {
    const response = await requestMaking('invoices/week/sales', 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all month sales invoices
export const fetchAllMonthSalesInvoices = async () => {
    const response = await requestMaking('invoices/month/sales', 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all year sales invoices
export const fetchAllYearSalesInvoices = async () => {
    const response = await requestMaking('invoices/year/sales', 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch invoice by ID
export const fetchInvoiceById = async (id) => {
    const response = await requestMaking(`invoices/${id}`, 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch ten invoice autocomplete
export const fetchTenInvoices = async () => {
    const response = await requestMaking(`invoices/ten`, 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch invoice autocomplete
export const fetchAutocompleteId = async () => {
    const response = await requestMaking(`invoices/number`, 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch Invoice details for Waybill
export const FetchWaybillInvoice = async (id) => {
    const response = await requestMaking(`invoices/waybill/${id}`, 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
}

/* ------------    POST REQUEST     -------------------*/
// post new invoice
export const postNewInvoice = async (data) => {
    const endpoint = data.invoiceType === "Proforma Invoice" ? "payload/quote" : "payload/invoice"; 
    const response = await requestMaking(endpoint, 'POST', data);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// post gra new invoice
export const postNewGRAInvoice = async (data) => {
    const endpoint = data.invoiceType === "Proforma Invoice" ? "gra/quote" : "gra/invoice";
    const response = await requestMaking(endpoint, 'POST', data);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Peform Refund cancellation
export const postRefundCancellation = async (data) => {
    const response = await requestMaking(`gra/refund/cancellation`, 'POST', data);
    if (response.ok) {
        return await response.json();
    }
    return null;
};
