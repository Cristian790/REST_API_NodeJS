//-----------------------------------------Import Modules
const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const { check, validationResult } = require('express-validator/check');

//-----------------------------------------Routes
//-------------------------------Home Orders
router.get('/',(req,res,next)=>{
	Order.find({})
	.populate('product','name')
	.then((orders)=>{
		res.status(200);
		res.json({
			Count:orders.length,
			List_of_Orders:orders.map((order)=>{
				return{
					_id:order._id,
					product:order.product,
					quantity:order.quantity,
					request:{
						type:'PATCH',
						url:`http://localhost:5500/orders/${order._id}`
					}
				}
			})
		});
	})
	.catch(next);
});

//---------------------------------Post Order
router.post('/',
	[
		check('product',"'product' field is required").trim().isLength({min:5}),
		check('quantity').trim().exists().withMessage("'quantity field is required").isInt({min:1})
	]
	,(req,res,next)=>{
		const errors = validationResult(req);
		if(!errors.isEmpty()){return res.status(422).json({Errors:errors.mapped()});}
	Product.findById(req.body.product)
	.then(productt=>{
		if(productt){
			Order.create(req.body)
			.then((order)=>{
				res.status(201);
				res.json({
					Order_Created:order,
					Orders:{
						url:`http://localhost:5500/orders`
					}
				});
			})
			.catch(next);
		}
		else{
			res.status(404);
			res.json({
				Message:`Product not found with ID:${req.body.product}`
			});
		}
	})
	.catch(next);
});

//----------------------------------Find order
router.get('/:orderId',(req,res,next)=>{
	Order.findById(req.params.orderId)
	.populate('product')
	.then(order=>{
		if(order){
			res.status(200);
			res.json({
				Find_by_ID:req.params.orderId,
				Order:order
			});
		}
		else{
			res.status(404);
			res.json({
				Message:`There is no orders with ID:${req.params.orderId}`
			});
		}
	})
	.catch(next);
});

//-----------------------------------Delete Order
router.delete('/:orderId',(req,res,next)=>{
	Order.findByIdAndRemove(req.params.orderId)
	.then((order)=>{
		if(order){
			res.status(200).json({Deleted_Order:order});
		}
		else{
			res.status(404).json({Message:`No valid entry found for ID: ${req.params.productId}`});
		}
	})	
	.catch(next);
});

//------------------------------------Export Module
module.exports=router;