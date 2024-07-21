import axios from "axios";
import { WC_ED_KEY, WC_ED_SECRET, WC_KEY, WC_SECRET, wc_endPoint } from "../../auth/origins";

const config = (method, payload) => {
    const baseConfig = {
        headers: { Accept: "application/json" }
    };

    if (method !== 'GET') {
        baseConfig.auth = { username: WC_ED_KEY , password: WC_ED_SECRET };
    } else {
        baseConfig.auth = { username: WC_KEY, password: WC_SECRET };
    }
    if (payload) { baseConfig.data = payload }

    return baseConfig;
};

const MakeWooRequest = async (method, path, payload) => {
    try {
        const response = await axios({
            method: method.toUpperCase(),
            url: `${wc_endPoint}/${path}`,
            ...config(method, payload)
        });

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

/*==================================================    GET REQUESTS    ====================================================*/

/* ORDERS */

// Fetch all orders
export const fetchAllWooOrders = async () => {
    return await MakeWooRequest("GET", "orders?per_page=100");
};

// Fetch completed orders
export const fetchWooCompletedOrders = async () => {
    return await MakeWooRequest("GET", "orders?status=completed");
};

// Fetch pending orders
export const fetchWooPendingOrders = async () => {
    return await MakeWooRequest("GET", "orders?status=pending");
};

// Fetch failed orders
export const fetchWooFailedOrders = async () => {
    return await MakeWooRequest("GET", "orders?status=failed");
};

// Search term/query
export const FetchWooSearchOrder = async (input) => {
    const queryTerm = `orders?search=${input}&context=edit`;
    return await MakeWooRequest("GET", queryTerm);
};


/* CUSTOMERS */

// Fetch all customers
export const fetchAllWooCustomers = async () => {
    return await MakeWooRequest("GET", "customers?per_page=100");
};

// Search term/query
export const FetchWooSearchCustomer = async (input) => {
    const queryTerm = `customers?search=${input}&context=edit`;
    return await MakeWooRequest("GET", queryTerm);
};


/* PRODUCTS */

// Fetch all products
export const fetchAllWooProducts = async () => {
    return await MakeWooRequest("GET", "products?per_page=100&orderby=title&order=asc");
};

// Search term/query
export const FetchWooSearchProduct = async (input) => {
    const queryTerm = `products?search=${input}&context=edit`;
    if (queryTerm.ok) {
        return await MakeWooRequest("GET", queryTerm);
    }
    return null;
};

/*==================================================    PUT REQUEST    ====================================================*/

/* Update A Product */
export const updateWooProducts = async (id, payload) => {
    return await MakeWooRequest("PUT", `products/${id}`, payload);
};
