const express = require ("express");
const router = express.Router();
const productController = require("../controllers/productControllers");
const auth = require("../auth");

// [ADD PRODUCT: START]

router.post("/addProduct", auth.verify, (req,res) => {

	const data = {
		product: req.body,
		isAdmin: auth.decode(req.headers.authorization).isAdmin
	};

	productController.addProduct(data).then(resultFromController => res.send(resultFromController));
});

// [ADD PRODUCT: END]

/*******************************************************************************/

// [UPDATE PRODUCT: START]

router.put("/:productId", auth.verify, (req,res) => {

	const data = {
		product: req.body,
		isAdmin: auth.decode(req.headers.authorization).isAdmin
	};

	productController.updateProduct(data, req.params).then(resultFromController => res.send(resultFromController));
});

// [UPDATE PRODUCT: END]

/*******************************************************************************/

// [SET TO INACTIVE: START]

router.put("/hide/:productId", auth.verify, (req,res) => {

	const data = {
		isAdmin: auth.decode(req.headers.authorization).isAdmin
	};

	productController.hideProduct(data, req.params, req.body).then(resultFromController => res.send(resultFromController));
});

// [SET TO INACTIVE: END]

/*******************************************************************************/

// [SET TO ACTIVE: START]

router.put("/activate/:productId", auth.verify, (req,res) => {

	const data = {
		isAdmin: auth.decode(req.headers.authorization).isAdmin
	};

	productController.activateProduct(data, req.params, req.body).then(resultFromController => res.send(resultFromController));
});

// [SET TO ACTIVE: END]

/*******************************************************************************/

// [RETRIEVE LIVE: START]

router.get("/", (req,res) => {

	productController.showLiveProducts().then(resultFromController => res.send(resultFromController));
});

// [RETRIEVE LIVE: END]

/*******************************************************************************/

// [RETRIEVE ALL: START]

router.get("/all", (req,res) => {

	productController.showAllProducts().then(resultFromController => res.send(resultFromController));
});

// [RETRIEVE ALL: END]

/*******************************************************************************/

// [RETRIEVE ONE: START]

router.get("/:productId", (req,res) => {

	productController.showOneProduct(req.params).then(resultFromController => res.send(resultFromController));
});

// [RETRIEVE ONE: END]

module.exports = router;