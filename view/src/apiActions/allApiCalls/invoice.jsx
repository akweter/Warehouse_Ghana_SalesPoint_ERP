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

/*------------------------------------------------------------------------------*/
/*CHECK GRA SERVER STATUS*/
export const checkGRAServerStatus = async () => {
    return await handleRequest('gra/status', 'GET');
};

// // Verify TIN
// export const verifyTIN = async (id) => {
//     const response = await requestMaking(`gra/verify/tin/${id}`, 'GET', null);
//     try {
//         if (response.ok) {
//             return await response.json();
//         }
//     }
//     catch (error) {
//         return error;
//     }
// };
// /*-------------------------------------------------------------------------------*/

// // Fetch all invoice
// export const fetchAllInvoices = async () => {
//     const response = await requestMaking('invoices', 'GET', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// };

// // Fetch all invoice
// export const fetchAllQuotations = async () => {
//     const response = await requestMaking('invoices/quotes', 'GET', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// };

// // Fetch all today sales invoices
// export const fetchAllSalesInvoices = async () => {
//     const response = await requestMaking('invoices/sales', 'GET', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// };

// // Fetch all taxes for this montth
// export const fetchAllThisMonthTaxes = async () => {
//     const response = await requestMaking('invoices/tax/month', 'GET', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// };

// // Fetch all invoice total amount and for this montth
// export const fetchAllThisMonthDailyInvoiceAmount = async () => {
//     const response = await requestMaking('invoices/day/invoice', 'GET', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// };

// // Fetch all today sales invoices
// export const fetchAllTodaySalesInvoices = async () => {
//     const response = await requestMaking('invoices/today/sales', 'GET', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// };

// // Fetch all week sales invoices
// export const fetchAllWeekSalesInvoices = async () => {
//     const response = await requestMaking('invoices/week/sales', 'GET', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// };

// // Fetch all month sales invoices
// export const fetchAllMonthSalesInvoices = async () => {
//     const response = await requestMaking('invoices/month/sales', 'GET', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// };

// // Fetch all year sales invoices
// export const fetchAllYearSalesInvoices = async () => {
//     const response = await requestMaking('invoices/year/sales', 'GET', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// };

// // Fetch invoice by ID
// export const fetchInvoiceById = async (id) => {
//     const response = await requestMaking(`invoices/${id}`, 'GET', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// };

// // Fetch ten invoice autocomplete
// export const fetchTenInvoices = async () => {
//     const response = await requestMaking(`invoices/ten`, 'GET', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// };

// // Fetch invoice autocomplete
// export const fetchAutocompleteId = async () => {
//     const response = await requestMaking(`invoices/number`, 'GET', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// };

// // Fetch Invoice details for Waybill
// export const FetchWaybillInvoice = async (id) => {
//     const response = await requestMaking(`invoices/waybill/${id}`, 'GET', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// }

// // Fetch Quotation Invoice details for Waybill
// export const fetchQuoteInvoices = async () => {
//     const response = await requestMaking(`invoices/quotes`, 'GET', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// }

// /* ------------    POST REQUEST     -------------------*/

// // post new invoice
// export const postNewInvoice = async (data) => {
//     const endpoint = data.invoiceType === "Proforma Invoice" ? "payload/quote" : "payload/invoice"; 
//     const response = await requestMaking(endpoint, 'POST', data);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// };

// // post gra new invoice
// export const postNewGRAInvoice = async (data) => {
//     const endpoint = data.invoiceType === "Proforma Invoice" ? "gra/quote" : "gra/invoice";
//     // try {
//         const response = await requestMaking(endpoint, 'POST', data);
//         return await response.json();
//     // } catch (error) {
//     //     return error;
//     // }
// };

// // post gra invoice callback 
// export const postGRAInvoiceCallback = async (data) => {
//     try {
//         const response = await requestMaking('gra/callback', 'POST', data);
//         return await response.json();
//     } catch (error) {
//         return null;
//     }
// };

// // Peform Refund cancellation
// export const postRefundCancellation = async (data) => {
//     const response = await requestMaking(`gra/refund/cancellation`, 'POST', data);
//     if (response.ok) {
//         return await response.json();
//     }
//     return response;
// };

// export const postWaybillData = async (payload) => {
//     try {
//         const response = await requestMaking('waybill', 'POST', payload);
//         return response.json();
//     } catch (error) {
//         return ({ status: 'error', message: error });
//     }
// }

// // Delete quotation based on invoice
// export const deleteQuotation = async (id) => {
//     const response = await requestMaking(`invoices/quote/del/${id}`, 'DELETE', null);
//     if (response.ok) {
//         return await response.json();
//     }
//     return null;
// };



/*--------------------------------------------------------------------------------------------------------------*/



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
    const endpoint = data.invoiceType === "Proforma Invoice" ? "payload/quote" : "payload/invoice";
    return await handleRequest(endpoint, 'POST', data);
};

// Post GRA new invoice
export const postNewGRAInvoice = async (data) => {
    const endpoint = data.invoiceType === "Proforma Invoice" ? "gra/quote" : "gra/invoice";
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
