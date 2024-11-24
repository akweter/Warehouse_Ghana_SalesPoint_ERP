const { logAllMessage } = require("../utils/saveLogfile");

// Modules
const Router = require("express").Router();

// Get orders by ID
Router.get("/order/:id", async(req, res, next) => {
  try {
    const order = req.params.id;
    // const oneOrder = await getOneOrder(order);

    logAllMessage(`order number ${order} sent to frontend`, req.headers.keyid);
    // res.status(200).json(oneOrder);
  }
  catch (err) {
    next(err);
  }
});
