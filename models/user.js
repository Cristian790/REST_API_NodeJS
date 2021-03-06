const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email:{
		type:String,
		required:[true,'Email is required'],
		match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	password:{
		type:String,
		required:[true,'Password required']
	}
});

const User = mongoose.model('User',UserSchema);
module.exports=User;