const auth = require("../auth");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Product = require("../models/Product");

// [USER REGISTRATION: START]

module.exports.registerUser = (reqBody) => {

	let newUser = new User({
		firstName: reqBody.firstName,
		lastName: reqBody.lastName,
		email: reqBody.email,
		mobileNo: reqBody.mobileNo,
		password: bcrypt.hashSync(reqBody.password, 10)
	});

	return newUser.save().then((user, error) => {
		if(error) {
			return false;
		} else {
			return true;
		};
	});
};

// [USER REGISTRATION: END]

/*******************************************************************************/

// [USER LOGIN: START]

module.exports.loginUser = (reqBody) => {

	return User.findOne({email: reqBody.email}).then(result => {

		if(result == null) {
			return false;
		} else {
			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);
			if(isPasswordCorrect) {
				return {access: auth.createAccessToken(result)};
			} else {
				return false;
			};
		};
	});
};

// [USER LOGIN: END]

/*******************************************************************************/

// [EMAIL CHECK: START]

module.exports.checkEmailExists = (reqBody) => {

	return User.find({email: reqBody.email}).then(result => {
		if(result.length > 0 ) {
			return true;
		} else {
			return false;
		};
	});
};

// [EMAIL CHECK: END]

/*******************************************************************************/

// [SET AS ADMIN: START]

module.exports.setAsAdmin = (reqParams, reqBody) => {

	let updatedAdminStatus = {
		isAdmin: true
	};
	return User.findByIdAndUpdate(reqParams.userId, updatedAdminStatus).then((user, error) => {
		if(error) {
			return false;
		} else {
			return updatedAdminStatus;
		};
	});
};

// [SET AS ADMIN: END]

/*******************************************************************************/

// [REMOVE AS ADMIN: START]

module.exports.removeAsAdmin = (reqParams, reqBody) => {

	let updatedAdminStatus = {
		isAdmin: false
	};
	return User.findByIdAndUpdate(reqParams.userId, updatedAdminStatus).then((user, error) => {
		if(error) {
			return false;
		} else {
			return updatedAdminStatus;
		};
	});
};

// [REMOVE AS ADMIN: END]

/*******************************************************************************/

// [CHECKOUT: START]

module.exports.checkout = async (data) => {
	try {
		const user = await User.findById(data.userId);
		if(!user) {
			return false;
		};
		const product = await Product.findById(data.productId);
		if(!product) {
			return false;
		};
		const userOrder = {
			productId: product._id,
			name: product.name,
			quantity: data.quantity,
		};

		userOrder.userId = user._id;
		const order = await user.orders.create({
			totalAmount: product.price * data.quantity,
			products: [userOrder]
		});
		user.orders.push(order);
		await user.save();
		product.orders.push({
			orderId: order._id,
			userId: user._id,
			quantity: data.quantity,
			purchasedOn: new Date()
		});
		await product.save();
		return true;
	} catch(error) {
		console.error(error);
		return false;
	};
};

// [CHECKOUT: END]

/*******************************************************************************/

// [RETRIEVE PROFILE: START]

module.exports.getProfile = (data) => {
	return User.findById(data.userId).then(result => {
		result.password = "";
		return result;
	});
};

// [RETRIEVE PROFILE: END]

/*******************************************************************************/

// [RETRIEVE ALL PROFILE: START]

module.exports.getUsers = () => {

	return User.find({}).then(result => {
		return result;
	});
};

// [RETRIEVE ALL PROFILE: END]

/*******************************************************************************/

// [UPDATE USER DATA: START]

module.exports.updateDetails = (reqParams, reqBody) => {

	let editProfile = {
		firstName: reqBody.firstName,
		lastName: reqBody.lastName,
		email: reqBody.email,
		mobileNo: reqBody.mobileNo
	};
	return User.findByIdAndUpdate(reqParams.userId, editProfile).then((user, error) => {
		if(error) {
			return false;
		} else {
			return true;
		};
	});
};

// [UPDATE USER DATA: END]

/*******************************************************************************/

// [CHANGE PASSWORD: START]

module.exports.changePassword = (reqParams, reqBody) => {

	let changedPassword = {
		password: bcrypt.hashSync(reqBody.password, 10)
	};
	return User.findByIdAndUpdate(reqParams.userId, changedPassword).then((user, error) => {
		if(error) {
			return false;
		} else {
			return true;
		};
	});
};

// [CHANGE PASSWORD: END]

/*******************************************************************************/

// [CANCEL ORDER: START]

module.exports.cancelOrder = async (userId, orderId) => {
	try {
		const user = await User.findOneAndUpdate(
			{ _id: userId, "orders._id": orderId },
			{ $set: { "orders.$.isCancelled": true } },
			{ new: true }
			);

		if (!user) {
			return "Order not found";
		}

		const product = await Product.findOneAndUpdate(
			{ "orders.orderId": orderId },
			{ $set: { "orders.$.isCancelled": true } },
			{ new: true }
			);

		if (!product) {
			return "Product not found";
		}

		return user.orders.find((order) => order._id.toString() === orderId);

	} catch (error) {
		throw error;
	}
};

// [CANCEL ORDER: END]

/*******************************************************************************/

// [RE-ORDER: START]

module.exports.reOrder = async (userId, orderId) => {
	try {
		const user = await User.findOneAndUpdate(
			{ _id: userId, "orders._id": orderId },
			{ $set: { "orders.$.isCancelled": false } },
			{ new: false }
			);

		if (!user) {
			return "Order not found";
		}

		const product = await Product.findOneAndUpdate(
			{ "orders.orderId": orderId },
			{ $set: { "orders.$.isCancelled": false } },
			{ new: false }
			);

		if (!product) {
			return "Product not found";
		}

		return user.orders.find((order) => order._id.toString() === orderId);

	} catch (error) {
		throw error;
	}
};

// [RE-ORDER: END

/*******************************************************************************/

// [CHANGE QUANTITY: START]

module.exports.updateQuantity= async (userId, orderId, productId, quantity) => {
	try {
		const user = await User.findOneAndUpdate(
			{ _id: userId, "orders._id": orderId },
			{ $set: { "orders.$.products.$[product].quantity": quantity } },
			{ new: quantity, arrayFilters: [{ "product.productId": productId }] }
			);

		if (!user) {
			return "Order not found";
		};

		const product = await Product.findOneAndUpdate(
			{ "orders.orderId": orderId },
			{ $set: { "orders.$.quantity": quantity } },
			{ new: quantity }
			);

		if (!product) {
			return "Product not found";
		};

		const { price } = product;

		const newTotalAmount = (price * quantity).toFixed(2);

		const totalAmount = await User.findOneAndUpdate(
			{_id: userId, "orders._id": orderId},
			{ $set: {"orders.$.totalAmount": newTotalAmount} },
			{ new: newTotalAmount, arrayFilters: [{"product.productId": productId}] }
			)

		const newQuantityAndTotal = [{newQuantity: quantity}, {newTotalAmount: newTotalAmount}];

		return {newQuantityAndTotal}
	} catch (error) {
		throw error;
	}
};

// [CHANGE QUANTITY: END