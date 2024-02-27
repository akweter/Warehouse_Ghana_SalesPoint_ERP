// Modules
const Router = require("express").Router();
const { logAllMessage } = require("../utils/saveAllLogs");

// Get orders by ID
Router.get("/order/:id", async(req, res, next) => {
  try {
    const order = req.params.id;
    // const oneOrder = await getOneOrder(order);

    logAllMessage(`order number ${order} sent to frontend`);
    // res.status(200).json(oneOrder);
  }
  catch (err) {
    next(err);
  }
});
