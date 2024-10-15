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

// Fetch all company info
export const fetchCompanyData = async () => {
    return await handleRequest(`company`, 'GET');
};
