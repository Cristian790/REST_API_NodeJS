const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	name:{
		type:String,
		required:[true,'Name field required'],
		trim:true
	},
	price:{
		type:Number,
		required:[true,'Price field is  required']
	},
	productImage:{
		type:String,
		required:[true,'Image required']
	}
});
const Product = mongoose.model('Product',ProductSchema);
module.exports = Product;