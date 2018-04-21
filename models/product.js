const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	name:{
		type:String,
		required:[true,'Name field required']
	},
	price:{
		type:Number,
		required:[true,'Price field is  required']
	}
});
const Product = mongoose.model('Product',ProductSchema);
module.exports = Product;