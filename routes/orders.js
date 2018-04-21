//-----------------------------------------Import Modules
const express = require('express');
const router = express.Router();
const Order = require('../models/order');

//-----------------------------------------Routes
//Home Orders
router.get('/',(req,res,next)=>{
	Order.find({})
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

//Post Order
router.post('/',(req,res,next)=>{
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
});

//Find order
router.get('/:orderId',(req,res,next)=>{
	res.status(200).json({
		message:'Order details',
		orderId:req.params.orderId
	});
});

//Delete Order
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

//Export Module
module.exports=router;