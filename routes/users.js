const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check_auth');

const { check, validationResult } = require('express-validator/check');

const UsersController = require('../controllers/users');


router.post('/signup',
	[
		check('email').isEmail().withMessage('Must be an email'),
		check('password').isLength({min:8}).withMessage('Password must be at least 8chars long')
	]
	,UsersController.user_signup);

router.post('/login',UsersController.user_login);

router.delete('/delete',checkAuth,UsersController.user_delete);

module.exports=router;