const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

	image : {
		type : Object,
		required : [true, "Image is required!"]
	},
	name : {
		type : String,
		required : [true, "Name is required!"]
	},
	description : {
		type : String,
		required : [true, "Description is required!"]
	},
	price : {
		type : Number,
		required : [true, "Price is required!"]
	},
	isActive : {
		type : Boolean,
		default : true
	},
	createdOn : {
		type : Date,
		default : new Date()
	},
	orders : [
		{
			orderId : {
				type : String,
				required : [true, "Order ID is required!"]
			},
			userId : {
				type : String,
				required : [true, "User ID is required!"]
			},
			isCancelled : {
				type : Boolean,
				default : false
			},
			quantity : {
				type : Number,
			},
			purchasedOn: {
				type: Date,
				default: new Date()
			},
			_id : {
				type : String
			}
		}

	]

})

module.exports = mongoose.model("Product", productSchema);