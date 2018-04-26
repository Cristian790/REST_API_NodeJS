//------------------------------------------Import Modules
//Express
const express = require('express');
//Router
const router = express.Router();
//Multer
const multer = require('multer');
//JWT verification
const checkAuth = require('../middleware/check_auth');
//Path, to scan the file extension
const path = require('path');
//------------------------------------------Import Controller
const ProductsController = require('../controllers/products');

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
	//req.file puede ser incluido en esta validación
	if(name!=undefined && price!=undefined){
		const namea= name.replace(/ /g,'');
		if(namea.length>5 && pricea>0){
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
router.get('/',ProductsController.products_get_all);

//Find Product
router.get('/:productId', ProductsController.products_find);

//Post Product
//Express validator no impide que se guarde la imagen, de hecho no impide
//que "upload()" se ejecute incluso si hay errores
router.post('/',checkAuth
	,upload.single('productImage')
	,ProductsController.products_post);

//Update Product
router.patch('/:productId',checkAuth,upload.single('productImage'),ProductsController.products_patch);

//Delete Product
router.delete('/:productId',checkAuth,ProductsController.products_delete);

//Export Module
module.exports=router;
