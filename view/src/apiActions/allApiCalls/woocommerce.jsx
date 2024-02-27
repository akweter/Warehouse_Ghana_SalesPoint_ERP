import axios from "axios";
import { WC_KEY, WC_SECRET, wc_endPoint } from "auth/origins";

const FetchWooData = async (path) => {
    try {
        const response = await axios.get(`${wc_endPoint}/${path}`, {
            auth: {
                username: WC_KEY,
                password: WC_SECRET,
            },
            headers: {
                Accept: "application/json",
            },
        });
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }
        else {
            console.error(`Request failed with status ${response.status}`);
            return null;
        }
    }
    catch (error) {
        console.error("Error:", error.message);
        return null;
    }
};


// ***********************************************************************************************************
/* ORDERS */

// Fetch all orders
export const fetchAllWooOrders = async () => {
    return await FetchWooData("orders?per_page=100");
};

// Fetch completed orders
export const fetchWooCompletedOrders = async () => {
    return await FetchWooData("orders?status=completed");
};

// Fetch pending orders
export const fetchWooPendingOrders = async () => {
    return await FetchWooData("orders?status=pending");
};

// Fetch failed orders
export const fetchWooFailedOrders = async () => {
    return await FetchWooData("orders?status=failed");
};

// Search term/query
export const FetchWooSearchOrder = async (input) => {
    const queryTerm = `orders?search=${input}&context=edit`;
    return await FetchWooData(queryTerm);
};

// ***********************************************************************************************************
/* CUSTOMERS */

// Fetch all customers
export const fetchAllWooCustomers = async () => {
    return await FetchWooData("customers?per_page=100");
};

// Search term/query
export const FetchWooSearchCustomer = async (input) => {
    const queryTerm = `customers?search=${input}&context=edit`;
    return await FetchWooData(queryTerm);
};

// **********************************************************************************************************
/* PRODUCTS */

// Fetch all products
export const fetchAllWooProducts = async () => {
    return await FetchWooData("products?per_page=100&orderby=title&order=asc");
};

// Search term/query
export const FetchWooSearchProduct = async (input) => {
    const queryTerm = `products?search=${input}&context=edit`;
    return await FetchWooData(queryTerm);
};


// *********************************************************************************************************
