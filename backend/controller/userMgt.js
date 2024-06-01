const { executeQuery } = require("../database/index");

/******************  GET REQUESTS  *********************/

// Return all users
const allUsers = async () => {
  const sql = "SELECT * FROM UserManagement ORDER BY Usr_name ASC";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Return only active users
const allActiveUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_status = 'active'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// return selected user
const oneUser = async (id) => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_id = ?";
  try {
    const result = await executeQuery(sql, id);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Login | Return data only when username or email matches the password.
const adminUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_type = 'admin'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Accounts
const allAcounts = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'accounts'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Procurement
const procurementDept = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'procurement'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Sales Dept Users
const salesDept = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'sales'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Marketing Dept Users
const marketDept = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'marketing'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// HR Dept Users
const hrDept = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'hr'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Legal Dept Users
const legalDept = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'legal'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Logistics Dept Users
const logisticsDept = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'logistics'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// IT admin users
const itDept = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'IT'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// All super admin Users
const allSuperAdminUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_type = 'superAdmin'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// All default user
const allDefaultUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_type = 'default'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// All intern users
const allInternUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_type = 'intern'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// All guest Users
const allGuestUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_type = 'guest'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// All CSM users
const allCSMUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_type = 'CSM'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// All temporal
const allTemporalUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_type = 'temporal'";
  try {
    const result = await executeQuery(sql);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Make search
const Search = async (prop) => {
  const sql = "SELECT Usr_id, Usr_name, Usr_phone, Usr_email FROM UserManagement WHERE activated = 'yes' AND (Usr_name LIKE ? OR Usr_phone LIKE ? OR Usr_email LIKE ?);";
  try {
    const result = await executeQuery(sql, prop);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

/********************   UPDATE REQUESTS   ****************************/

// Update user details
const updateUser = async (userData, userId) => {
  const sql = "UPDATE usermanagement SET ? WHERE Usr_id = ?";
  try {
    const result = await executeQuery(sql, [userData, userId]);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
}

// Update user stats
const updateUserStatus = async (prop) => {
  const sql = "UPDATE usermanagement SET Usr_status = ? WHERE Usr_id = ?";
  try {
    const result = await executeQuery(sql, prop);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Update user password
const updateUserPSD = async (data) => {
  const sql = "UPDATE usermanagement SET passwd=? WHERE Usr_id = ?";
  try {
    const result = await executeQuery(sql, data);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

/********************   POST REQUESTS   ****************************/

// Log user into the system
const loginUser = async (payload) => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_status = 'active' AND (Usr_email = ? OR Usr_name = ?)";
  try {
    const result = await executeQuery(sql, payload);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Query user onto the system
const signUpUser = async (email, username) => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_email = ? OR Usr_name = ?";
  const values = [email, username];
  try {
    const result = await executeQuery(sql, values);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

// Reset user password
const resetPassword = async (id) => {
  const sql = `UPDATE usermanagement SET passwd='test', activated='no' WHERE Usr_id=?`;
  try {
    const result = await executeQuery(sql, id);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
}

// Add user onto the system
const AddNewUser = async (data) => {
  const sql = "INSERT INTO UserManagement (Usr_FName, Usr_LName, Usr_name, Usr_type, Usr_status, Usr_phone, Usr_email, Usr_address, Usr_dept, Usr_reg_date, passwd, activated, Usr_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  try {
    const result = await executeQuery(sql, data);
    if (result) { return result }
  }
  catch (error) {
    return error;
  }
};

const allActions = {
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

module.exports = allActions;
