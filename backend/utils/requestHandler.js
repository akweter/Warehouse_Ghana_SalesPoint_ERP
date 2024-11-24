
const executeRoute = (output, res) => {
  if (output.length === 0) {
    return res.status(404).json({status: "error", message :"No records found" });
  }
  return res.status(200).json(output);
};

const OUT = {
  executeRoute,
};
module.exports = OUT;
 