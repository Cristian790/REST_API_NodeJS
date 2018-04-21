//------------------------------------------Import Modules
//Express
const express = require('express');
//Router
const router = express.Router();
//Product Schema
const Product = require('../models/product');
//-------------------------------------------Routes
//Home Products
router.get('/',(req,res,next)=>{
	Product.find({})
	.select('_id name price')
	.then((products)=>{
		res.status(200);
		res.json({
			Count:products.length,
			List_of_Products:products
		});
	})
	.catch(next);
});

//Find Product
router.get('/:productId',(req,res,next)=>{
	Product.findById(req.params.productId)
	.select('_id name price')
	.then((product)=>{
		if(product){
			res.status(200);
			res.json({
				Find_By_Id:req.params.productId,
				Product:product
			});
		}
		else{
			res.status(404);
			res.json({
				Message:`Not entries found for ID: ${req.params.productId}`
			});
		}
		
	})
	.catch(next);
});

//Post Product
router.post('/',(req,res,next)=>{
	Product.create(req.body)
	.then((product)=>{
		res.status(201);
		res.json({
			Created_Product:product});
	})
	.catch(next);
	
});

//Update Product
router.patch('/:productId',(req,res,next)=>{
	Product.findByIdAndUpdate(req.params.productId,req.body)
	.then((product)=>{
		Product.findById(req.params.productId)
		.then((productU)=>{
			if(product){
				res.status(200);
				res.json({
					Product:product,
					Product_Updated:productU
				});
			}
			else{
				res.status(404);
				res.json({
					Message:`No entries found for ID: ${req.params.productId}`
				});
			}

		});
	})
	.catch(next);
});

//Delete Product
router.delete('/:productId',(req,res,next)=>{
	Product.findByIdAndRemove(req.params.productId)
	.then((product)=>{
		if(product){
			res.status(200);
			res.json({
				Product_Deleted:product
			});
		}
		else{
			res.status(404);
			res.json({
				Message:`No valid entry found for ID: ${req.params.productId}`
			});
		}
	})
	.catch(next);
});

//Export Module
module.exports=router;
