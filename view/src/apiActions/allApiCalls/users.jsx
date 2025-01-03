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

// Fetch fetch all users
export const fetchAllUsers = async () => {
    return await handleRequest(`users`, 'GET');
};

// Fetch specific user data
export const fetchuserByID = async (id) => {
    return await handleRequest(`users/${id}`, 'get');
};

// Fetch specific user data and set password
export const fetchuserByIDPsd = async (id) => {
    return await handleRequest(`users/${id}`, 'get');
};

// Log out from system
export const UserLogOut = async () => {
    return await handleRequest(`auth/logout`, 'get', );
};

/* ======================================================================================================== */

// Update user details
export const updateUserDetails = async (id, data) => {
    return await handleRequest(`users/${id}`, 'put', data);
};

// Update user status
export const updateUserStatus = async (id, data) => {
    return await handleRequest(`users/status/${id}`, 'put', data);
};

// Update user password
export const updateUserPSD = async (id, data) => {
    return await handleRequest(`auth/psd/${id}`, 'put', data);
};

/* ======================================================================================================== */

// Send Email to user
export const sendEmailToUser = async (user) => {
    return await handleRequest(`auth/sendemail`, 'post', user);
};

// Add New User
export const postNewUser = async (user) => {
    return await handleRequest(`auth/signup`, 'post', user);
};

