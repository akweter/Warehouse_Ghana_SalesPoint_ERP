// Modules
const Router = require("express").Router();

// Projects
const { executeRoute } = require("../utils/handler");

// controller
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
const { logErrorMessages } = require("../utils/saveLogfile");

// Get all users
Router.get("/", async (req, res, next) => {
  const Cookie = res.cookie('authlevel', 'allurs', { expires: new Date(Date.now() + 900000), path: '/users' });
  try {
    const output = await allUsers();
    return await executeRoute(output, res, Cookie);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Temporal server error. Kindly refresh");
  }
});

// Get all Admins
Router.get("/admins", async (req, res, next) => {
  try {
    const output = await adminUsers();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// Get all active users
Router.get("/active", async (req, res, next) => {
  try {
    const output = await allActiveUsers();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// All from account departments
Router.get("/account", async (req, res, next) => {
  try {
    const output = await allAcounts();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// All from procurement departments
Router.get("/procurement", async (req, res, next) => {
  try {
    const output = await procurementDept();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// All from sales departments
Router.get("/sales", async (req, res, next) => {
  try {
    const output = await salesDept();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// All from Human Resource departments
Router.get("/hr", async (req, res, next) => {
  try {
    const output = await hrDept();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// All from legal departments
Router.get("/legal", async (req, res, next) => {
  try {
    const output = await legalDept();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// All from logistics departments
Router.get("/logistic", async (req, res, next) => {
  try {
    const output = await logisticsDept();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// All from IT & System Admin departments
Router.get("/IT", async (req, res, next) => {
  try {
    const output = await itDept();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// All from marketing & branding departments
Router.get("/market", async (req, res, next) => {
  try {
    const output = await marketDept();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// All Super Admin Users
Router.get("/superadmin", async (req, res, next) => {
  try {
    const output = await allSuperAdminUsers();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// All Default Users
Router.get("/default", async (req, res, next) => {
  try {
    const output = await allDefaultUsers();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// All Internal Users
Router.get("/internal", async (req, res, next) => {
  try {
    const output = await allInternUsers();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// All Guests Users
Router.get("/guest", async (req, res, next) => {
  try {
    const output = await allGuestUsers();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// Users from Customer Service Department
Router.get("/csm", async (req, res, next) => {
  try {
    const output = await allCSMUsers();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// Users from Customer Service Department
Router.get("/temporal", async (req, res, next) => {
  const Header = res.setHeader("Content-Type", "application/json");
  try {
    const output = await allTemporalUsers();
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// Make a search
Router.get("/search", async (req, res, next) => {
  const { search } = req.body;
  const searchTerm = '%' + search + '%';
  const Value = [searchTerm, searchTerm, searchTerm];
  try {
    const output = await Search(Value);
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// Get user information based on the ID
Router.get("/:id", async (req, res, next) => {
  const userID = req.params.id;
  try {
    const output = await oneUser(userID);
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
  }
});

// Get user information based on the ID to reset password
Router.get("/activate/:id", async (req, res, next) => {
  const userID = req.params.id;
  try {
    const output = await oneUser(userID);
    return executeRoute(output, res);
  }
  catch (err) {
    logErrorMessages("Internal server error" + err);
    return res.status(500).send("Internal server error");
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
    logErrorMessages("Internal server error" + err);
    return res.status(500).json({ message: `Failed to update ${username}` });
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
    logErrorMessages("Internal server error" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = Router;
