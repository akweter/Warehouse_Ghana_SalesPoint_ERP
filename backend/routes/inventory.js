// Modules
const Router = require("express").Router();

// Projects
const { executeRoute } = require("../utils/handler");

// controller
const {
	allProducts,
	oneProduct,
	taxOnProduct,
	addedUser,
	productSupplier,
	dateAdded,
	searchProduct,
	Exempt,
	searchOnlyProduct,
	oneProductAutoIncrement,
	addExcelProducts,
} = require("../controller/Inventory");
const { logAllMessage } = require("../utils/saveAllLogs");
const { logSuccessMessages, logErrorMessages, logMessage } = require("../utils/saveLogfile");
const generateUUID = require("../utils/generateIDs");

// all products
Router.get("/", async (req, res, next) => {
	try {
		const output = await allProducts();
		return await executeRoute(output, res);
	}
	catch (err) {
		logAllMessage("Internal server error" + err);
		return res.status(500).send("Temporal server error. Kindly refresh");
	}
});

// Search product names
Router.get("/query", async (req, res, next) => {
	const result = req.query.query;
	const query = '%' + result + '%'
	try {
		const output = await searchOnlyProduct(query);
		return await executeRoute(output, res);
	}
	catch (err) {
		logAllMessage("error searching products" + err);
		return res.status(500).send("Temporal server error. Kindly refresh");
	}
});

// user who added the product
Router.get("/user", async (req, res, next) => {
	const stat = req.body.user;
	try {
		const output = await addedUser(stat);
		return await executeRoute(output, res);
	}
	catch (err) {
		logAllMessage("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});

// product supplier
Router.get("/supplier", async (req, res, next) => {
	const stat = req.body.supplier;
	try {
		const output = await productSupplier(stat);
		return await executeRoute(output, res);
	}
	catch (err) {
		logAllMessage("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});

// Exempted products
Router.get("/taxable", async (req, res, next) => {
	const stat = req.body.taxable;
	try {
		const output = await Exempt(stat);
		return await executeRoute(output, res);
	}
	catch (err) {
		logAllMessage("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});

// Date Range
Router.get("/date", async (req, res, next) => {
	const { date1, date2 } = req.body;
	if (date1 === null || date1 === '') {
		return date2 = date1;
	}
	const payload = [date1, date2];
	try {
		const output = await dateAdded(payload);
		return await executeRoute(output, res);
	}
	catch (err) {
		logAllMessage("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});

// All Searches
Router.get("/search", async (req, res, next) => {
	const { search } = req.body;
	const searchTerm = '%' + search + '%';
	const Value = [searchTerm, searchTerm, searchTerm];
	try {
		const output = await searchProduct(Value);
		return await executeRoute(output, res);
	}
	catch (err) {
		logAllMessage("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});

// Get single product information based on the product auto increment
Router.get("/alt/:id", async (req, res, next) => {
	const PID = req.params.id;
	try {
		const output = await oneProductAutoIncrement(PID);
		return await executeRoute(output, res);
	}
	catch (err) {
		logAllMessage("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});

// Get single product information based on the product ID
Router.get("/:id", async (req, res, next) => {
	const PID = req.params.id;
	try {
		const output = await oneProduct(PID);
		return await executeRoute(output, res);
	}
	catch (err) {
		logAllMessage("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});


/**************  POST REQUEST  ******************/
Router.post("/add", (req, res, next) => {
	const Data = req.body;
	Data.map( async (e) => {
		
		const {
			productCategory,
			productName,
			productStatus,
			productStockQty,
			productUnitPrice,
			productSupId,
			productUserId,
			productTaxType,
			productAddDate,
			productUOM,
		} = e;
			
		const Payload = [
			0,
			productCategory,
			productName,
			productStatus,
			"",
			productStockQty,
			productUnitPrice,
			productSupId,
			productUserId,
			productTaxType,
			productAddDate,
			generateUUID(),
			productUOM,
		];

		try {
			await addExcelProducts(Payload);
			logSuccessMessages(`Products added succesfully`);
			res.status(200).json({ status: "success", message: `Products added succesfully` });
		}
		catch (error) {
			logErrorMessages(`Error adding excel product: ${JSON.stringify(err)}`);
			res.json({ status: "error", message: `Adding products failed` })
		}
	})
});

module.exports = Router;
