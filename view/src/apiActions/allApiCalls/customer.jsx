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

// Fetch all company info
export const fetchCompanyData = async () => {
    return await handleRequest(`company`, 'GET');
};


// Fetch all customers
export const fetchAllCustomersNSuppliers = async () => {
    return await handleRequest('customers/customersnsuppliers', 'GET');
};

// Fetch all customers
export const fetchAllCustomers = async () => {
    return await handleRequest('customers', 'GET');
};

// Fetch a customer name
export const fetchCustomerNameSearch = async (data) => {
    return await handleRequest(`customers/query?search=${data}`, 'GET');
};

// Post a customer or supplier
export const postCustomerSupplier = async (data) => {
    return await handleRequest(`customers/add/new`, 'POST', data);
};

// Update supplier or customer details
export const updateSupplierCustomer = async (id, data) => {
    return await handleRequest(`customers/update/${id}`, 'put', data);
};
