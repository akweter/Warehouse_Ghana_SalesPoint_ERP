import requestMaking from "../../auth/setHeaderToken";

const handleRequest = async (url, method, data = null) => {
    try {
        const response = await requestMaking(url, method, data);
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }        
        return response;
    } catch (error) {
        return error;
    }
};

// Fetch all refund invoices
export const fetchRefundInvoices = async () => {
    return await handleRequest(`refunds/`, 'GET');
};

// Fetch all refunded products
export const fetchRefundedProducts = async () => {
    return await handleRequest(`refunds/products`, 'GET');
};

// Fetch all counted refund invoices
export const fetchCountAllRefundInvoices = async () => {
    return await handleRequest(`refunds/countall`, 'GET');
};

// Fetch all refund invoices
export const fetchRefundCancelledInvoices = async () => {
    return await handleRequest(`refunds/cancelled`, 'GET');
};

// Fetch all today refund invoices
export const fetchAllTodayRefundsInvoices = async () => {
    return await handleRequest('refunds/today', 'GET');
};

// Fetch all today refund invoices
export const fetchTodayRefundsCancelledInvoices = async () => {
    return await handleRequest('refundS/today/cancelled', 'GET');
};


/****** POST REQUESTS  ******/

// Perform Refund Invoice
export const postRefundInvoice = async (data) => {
    return await handleRequest(`gra/refund`, 'POST', data);
};
