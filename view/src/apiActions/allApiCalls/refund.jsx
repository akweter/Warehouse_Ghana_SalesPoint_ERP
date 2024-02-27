import requestMaking from "auth/setHeaderToken";

// Fetch all refund invoices
export const fetchRefundInvoices = async () => {
    const response = await requestMaking(`refunds/`, 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all refunded products
export const fetchRefundedProducts = async () => {
    const response = await requestMaking(`refunds/products`, 'GET', null);
    if (response === undefined) {
        return [];
    }
    return await response.json();
    
};

// Fetch all counted refund invoices
export const fetchCountAllRefundInvoices = async () => {
    const response = await requestMaking(`refunds/countall`, 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all refund invoices
export const fetchRefundCancelledInvoices = async () => {
    const response = await requestMaking(`refunds/cancelled`, 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all today refund invoices
export const fetchAllTodayRefundsInvoices = async () => {
    const response = await requestMaking('refunds/today', 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all today refund invoices
export const fetchTodayRefundsCancelledInvoices = async () => {
    const response = await requestMaking('refundS/today/cancelled', 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};


/****** POST REQUESTS  ******/

// Perform Refund Invoice
export const postRefundInvoice = async (data) => {
    const response = await requestMaking(`gra/refund`, 'POST', data);
    if (response.ok) {
        return await response.json();
    }
    return null;
};
