const { executeQuery } = require("../database/index");

/******************  GET REQUESTS  *********************/

// Return all users
const allUsers = async () => {
  const sql = "SELECT * FROM UserManagement";
  return executeQuery(sql);
};

// Return only active users
const allActiveUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_status = 'active'";
  return executeQuery(sql);
};

// return selected user
const oneUser = async (id) => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_id = ?";
  return executeQuery(sql, id);
};

// Login | Return data only when username or email matches the password.
const adminUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_type = 'admin'";
  return executeQuery(sql);
};

// Accounts
const allAcounts = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'accounts'";
  return executeQuery(sql);
};

// Procurement
const procurementDept = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'procurement'";
  return executeQuery(sql);
};

// Sales Dept Users
const salesDept = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'sales'";
  return executeQuery(sql);
};

// Marketing Dept Users
const marketDept = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'marketing'";
  return executeQuery(sql);
};

// HR Dept Users
const hrDept = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'hr'";
  return executeQuery(sql);
};

// Legal Dept Users
const legalDept = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'legal'";
  return executeQuery(sql);
};

// Logistics Dept Users
const logisticsDept = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'logistics'";
  return executeQuery(sql);
};

// IT admin users
const itDept = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_dept = 'IT'";
  return executeQuery(sql);
};

// All super admin Users
const allSuperAdminUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_type = 'superAdmin'";
  return executeQuery(sql);
};

// All default user
const allDefaultUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_type = 'default'";
  return executeQuery(sql);
};

// All intern users
const allInternUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_type = 'intern'";
  return executeQuery(sql);
};

// All guest Users
const allGuestUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_type = 'guest'";
  return executeQuery(sql);
};

// All CSM users
const allCSMUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_type = 'CSM'";
  return executeQuery(sql);
};

// All temporal
const allTemporalUsers = async () => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_type = 'temporal'";
  return executeQuery(sql);
};

// Make search
const Search = async (prop) => {
  const sql = "SELECT Usr_id, Usr_name, Usr_phone, Usr_email FROM UserManagement WHERE activated = 'yes' AND (Usr_name LIKE ? OR Usr_phone LIKE ? OR Usr_email LIKE ?);";
  return executeQuery(sql, prop);
};


/********************   UPDATE REQUESTS   ****************************/

const updateUserStatus = async (action, id) => {
  const sql = "UPDATE usermanagement SET Usr_status = ? WHERE Usr_id = ?";
  return executeQuery(sql, [action, id]);
};


/********************   POST REQUESTS   ****************************/

// Log user into the system
const loginUser = async (payload) => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_status = 'active' AND (Usr_email = ? OR Usr_name = ?)";
  return await executeQuery(sql, payload);
};

// Query user onto the system
const signUpUser = async (email, username) => {
  const sql = "SELECT * FROM UserManagement WHERE Usr_email = ? OR Usr_name = ?";
  const values = [email, username];
  return executeQuery(sql, values);
};

// Add user onto the system
const AddNewUser = async (data) => {
  const sql = "INSERT INTO UserManagement (Usr_FName, Usr_LName, Usr_name, Usr_type, Usr_status, Usr_phone, Usr_email, Usr_address, Usr_dept, Usr_reg_date, passwd, activated, Usr_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return executeQuery(sql, data);
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
};

module.exports = allActions;
