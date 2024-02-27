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
export const PostNewProducts = async (data) => {
    const response = await requestMaking('products/add', 'POST', data);
    if (response.ok) {
        return await response.json();
    }
    return null;
};
