//------------------------------------------Import Modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/database');

//------------------------------------------Import Routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

//------------------------------------------Init variables
const app = express();
const port = 5500;

//------------------------------------------Connect Database
mongoose.connect(config.database);
let db = mongoose.connection;
db.once('open',()=>console.log('Connected to MongoDB'));
db.on('error',err=>console.log(err));
mongoose.Promise=global.Promise;


//-------------------------------------------Middleware
//Morgan
app.use(morgan('dev'));
//Body Parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//-------------------------CORS
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header(
		"Access-Control-Allow-Headers",
		"Origin-X-Requested-With,Content-Type,Accept,Authorization"
		);
	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
		return res.status(200).json({});
	}
	next();
});


//---------------------------Route Handling
//Products route
app.use('/products',productRoutes);
//Orders route
app.use('/orders',orderRoutes);


//-------------------------- Error Handling
//Not Found Error
app.use((req,res,next)=>{
	const error = new Error('Not Found');
	error.status=404;
	next(error);
});
//All errors
app.use((err,req,res,next)=>{
	res.status(err.status || 500);
	res.json({
		Error:err.message
	});
});

//----------------------------------------------Init server on port
app.listen(port,()=>{console.log(`Server running on port ${port}`);});
