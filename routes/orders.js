//----------------------------------------------------Import Modules
const express = require('express');
const router = express.Router();
//-------------------------------Validator
const { check, validationResult } = require('express-validator/check');
//-------------------------------Authenticate
const checkAuth = require('../middleware/check_auth');
//-------------------------------Import Controller
const OrdersController = require('../controllers/orders');



//-----------------------------------------------------Routes

//-----------------------------------Home Orders
router.get('/',checkAuth,OrdersController.orders_get_all);

//-----------------------------------Post Order
router.post('/',checkAuth,
	[
		check('product',"'product' field is required").trim().isLength({min:5}),
		check('quantity').trim().exists().withMessage("'quantity field is required").isInt({min:1})
	]
	,OrdersController.orders_post);

//-----------------------------------Find order
router.get('/:orderId',checkAuth,OrdersController.order_find);

//-----------------------------------Delete Order
router.delete('/:orderId',checkAuth,OrdersController.order_delete);

//------------------------------------Export Module
module.exports=router;