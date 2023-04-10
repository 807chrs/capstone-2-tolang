const Product = require("../models/Product");
const cloudinary = require("../cloudinary");

// [ADD PRODUCT: START]

module.exports.addProduct = async(data) => {
	if(data.isAdmin) {

		if(data.product.image) {
			const uploadRes = await cloudinary.uploader.upload(data.product.image, {
				upload_preset: "sikad-gears"
			});
			if(uploadRes) {
				const newProduct = new Product({
					name: data.product.name,
					description: data.product.description,
					price: data.product.price,
					image: uploadRes
				});
				return newProduct.save().then((product, error) => {
					if(error) {
						return false;
					} else {
						return true;
					};
				});
			} else {
				return false;
			};
		} else {
			return false;
		};
	};
};

// [ADD PRODUCT: END]

/*******************************************************************************/

// [UPDATE PRODUCT: START]

module.exports.updateProduct = async(data, reqParams) => {

	if(data.isAdmin) {

		if(data.product && data.product.image) {
			const uploadRes = await cloudinary.uploader.upload(data.product.image, {
				upload_preset: "sikad-gears"
			});
			if(uploadRes) {
				const updatedProduct = {
					name: data.product.name,
					description: data.product.description,
					price: data.product.price,
					image: uploadRes
				};
				return Product.findByIdAndUpdate(reqParams.productId, updatedProduct).then((product, error) => {
					if(error) {
						return false;
					} else {
						return true;
					};
				});
			};
		} else {
			return false;
		};
	};
};


// [UPDATE PRODUCT: END]

/*******************************************************************************/

// [SET TO INACTIVE: START]

module.exports.hideProduct = (data, reqParams, reqBody) => {

	if (data.isAdmin) {
		let hiddenProduct = {
			isActive: false
		};
		return Product.findByIdAndUpdate(reqParams.productId, hiddenProduct).then((product, error) => {
			if(error) {
				return false;
			} else {
				return true;
			};
		});
	} else {
		return false;
	};
};

// [SET TO INACTIVE: END]

/*******************************************************************************/

// [SET TO ACTIVE: START]

module.exports.activateProduct = (data, reqParams, reqBody) => {

	if(data.isAdmin) {
		let activatedProduct = {
			isActive: true
		};
		return Product.findByIdAndUpdate(reqParams.productId, activatedProduct).then((product, error) => {
			if (error) {
				return false;
			} else {
				return true;
			};
		});
	} else {
		return false;
	};
};

// [SET TO ACTIVE: END]

/*******************************************************************************/

// [RETRIEVE LIVE: START]

module.exports.showLiveProducts = () => {

	return Product.find({isActive: true}).then(result => {
		return result;
	});
};

// [RETRIEVE LIVE: END]

/*******************************************************************************/

// [RETRIEVE ALL: START]

module.exports.showAllProducts = () => {

	return Product.find({}).then(result => {
		return result;
	});
};

// [RETRIEVE ALL: END]

/*******************************************************************************/

// [RETRIEVE ONE: START]

module.exports.showOneProduct = (reqParams) => {

	return Product.findById(reqParams.productId).then(result => {
		return result;
	});
};

// [RETRIEVE ONE: END]