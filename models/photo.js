var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectid = require('objectid');
//mongoose.connect('mongodb://localhost/yestart')

var photo = new  Schema({ 
	name:String,
	picUrl:String,
	show:Boolean,
	linkUrl:String,
	content:String
});

 var PhotoSchema = new Schema({
 	cate:String,   //kh  zj sb
 	edit:Boolean,
	typeArray : [photo]
});

 PhotoSchema.static("push_typeArray",function(_id,pojo,cb){
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

 PhotoSchema.static("update_typeArray"
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

 PhotoSchema.static("pull_typeArray",function(_id,typeArrayId,cb){
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

 var  Photo = mongoose.model("photos", PhotoSchema);

module.exports = Photo;




