import requestMaking from "auth/setHeaderToken";

// Fetch all customers
export const fetchAllCustomersNSuppliers = async () => {
    const response = await requestMaking('customers/customersnsuppliers', 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch all customers
export const fetchAllCustomers = async () => {
    const response = await requestMaking('customers', 'GET', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch a customer name
export const fetchCustomerNameSearch = async (data) => {
    const response = await requestMaking(`customers/query?search=${data}`, 'GET', null)
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Post a customer or supplier
export const postCustomerSupplier = async (data) => {
    await requestMaking(`customers/addsnc`, 'POST', data)
    .then( async (res) => {
        return await res.json();
    })
    .catch(() => {
        return null;
    });
};
