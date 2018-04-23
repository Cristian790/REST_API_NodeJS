//------------------------------------------Import Modules
//Express
const express = require('express');
//Router
const router = express.Router();
//Product Schema
const Product = require('../models/product');
//Multer
const multer = require('multer');
//File System for deleting images
var fs = require('fs');
//Validator
const { check, validationResult } = require('express-validator/check');
//Path, to scan the file extension
const path = require('path');

//-------------------------------------------------Multer
//-----------------------------------Multer Disk Storage
const storage = multer.diskStorage({
	destination:(req,file,cb)=>{
		cb(null,'./public/uploads')
	},
	filename:(req,file,cb)=>{
		cb(null, file.fieldname+ new Date().toISOString().replace(/:/g,'-')+path.extname(file.originalname));
	}
});
//-----------------------------------Multer Filter
const fileFilter = (req,file,cb)=>{
	const name=req.body.name;
	const price= req.body.price;
	const pricea=Number(price);
	console.log(pricea);
	if(name!=undefined && price!=undefined){
		const namea= name.replace(/ /g,'');
		if(namea.length>0 && pricea>0){
			if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'){
				console.log(req.body.name)
				cb(null,true);
			}else{
				cb( new Error('Invalid extension'));
			}
		}
		else{
			console.log(namea,90+pricea)
			cb(new Error('Name and price required'))
		}	
	}
	else{
		cb(new Error('Name and Price fields are required'))
	}

	
}

//-----------------------------------Init Multer
const upload = multer({
	storage:storage,
	limits:{
		fileSize:1024*1024*5
	},
	fileFilter:fileFilter
});


//-------------------------------------------Routes
//Home Products
router.get('/',(req,res,next)=>{
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
});

//Find Product
router.get('/:productId',(req,res,next)=>{
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
});

//Post Product
router.post('/'

	,upload.single('productImage')
	,(req,res,next)=>{
	if(req.file==undefined){
		res.status(500).json({
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
	
	
});

//Update Product
router.patch('/:productId',upload.single('productImage'),(req,res,next)=>{
	const image="";
	Product.findByIdAndUpdate(req.params.productId,{
		name:req.body.name,
		price:req.body.price,
		productImage:req.file.path
		},
		{ runValidators: true })
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
			fs.unlink(product.productImage,(e)=>{
				console.log(e);
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
});

//Export Module
module.exports=router;
