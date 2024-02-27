import requestMaking from "auth/setHeaderToken";

// Fetch fetch all users
export const fetchAllUsers = async (data) => {
    const response = await requestMaking(`users`, 'GET', null)
    if (response.ok) {
        return await response.json();
    }
    return null;
};

// Update user status
export const updateUserStatus = async (id, action) => {
    const response = await requestMaking(`users/status/${id}`, 'put', action)
    console.log(response);
    if (response.ok) {
        return await response.json();
    }
    return null;
};
