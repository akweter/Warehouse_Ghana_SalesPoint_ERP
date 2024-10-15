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

// Fetch all products
export const fetchAllProducts = async () => {
    return await handleRequest('products', 'GET');
};

// Fetch product name
export const fetchProductNameSearch = async (data) => {
    return await handleRequest(`products/query?query=${data}`, 'GET');
};

// Fetch dashboard card product details
export const fetchDashboardCardDetails = async () => {
    return await handleRequest(`products/dashboard/card`, 'GET');
};

// Add new products
export const PostNewProducts = async (payload) => {
    return await handleRequest('products/add', 'POST', payload);
};

// Update product
export const UpdateProduct = async (id, payload) => {
    return await handleRequest(`products/${id}`, 'PUT', payload);
};
