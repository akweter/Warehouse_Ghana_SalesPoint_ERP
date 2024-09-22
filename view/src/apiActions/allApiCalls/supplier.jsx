import requestMaking from "../../auth/setHeaderToken";

// Fetch all supliers name
export const fetchAllSupplier = async () => {
    const response = await requestMaking(`suppliers`, 'GET', null)
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all local suppliers
export const fetchAllLocalSuppliers = async () => {
    const response = await requestMaking(`suppliers/locals`, 'GET', null)
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all foreign supliers
export const fetchAllForeignSuppliers = async () => {
    const response = await requestMaking(`suppliers/foreigns`, 'GET', null)
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch customer name
export const fetchSupplierNameSearch = async (data) => {
    const response = await requestMaking(`suppliers/query?search=${data}`, 'GET', null)
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Post a supplier
export const postSupplier = async (data) => {
    await requestMaking(`suppliers/add/new`, 'POST', data)
    .then( async (res) => {
        return await res.json();
    })
    .catch(() => {
        return null;
    });
};

// Update supplier
export const updateSupplier = async (id, data) => {
    const response = await requestMaking(`suppliers/update/${id}`, 'put', data);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

