import requestMaking from "auth/setHeaderToken";

// Fetch fetch all users
export const fetchAllUsers = async () => {
    const response = await requestMaking(`users`, 'GET', null)
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Fetch specific user data
export const fetchuserByID = async (id) => {
    const response = await requestMaking(`users/${id}`, 'get', null);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Update user status
export const updateUserStatus = async (id, action) => {
    const response = await requestMaking(`users/status/${id}`, 'put', action);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Update user password
export const updateUserPSD = async (id, data) => {
    const response = await requestMaking(`auth/psd/${id}`, 'put', data);
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Send Email to user
export const sendEmailToUser = async (user) => {
    const response = await requestMaking(`auth/sendemail`, 'post', user);
    if (response.ok) {
        return await response.json();
    }
    return null;
};
