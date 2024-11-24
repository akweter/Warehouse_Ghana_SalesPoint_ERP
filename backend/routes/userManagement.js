// Modules
const Router = require("express").Router();

// Projects
const { logErrorMessages } = require("../utils/saveLogfile");
const {
  oneUser,
  allUsers,
  adminUsers,
  allActiveUsers,
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
  Search,
  updateUserStatus,
  updateUser,
} = require("../controller/userMgt");

// Get all users
Router.get("/", async (req, res, next) => {
  try {
    const output = await allUsers();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });;
  }
});

// Get all Admins
Router.get("/admins", async (req, res, next) => {
  try {
    const output = await adminUsers();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// Get all active users
Router.get("/active", async (req, res, next) => {
  try {
    const output = await allActiveUsers();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// All from account departments
Router.get("/account", async (req, res, next) => {
  try {
    const output = await allAcounts();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// All from procurement departments
Router.get("/procurement", async (req, res, next) => {
  try {
    const output = await procurementDept();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// All from sales departments
Router.get("/sales", async (req, res, next) => {
  try {
    const output = await salesDept();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// All from Human Resource departments
Router.get("/hr", async (req, res, next) => {
  try {
    const output = await hrDept();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// All from legal departments
Router.get("/legal", async (req, res, next) => {
  try {
    const output = await legalDept();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// All from logistics departments
Router.get("/logistic", async (req, res, next) => {
  try {
    const output = await logisticsDept();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// All from IT & System Admin departments
Router.get("/IT", async (req, res, next) => {
  try {
    const output = await itDept();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// All from marketing & branding departments
Router.get("/market", async (req, res, next) => {
  try {
    const output = await marketDept();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// All Super Admin Users
Router.get("/superadmin", async (req, res, next) => {
  try {
    const output = await allSuperAdminUsers();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// All Default Users
Router.get("/default", async (req, res, next) => {
  try {
    const output = await allDefaultUsers();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// All Internal Users
Router.get("/internal", async (req, res, next) => {
  try {
    const output = await allInternUsers();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// All Guests Users
Router.get("/guest", async (req, res, next) => {
  try {
    const output = await allGuestUsers();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// Users from Customer Service Department
Router.get("/csm", async (req, res, next) => {
  try {
    const output = await allCSMUsers();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// Users from Customer Service Department
Router.get("/temporal", async (req, res, next) => {
  const Header = res.setHeader("Content-Type", "application/json");
  try {
    const output = await allTemporalUsers();
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// Make a search
Router.get("/search", async (req, res, next) => {
  const { search } = req.body;
  const searchTerm = '%' + search + '%';
  const Value = [searchTerm, searchTerm, searchTerm];
  try {
    const output = await Search(Value);
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// Get user information based on the ID
Router.get("/:id", async (req, res, next) => {
  const userID = req.params.id;
  try {
    const output = await oneUser(userID);
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});

// Get user information based on the ID to reset password
Router.get("/activate/:id", async (req, res, next) => {
  const userID = req.params.id;
  try {
    const output = await oneUser(userID);
    res.status(200).json(output);
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ status: 'error', message: 'something went bad' });
  }
});


/*********      UPDATE REQUESTS        *********/

// Update user
Router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    fname,
    lname,
    username,
    userPhone,
    userType,
    userDept,
    staffID,
    address,
  } = req.body;

  const userData = {
    Usr_FName: fname,
    Usr_LName: lname,
    Usr_name: username,
    Usr_phone: userPhone,
    Usr_type: userType,
    Usr_dept: userDept,
    Usr_StaffID: staffID,
    Usr_address: address
  };

  try {
    const output = await updateUser(userData, id);
    return res.status(200).json({ message: "success" });
  }
  catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ message: `Failed to update ${username}` });
  }
});

// Update user status
Router.put("/status/:id", async (req, res) => {
  const { id } = req.params;
  const { Usr_status } = req.body;
  const userStat = Usr_status === 'active' ? 'inactive' : 'active';
  const data = [userStat, id];
  try {
    const output = await updateUserStatus(data);
    return res.status(200).json({ message: "success" });
  } catch (err) {
    logErrorMessages(err, req.headers.keyid);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = Router;
