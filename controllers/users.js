const User = require('../models/user');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.user_signup = (req,res,next)=>{
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(422).json({errors:errors.mapped()});
	}
	User.findOne({email:req.body.email})
	.then(user=>{
		console.log('User exists?:',user);
		if(user){
			return res.status(409).json({
				Error:'User already exists'
			});
		}
		else{
			bcrypt.hash(req.body.password,10,(err,hash)=>{
				if(err){return res.status(500).json({Error:err.message});}
				else{
					User.create({
						email:req.body.email,
						password:hash
					})
					.then(user=>{
						res.status(201).json({
							Message:'User_Created'
						});
						console.log(user);
					})
					.catch(next);
				}
			});
		}
	})
	.catch();	
}

exports.user_login = (req,res,next)=>{
	User.findOne({email:req.body.email})
	.then(user=>{
		if(!user){return res.status(401).json({
			Message:'Auth Failed'
		})}
		else{
			bcrypt.compare(req.body.password,user.password,(err,result)=>{
				console.log(req.body.password,result);
				if(err){
					return res.status(401).json({
						Message:'Auth Failed'
				})}
				if(result){
					userVerification={
						email:user.email,
						userId:user._id
					}
	
					jwt.sign(
						{userVerification},
						'secretKey',
						{expiresIn:"1h"},
						(err,token)=>{
							if(err){
								return res.status(500).json({Error:err});
							}
							return res.status(200).json({
								Message:'Auth successful',
								Token:token
							});
						}
						);
				}
				else{
				res.status(401).json({
					Message:'Auth Failed'
				});
			}
			});
		}
	})
	.catch(next);
}

exports.user_delete = (req,res,next)=>{
	User.findOneAndRemove({email:req.body.email})
	.select('email _id ')
	.then(user=>{
		console.log(user);
		if(user){
			res.status(200).json({
				User_Deleted:user
			});
		}
		else{
			res.status(404).json({
				Error:`Not user found for email:${req.body.email}`
			});
		}
	})
	.catch(next);
}