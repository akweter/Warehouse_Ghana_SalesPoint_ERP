// Modules
const Router = require("express").Router();

// Projects
const { executeRoute } = require("../utils/handler");

// controller
const {
	allProducts,
	oneProduct,
	addedUser,
	productSupplier,
	dateAdded,
	searchProduct,
	Exempt,
	searchOnlyProduct,
	oneProductAutoIncrement,
	addExcelProducts,
	updateProduct,
	sumAllProducts,
	allOutOfStockProducts,
	allLowProducts,
	allTopProducts,
	noStockProducts,
} = require("../controller/Inventory");
const { logSuccessMessages, logErrorMessages } = require("../utils/saveLogfile");
const generateUUID = require("../utils/generateIDs");

// all products
Router.get("/", async (req, res) => {
	try {
		const output = await allProducts();
		return res.status(200).json(output);
	}
	catch (err) {
		logErrorMessages("Internal server error" + err);
		return res.status(500).send("Temporal server error. Kindly refresh");
	}
});

// Dashboard Cards
Router.get("/dashboard/card", async (req, res) => {
	try {
		const sum = await sumAllProducts();
		const outOfStock = await allOutOfStockProducts();
		const lowProduct = await allLowProducts();
		const topProducts = await allTopProducts();
		const noStock = await noStockProducts();

		const result = [
			sum,
			outOfStock,
			lowProduct,
			topProducts,
			noStock,
		]
		res.status(200).send(result);
	}
	catch (err) {
		logErrorMessages("Inventory fetch error" + err);
		res.status(500).send("Something unexpected happened!");
	}
});

// Search product names
Router.get("/query", async (req, res) => {
	const result = req.query.query;
	const query = '%' + result + '%'
	try {
		const output = await searchOnlyProduct(query);
		return res.status(200).json(output);
	}
	catch (err) {
		logErrorMessages("error searching products" + err);
		return res.status(500).send("Temporal server error. Kindly refresh");
	}
});

// user who added the product
Router.get("/user", async (req, res) => {
	const stat = req.body.user;
	try {
		const output = await addedUser(stat);
		return res.status(200).json(output);
	}
	catch (err) {
		logErrorMessages("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});

// product supplier
Router.get("/supplier", async (req, res) => {
	const stat = req.body.supplier;
	try {
		const output = await productSupplier(stat);
		return res.status(200).json(output);
	}
	catch (err) {
		logErrorMessages("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});

// Exempted products
Router.get("/taxable", async (req, res) => {
	const stat = req.body.taxable;
	try {
		const output = await Exempt(stat);
		return res.status(200).json(output);
	}
	catch (err) {
		logErrorMessages("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});

// Date Range
Router.get("/date", async (req, res) => {
	const { date1, date2 } = req.body;
	if (date1 === null || date1 === '') {
		return date2 = date1;
	}
	const payload = [date1, date2];
	try {
		const output = await dateAdded(payload);
		return res.status(200).json(output);
	}
	catch (err) {
		logErrorMessages("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});

// All Searches
Router.get("/search", async (req, res) => {
	const { search } = req.body;
	const searchTerm = '%' + search + '%';
	const Value = [searchTerm, searchTerm, searchTerm];
	try {
		const output = await searchProduct(Value);
		return res.status(200).json(output);
	}
	catch (err) {
		logErrorMessages("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});

// Get single product information based on the product auto increment
Router.get("/alt/:id", async (req, res) => {
	const PID = req.params.id;
	try {
		const output = await oneProductAutoIncrement(PID);
		return res.status(200).json(output);
	}
	catch (err) {
		logErrorMessages("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});

// Get single product information based on the product ID
Router.get("/:id", async (req, res) => {
	const PID = req.params.id;
	try {
		const output = await oneProduct(PID);
		return res.status(200).json(output);
	}
	catch (err) {
		logErrorMessages("Internal server error" + err);
		return res.status(500).send("Internal server error");
	}
});


/**************  POST REQUEST  ******************/
Router.post("/add", (req, res) => {
	const Data = req.body;
	Data.map(async (e) => {

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
			logSuccessMessages(`Product: ${productName} added succesfully`);
			res.status(200).json({ status: "success", message: `Products added succesfully` });
		}
		catch (error) {
			logErrorMessages(`Error adding excel product: ${JSON.stringify(err)}`);
			res.json({ status: "error", message: `Adding products failed` })
		}
	})
});


/**************** UPDATE REQUEST ************************** */
// Update product
Router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const {
		productCategory,
		productName,
		productStatus,
		productStockQty,
		productUnitPrice,
		productSupId,
		productTaxType,
		productUOM,
	} = req.body[0];

	const payload = {
		Itm_cat: productCategory,
		Itm_name: productName,
		Itm_status: productStatus,
		Itm_qty: productStockQty,
		Itm_price: productUnitPrice,
		Itm_sup_id: productSupId,
		Itm_taxable: productTaxType,
		Itm_UOM: productUOM,
	};
	
	try {
		await updateProduct(payload, id);
		logSuccessMessages(`Product: ${productName} updated succesfully`);
		res.status(200).json({ status: "success", message: `Product updated succesfully` });
	}
	catch (err) {
		logErrorMessages("Internal server error" + err);
		return res.status(500).json({ status: 'error', message: `Failed to update ${productName}` });
	}
});

module.exports = Router;
