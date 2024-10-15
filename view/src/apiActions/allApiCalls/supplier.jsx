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

// Fetch all supliers name
export const fetchAllSupplier = async () => {
    return await handleRequest(`suppliers`, 'GET');
};

// Fetch all local suppliers
export const fetchAllLocalSuppliers = async () => {
    return await handleRequest(`suppliers/locals`, 'GET');
};

// Fetch all foreign supliers
export const fetchAllForeignSuppliers = async () => {
    return await handleRequest(`suppliers/foreigns`, 'GET');
};

// Fetch customer name
export const fetchSupplierNameSearch = async (data) => {
    return await handleRequest(`suppliers/query?search=${data}`, 'GET');
};

// Post a supplier
export const postSupplier = async (data) => {
    return await handleRequest(`suppliers/add/new`, 'POST', data);
};

// Update supplier
export const updateSupplier = async (id, data) => {
    return await handleRequest(`suppliers/update/${id}`, 'put', data);
};
