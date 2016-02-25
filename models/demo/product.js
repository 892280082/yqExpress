var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectid = require('objectid')

var  pro  =  new  Schema({ 
	name:String,
	content:String,
	createDate:{ type: Date, default: Date.now },
	picture:String,
	price:Number,
	unit:String,
	show:Boolean,
	introduce:String,
	clickCount:{ type:Number , default:0 },	
	_parentId:{
		_id:String,
		_cateId:String
	},
	detail:[{
		title:String,
		content:String
	}]
});

var ProductSchema = new Schema({
	title : String,
	show: Boolean,
	picUrl:String,
	sort: {type:Number,default:1},
	typeArray : [{
		'cateName':String,
		'productArray':[pro]
	}]
});


//typeArray 插入数据
ProductSchema.static("pushTypeArray",function(_ProId,typCate,callback){
	typCate._id = objectid();
	this.update(
		{"_id":_ProId},{
			"$push":{"typeArray":typCate}
		},function(err){
			!err ? callback(err,typCate) : callback(err);
		});
});

//typeArray 删除数据
ProductSchema.static("pullTypeArray",function(_id,_cateId,callback){
	this.update({
		"_id":_id,
	},{
		"$pull":{"typeArray":{"_id":_cateId}}
	},function(err,doc){
		callback(err);
	});
});

//productArray 插入数据
ProductSchema.static("pushProductArray",function(_id,_cateId,pojo,callback){
	pojo._id = objectid();
	this.update({
		"_id":_id,
		"typeArray._id":_cateId,
	},{
		"$push":{ "typeArray.$.productArray":pojo}
	},function(err){
		callback(err,pojo);
	})
})
//productArray 更新数据
ProductSchema.static("pullProductArray"
	,function(_id,_cateId,_ProId,callback){
		this.update({
			"_id":_id,
			"typeArray._id":_cateId,
		},{
			"$pull":{ "typeArray.$.productArray" : { "_id": _ProId} }
		},function(err){
			callback(err);
		})
})

//更新 typeArray -> productArray -> pro
ProductSchema.static("editTypeProPro"
	,function(_id,_cateId,product,callback){
		var _self = this;
		this.findOne({
			"_id":_id,
			"typeArray._id":_cateId
		},{
			"typeArray":{"$elemMatch":{ "_id":_cateId }}
		},function(err,doc){
			if(err){
				console.log(err);
				return callback(err);
			}
			var _mongoProArray = doc.typeArray[0].productArray;
			for(var i=0,ii=_mongoProArray.length;i<ii;i++){
				if(_mongoProArray[i]._id == product._id){
					_mongoProArray[i] = product;
					break;
				}
			}
			_self.update({
					"_id":_id,
					"typeArray._id":_cateId
				},{
					"typeArray.$.productArray":_mongoProArray
				},function(err,info){
					if(err)
						console.log(err);
					callback(err,info);
			});
		})
});

var  Product = mongoose.model("Products", ProductSchema);

module.exports = Product;


