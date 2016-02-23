var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectid = require('objectid');
//mongoose.connect('mongodb://localhost/yestart')

var article = new  Schema({ 
	title:String,
	picUrl:String,
	show:Boolean,
	content:String,
	clickCount:{ type:Number,default:0 },
	createDate:{ type:Date,default:Date.now }
});

 var articleSchema = new Schema({
 	name:String,   //
 	picture:Boolean,
	typeArray : [article]
});

 articleSchema.static("push_typeArray",function(_id,pojo,cb){
 	pojo._id = objectid();
 	this.update({
 		"_id":_id
 	},{
 		"$push":{ "typeArray" : pojo }
 	},function(err,info){
 		if(err)
 			console.log(err);
 		cb(err,info,pojo);
 	});
 });

 articleSchema.static("update_typeArray"
 ,function(_id,updatePojo,callback){
 	var typeArrayId = updatePojo._id;
 	delete updatePojo['_id'];
 	this.update({
 		"_id":_id,
 		"typeArray._id":typeArrayId
 	},{
 		"typeArray.$":updatePojo
 	},function(err,info){
 		if(err)
 			console.log(err);
 		callback(err,info);
 	});
 });

 articleSchema.static("pull_typeArray",function(_id,typeArrayId,cb){
 	this.update({
 		"_id":_id,
 	},{
 		"$pull":{ "typeArray":{ "_id":typeArrayId } }
 	},function(err,info){
 		if(err)
 			console.log(err);
 		cb(err,info);
 	})
 });

 articleSchema.static("getTypeOne",function(_id,callback){
 	this.findOne({
 		"_id":_id,
 	},function(err,doc){
 		if(err){
 			console.log(err);
 		}
 		callback(err,doc);
 	});
 });

 var  article = mongoose.model("articles", articleSchema);

module.exports = article;




