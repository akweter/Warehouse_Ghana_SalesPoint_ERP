import requestMaking from "../../auth/setHeaderToken";

const handleRequest = async (url, method, data = null) => {
    const response = await requestMaking(url, method, data);
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    }        
    return response;
};

/*------------------------------------------------------------------------------*/
/*CHECK GRA SERVER STATUS*/
export const checkGRAServerStatus = async () => {
    return await handleRequest('gra/status', 'GET');
};

// Verify TIN
export const verifyTIN = async (id) => {
    return await handleRequest(`gra/verify/tin/${id}`, 'GET');
};

// Fetch all invoices
export const fetchAllInvoices = async () => {
    return await handleRequest('invoices', 'GET');
};

// Fetch all quotations
export const fetchAllQuotations = async () => {
    return await handleRequest('invoices/quotes', 'GET');
};

// Fetch all today sales invoices
export const fetchAllSalesInvoices = async () => {
    return await handleRequest('invoices/sales', 'GET');
};

// Fetch all taxes for this month
export const fetchAllThisMonthTaxes = async () => {
    return await handleRequest('invoices/tax/month', 'GET');
};

// Fetch all invoice total amount for this month
export const fetchAllThisMonthDailyInvoiceAmount = async () => {
    return await handleRequest('invoices/day/invoice', 'GET');
};

// Fetch all today sales invoices
export const fetchAllTodaySalesInvoices = async () => {
    return await handleRequest('invoices/today/sales', 'GET');
};

// Fetch all week sales invoices
export const fetchAllWeekSalesInvoices = async () => {
    return await handleRequest('invoices/week/sales', 'GET');
};

// Fetch all month sales invoices
export const fetchAllMonthSalesInvoices = async () => {
    return await handleRequest('invoices/month/sales', 'GET');
};

// Fetch all year sales invoices
export const fetchAllYearSalesInvoices = async () => {
    return await handleRequest('invoices/year/sales', 'GET');
};

// Fetch invoice by ID
export const fetchInvoiceById = async (id) => {
    return await handleRequest(`invoices/${id}`, 'GET');
};

// Fetch ten invoice autocomplete
export const fetchTenInvoices = async () => {
    return await handleRequest('invoices/ten', 'GET');
};

// Fetch invoice autocomplete
export const fetchAutocompleteId = async () => {
    return await handleRequest('invoices/number', 'GET');
};

// Fetch Invoice details for Waybill
export const FetchWaybillInvoice = async (id) => {
    return await handleRequest(`invoices/waybill/${id}`, 'GET');
};

// Fetch Quotation Invoice details for Waybill
export const fetchQuoteInvoices = async () => {
    return await handleRequest('invoices/quotes', 'GET');
};

/* ------------    POST REQUEST     -------------------*/

// Post new invoice
export const postNewInvoice = async (data) => {
    const endpoint = data.invoiceType === "PROFORMA INVOICE" ? "payload/quote" : "payload/invoice";
    return await handleRequest(endpoint, 'POST', data);
};

// Post GRA new invoice
export const postNewGRAInvoice = async (data) => {
    const endpoint = data.invoiceType === "PROFORMA INVOICE" ? "gra/quote" : "gra/invoice";
    return await handleRequest(endpoint, 'POST', data);
};

// Post GRA invoice callback 
export const postGRAInvoiceCallback = async (data) => {
    return await handleRequest('gra/callback', 'POST', data);
};

// Perform Refund cancellation
export const postRefundCancellation = async (data) => {
    return await handleRequest('gra/refund/cancellation', 'POST', data);
};

// Post Waybill Data
export const postWaybillData = async (payload) => {
    return await handleRequest('waybill', 'POST', payload);
};

// Delete quotation based on invoice
export const deleteQuotation = async (id) => {
    return await handleRequest(`invoices/quote/del/${id}`, 'DELETE');
};
