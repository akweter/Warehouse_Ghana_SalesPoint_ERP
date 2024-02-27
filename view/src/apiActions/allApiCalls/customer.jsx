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

// Fetch customer name
export const fetchCustomerNameSearch = async (data) => {
    const response = await requestMaking(`customers/query?search=${data}`, 'GET', null)
    if (response.ok) {
        return await response.json();
    }
    return null;
};
