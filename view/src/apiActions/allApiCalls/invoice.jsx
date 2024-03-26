import requestMaking from "auth/setHeaderToken";

// Fetch all invoice
export const fetchAllInvoices = async () => {
    const response = await requestMaking('invoices', 'GET', null); 
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
    const response = await requestMaking(`invoices/all`, 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

/* ------------    POST REQUEST        -------------------*/

// post gra new invoice
export const postNewInvoice = async (data) => {
    const response = await requestMaking(`gra/invoice`, 'POST', data);
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
