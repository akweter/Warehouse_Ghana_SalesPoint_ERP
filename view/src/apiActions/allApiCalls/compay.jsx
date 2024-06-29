import requestMaking from "../../auth/setHeaderToken";

// Fetch all company info
export const fetchCompanyData = async () => {
    const response = await requestMaking(`company`, 'GET', null)
    if (response.ok) {
        return await response.json();
    }
    return null;
};
