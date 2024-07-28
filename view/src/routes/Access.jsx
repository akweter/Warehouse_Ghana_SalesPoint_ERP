// Only Super Admin
export const SuperAdmin = (accountType) => {
    return accountType === 'superAdmin';
};

// Only Super Admin and admin
export const SuperAdminAndAdmin = (accountType) => {
    if (['superAdmin', 'admin'].includes(accountType)) {
        return true;
    }
};

// All staffs except temporal, guest and intern staff
export const ExeptTemporalInternAndGuest = (accountType) => {
    if (['superAdmin', 'admin', 'default', 'CSM'].includes(accountType)) {
        return true;
    }
};
