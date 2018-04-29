const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
	quantity: {
		type: Number,
		required: [true, 'Quantity required']
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: [true, 'Product Id is required']
	}
},
	{
		timestamps: true
	}
);

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;