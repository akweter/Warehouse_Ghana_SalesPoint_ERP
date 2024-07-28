var router = require("express").Router();

router.get("/", (req, res, next)=> {
  res.send("Silence Is Golden \n\nBecareful what you're doing!");
});

module.exports = router;
