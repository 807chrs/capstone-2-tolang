const express = require ("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const auth = require("../auth");



// [USER REGISTRATION: START]

router.post("/register", (req, res) => {

	userController.registerUser(req.body).then(resultFromController=>res.send(resultFromController));
});

// [USER REGISTRATION: END]

/*******************************************************************************/

// [USER LOGIN: START]

router.post("/login", (req, res) => {

	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController));
});

// [USER LOGIN: END]

/*******************************************************************************/

// [EMAIL CHECK: START]

router.post("/checkEmail", (req, res) => {

	userController.checkEmailExists(req.body).then(resultFromController => res.send(resultFromController));
});

// [EMAIL CHECK: END]

/*******************************************************************************/

// [SET AS ADMIN: START]

router.put("/setAsAdmin/:userId", auth.verify, (req, res) => {

	userController.setAsAdmin(req.params, req.body).then(resultFromController => res.send(resultFromController));
});

// [SET AS ADMIN: END]

/*******************************************************************************/

// [REMOVE AS ADMIN: START]

router.put("/removeAsAdmin/:userId", auth.verify, (req, res) => {

	userController.removeAsAdmin(req.params, req.body).then(resultFromController => res.send(resultFromController));
});

// [REMOVE AS ADMIN: END]


/*******************************************************************************/

// [CHECKOUT: START]

router.post("/checkout", auth.verify, (req, res) => {

	let data = {
		productId: req.body.productId,
		quantity: req.body.quantity,
		userId: auth.decode(req.headers.authorization).id
	};
	userController.checkout(data).then(resultFromController => res.send(resultFromController));
});

// [CHECKOUT: END]

/*******************************************************************************/

// [RETRIEVE PROFILE: START]

router.get("/details", auth.verify, (req, res) => {

	const userData = auth.decode(req.headers.authorization);
	userController.getProfile({userId:userData.id}).then(resultFromController => res.send(resultFromController));
});

// [RETRIEVE PROFILE: END]

/*******************************************************************************/

// [RETRIEVE ALL PROFILE: START]

router.get("/all", auth.verify, (req, res) => {

	userController.getUsers().then(resultFromController => res.send(resultFromController));
});

// [RETRIEVE ALL PROFILE: END]

/*******************************************************************************/

// [UPDATE USER DATA: START]

router.patch("/:userId", auth.verify, (req, res) => {

	userController.updateDetails(req.params, req.body).then(resultFromController => res.send(resultFromController));
});

// [UPDATE USER DATA: END]

/*******************************************************************************/

// [CHANGE PASSWORD: START]

router.put("/changePassword/:userId", auth.verify, (req, res) => {

	userController.changePassword(req.params, req.body).then(resultFromController => res.send(resultFromController));
});

// [CHANGE PASSWORD: END]

/*******************************************************************************/

// [CANCEL ORDER: START]

router.put("/cancelOrder/:userId/:orderId", auth.verify, (req, res) => {
	const userId = req.params.userId;
	const orderId = req.params.orderId;
	userController.cancelOrder(userId, orderId).then((resultFromController) => res.send(resultFromController));
});

// [CANCEL ORDER: END]

/*******************************************************************************/

// [RE-ORDER: START]

router.put("/reOrder/:userId/:orderId", auth.verify, (req, res) => {
	const userId = req.params.userId;
	const orderId = req.params.orderId;
	userController.reOrder(userId, orderId).then((resultFromController) => res.send(resultFromController));
});

// [RE-ORDER: END]

/*******************************************************************************/

// [CHANGE QUANTITY: START]

router.put("/updateQuantity/:userId/:orderId/:productId/", auth.verify, (req, res) => {
	const userId = req.params.userId;
	const orderId = req.params.orderId;
	const productId = req.params.productId;
	const quantity = req.body.quantity;
	userController.updateQuantity(userId, orderId, productId, quantity).then((resultFromController) => res.send(resultFromController));
});

// [CHANGE QUANTITY: END]

module.exports = router;