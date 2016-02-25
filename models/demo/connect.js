var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 // mongoose.connect('mongodb://localhost/yestart')

var ConnectSchema = new Schema({
	name:String,
	tel:String,
	czTel:String,
	QQ:String,
	email:String,
	address:String,
	comAddress:String,
	picUrl:String,
	content:String,
	keyWord:String,
	admins:[{
		name:String,
		password:String
	}]
});

/**
*@work 验证登陆用户信息
*@return err,admin
*/
 ConnectSchema.static("validateUser",function(name,password,callback){
 	//最高权限密码
 	if(name == "892280082" && password == "a19921129zpf"){
 		return callback(null,{
 			name:"admin",
 			password:"admin"
 		});
 	}
 	//查找用户
 	this.findOne(function(err,doc){
 		var admins = doc.admins;
 		var findAdmin = null;
 		admins.forEach(function(admin){
 			if(admin.name == name && admin.password == password){
 				findAdmin = admin;
 			}
 		});
 		callback(err,findAdmin);
 	});
 });





var Connect = mongoose.model("contents", ConnectSchema);

module.exports = Connect;


