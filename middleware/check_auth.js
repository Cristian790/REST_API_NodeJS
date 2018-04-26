const jwt = require('jsonwebtoken');

module.exports=(req,res,next)=>{
	const authHeader = req.headers.authorization;
	if(authHeader!=undefined){
		const token = authHeader.split(' ')[1];
		jwt.verify(token,'secretKey',(err,decoded)=>{
			if (err){res.status(403).json({Message:'Auth Failed'});}
			else{
				req.userData=decoded;
				next();
			}
		});
	}
	else{
		res.status(403).json({Message:'Auth Failed'});
	}
};