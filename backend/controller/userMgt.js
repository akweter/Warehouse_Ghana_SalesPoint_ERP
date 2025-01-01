const { executeQuery } = require("../database/index");

/******************  GET REQUESTS  *********************/

// Return all users
const allUsers = async () => {
    const sql = `
  SELECT
    Usr_name As userName,
    Usr_FName As userFName,
    Usr_LName As userLName,
    Usr_type As accountType,
    Usr_phone As telephone,
    Usr_email As primaryEmail,
    Usr_address As regAddress,
    Usr_dept As orgDept,
    Usr_reg_date As regDate,
    Usr_dept As userDept,
    activated As userSubscribed,
    Usr_id As accountId,
    Usr_StaffID As staffID,
    Usr_status As accountStat
  FROM
    usermanagement
  ORDER BY 
    Usr_name 
  ASC`;
    return await executeQuery(sql);
};

// Return only active users
const allActiveUsers = async () => {
    const sql = `
        SELECT * 
        FROM 
            usermanagement 
        WHERE 
            Usr_status = 'active'
    `;
    return await executeQuery(sql);
};

// return selected user
const oneUser = async (id) => {
    const sql = `
    SELECT
      Usr_name As userName,
      Usr_FName As userFName,
      Usr_LName As userLName,
      Usr_type As accountType,
      Usr_phone As telephone,
      Usr_email As primaryEmail,
      Usr_address As regAddress,
      Usr_dept As orgDept,
      Usr_reg_date As regDate,
      Usr_dept As userDept,
      activated As userSubscribed,
      Usr_id As accountId,
      Usr_StaffID As staffID,
      Usr_status As accountStat
    FROM usermanagement 
    WHERE Usr_id = ?
  `;
    return await executeQuery(sql, id);
};

// Login | Return data only when username or email matches the password.
const adminUsers = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_type = 'admin'";
    return await executeQuery(sql);
};

// Accounts
const allAcounts = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_dept = 'accounts'";
    return await executeQuery(sql);
};

// Procurement
const procurementDept = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_dept = 'procurement'";
    return await executeQuery(sql);
};

// Sales Dept Users
const salesDept = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_dept = 'sales'";
    return await executeQuery(sql);
};

// Marketing Dept Users
const marketDept = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_dept = 'marketing'";
    return await executeQuery(sql);
};

// HR Dept Users
const hrDept = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_dept = 'hr'";
    return await executeQuery(sql);
};

// Legal Dept Users
const legalDept = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_dept = 'legal'";
    return await executeQuery(sql);
};

// Logistics Dept Users
const logisticsDept = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_dept = 'logistics'";
    return await executeQuery(sql);
};

// IT admin users
const itDept = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_dept = 'IT'";
    return await executeQuery(sql);
};

// All super admin Users
const allSuperAdminUsers = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_type = 'superAdmin'";
    return await executeQuery(sql);
};

// All default user
const allDefaultUsers = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_type = 'default'";
    return await executeQuery(sql);
};

// All intern users
const allInternUsers = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_type = 'intern'";
    return await executeQuery(sql);
};

// All guest Users
const allGuestUsers = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_type = 'guest'";
    return await executeQuery(sql);
};

// All CSM users
const allCSMUsers = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_type = 'CSM'";
    return await executeQuery(sql);
};

// All temporal
const allTemporalUsers = async () => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_type = 'temporal'";
    return await executeQuery(sql);
};

// Make a search to user name
const Search = async (prop) => {
    const sql = `
    SELECT 
      Usr_id, Usr_name, Usr_phone, Usr_email 
    FROM 
      usermanagement 
    WHERE 
      activated = 'yes' 
    AND (
      Usr_name LIKE ? 
    OR 
      Usr_phone LIKE ? 
    OR 
      Usr_email LIKE ?
    )`;
    return await executeQuery(sql, prop);
};

/********************   UPDATE REQUESTS   ****************************/

// Update user details
const updateUser = async (userData, userId) => {
    const sql = "UPDATE usermanagement SET ? WHERE Usr_id = ?";
    return await executeQuery(sql, [userData, userId]);
}

// Update user stats
const updateUserStatus = async (prop) => {
    const sql = "UPDATE usermanagement SET Usr_status = ? WHERE Usr_id = ?";
    return await executeQuery(sql, prop);
};

// Update user password
const updateUserPSD = async (data) => {
    const sql = `
        UPDATE 
            usermanagement 
        SET 
            passwd=?
        WHERE 
            Usr_id = ?`;
    return await executeQuery(sql, data);
};

/********************   POST REQUESTS   ****************************/

// Log user into the system
const loginUser = async (payload) => {
    const sql = `
        SELECT * FROM 
            usermanagement 
        WHERE 
            Usr_status = 'active' 
        AND 
            (BINARY Usr_email = BINARY ? OR BINARY Usr_name = BINARY ?)
    `;
    return await executeQuery(sql, payload);
};

// Query user onto the system
const signUpUser = async (email, username) => {
    const sql = "SELECT * FROM usermanagement WHERE Usr_email = ? OR Usr_name = ?";
    const values = [email, username];
    return await executeQuery(sql, values);
};

// Reset user password
const resetPassword = async (id) => {
    const sql = `
        UPDATE 
            usermanagement 
        SET 
            passwd='test', 
            activated = 'no' 
        WHERE 
            Usr_id=?`;
    return await executeQuery(sql, id);
}

// Add user onto the system
const AddNewUser = async (data) => {
    const sql = `
    INSERT IGNORE INTO 
      usermanagement (
        Usr_FName, 
        Usr_LName, 
        Usr_name, 
        Usr_type, 
        Usr_status, 
        Usr_phone, 
        Usr_email, 
        Usr_address, 
        Usr_dept, 
        Usr_reg_date, 
        passwd, 
        activated, 
        Usr_id
      ) VALUES (
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`;
    return await executeQuery(sql, data);
};

module.exports = {
    oneUser,
    allUsers,
    allActiveUsers,
    adminUsers,
    allAcounts,
    procurementDept,
    salesDept,
    hrDept,
    legalDept,
    logisticsDept,
    itDept,
    marketDept,
    allSuperAdminUsers,
    allDefaultUsers,
    allInternUsers,
    allGuestUsers,
    allCSMUsers,
    allTemporalUsers,
    loginUser,
    signUpUser,
    AddNewUser,
    Search,
    updateUserStatus,
    updateUserPSD,
    resetPassword,
    updateUser,
};
