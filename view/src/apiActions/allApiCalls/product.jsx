import requestMaking from "auth/setHeaderToken";

// Fetch all products
export const fetchAllProducts = async () => {
    const response = await requestMaking('products', 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch product name
export const fetchProductNameSearch = async (data) => {
    const response = await requestMaking(`products/query?query=${data}`, 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Add new products
export const PostNewProducts = async (payload) => {
    const response = await requestMaking('products/add', 'POST', payload);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Update product
export const UpdateProduct = async (id, payload) => {
    const response = await requestMaking(`products/${id}`, 'PUT', payload);
    if (response.ok) {
        return await response.json();
    }
    return null;
};
