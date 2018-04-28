const Product = require('../models/product');
//File System for deleting images
var fs = require('fs');

exports.products_get_all = (req,res,next)=>{
	Product.find({})
	.select('_id name price productImage')
	.then((products)=>{
		res.status(200);
		res.json({
			Count:products.length,
			List_of_Products:products.map(product=>{
				return{
					product,
					request:{
						type:'DELETE',
						url:`http://localhost:5500/products/${product._id}`
					}
				}
			})
		});
	})
	.catch(next);
}

exports.products_find = (req,res,next)=>{
	Product.findById(req.params.productId)
	.select('_id name price productImage')
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
}

exports.products_post = (req,res,next)=>{
	if(req.file==undefined){
		res.status(422).json({
			Error:'Image asdas is required'
		});
	}
	else{
		Product.create({
			name:req.body.name,
			price:req.body.price,
			productImage:req.file.path.replace(/\\/g, '/')})
		.then((product)=>{
			res.status(201);
			res.json({
				Created_Product:product,
				request:{
					type:'GET',
					url:'http://localhost:5500/products'
				}});
		})
		.catch(next);
		}
	
	
}

exports.products_patch = (req,res,next)=>{
	Product.findByIdAndUpdate(req.params.productId,{
		name:req.body.name,
		price:req.body.price,
		productImage:req.file.path.replace(/\\/g,'/')
		},
		{ runValidators: true })
	.then((product)=>{
		Product.findById(req.params.productId)
		.then((productU)=>{
			if(product){
				fs.unlink(product.productImage,e=>{console.log(e)});
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

		}).catch(err=>{console.log(err)});
	})
	.catch(next);
}

exports.products_delete = (req,res,next)=>{
	Product.findByIdAndRemove(req.params.productId)
	.then((product)=>{
		if(product){
			fs.unlink(product.productImage,(e)=>{
				if(e) return console.log(e);
			});
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
}

