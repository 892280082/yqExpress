/****************************************************************************************
 * @desc 用户表
 * @date 2016/2/25
 * @auther yq
 *
 * @api model层
 * 1.validateUser 验证用户，使用md5算法 ok
 * 2.pushAriticle 添加文章
 * 3.pullAriticle 删除文章
 * 4.pushProduct -添加产品  -call('err',{保存后的产品对象})
 * 5.pullProduct 删除产品 -call('err',删除信息)
 * 6.pushAttentions 添加关注，被关注的一方pushfollowers
 * 7.pullAttentions 取消关注  被关注的一方pullfollowers
 *
 * @api pojo层
 * 1.saveUser - 保存用户，并配置加密算法(md5)ok  -call('err',保存后的user对象)
 *
 * @_api
 * crptoUserPassword 加密用户密码
 ****************************************************************************************/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectid = require('objectid'),
    md5 = require('md5'),
    then = require('thenjs'),
    mongooseUtil = require("../util/mongooseUtil"),
    Article = require('./Article'),//文章集合
    Product = require('./product');//产品集合


var customSchema = new Schema({
    name:{ type:String, unique: true },//用户姓名
    job:String,//用户职业
    password:String,//密码
    introduce:String,//用户介绍
    email:{ type:String, unique: true },//邮件
    postAddress:String,//邮编
    realName:String,//真实姓名
    provice:String,//省份
    city:String,//城市
    detailAddress:String,//详细地址
    phoneNumber:String,//联系方式
    ability:String,//能力标签
    creatTime:{type:Date,default:Date.now},//添加时间
    bannerurl:String,//
    topno:Number,//首页baner顺序
    imgurl:String,//图像
    usertype:{type:Number,default:0},//用户身份 0->普通用户 1->管理员 2->人物
    focusno:Number,//人物聚焦
    bannerno:Number,//模块Banner展示
    sex:{type:Number,default:0},//性别 0男1女
    bigimgurl:String,//大图
    coverimgurl:String,//封面url
    birthday:{type:Date,default:null},//生日
    educational:String,//学历
    qq:{ type:String, unique: true },//QQ
    weibo:{ type:String, unique: true },//微博

    articles:[Schema.Types.ObjectId],//用户文章
    productions:[Schema.Types.ObjectId],//创品数量
    followers:[Schema.Types.ObjectId],//我的粉丝
    attentions:[Schema.Types.ObjectId],//我关注的人
});

/**
 * @desc 加密用户密码
 * @param password {String} - 用户密码
 * @returns {String}
 */
function crptoUserPassword(password){
    return md5(password);
}
/**
 * @param callback {Function} - 回调函数
 */
customSchema.methods.saveUser = function(callback){
    var customPojo = this;
    then(function(next){ //检查用户名
        custom.findOne({
            "name":customPojo.name
        },function(err,doc){
            if(doc)
                return callback("该用户名已注册");
            next(err);
        })
    }).then(function(next){
        customPojo.password = crptoUserPassword(customPojo.password);//加密用户密码
        customPojo.save(function(err){
            err && console.log(err);
            return callback(err,customPojo);
        })
    }).fail(function(next,err){
        return callback(err);
    })
}

/**
 * @desc 验证本地登录用户
 * @param name {String} - 用户名
 * @param password {String} - 用户密码
 * @param callback {Function} - 回调函数
 * @returns 用户对象
 */
customSchema.statics.validateUser = function(name,password,callback){
    this.findOne({
        "name":name,
        "password":password
    },function(err,doc){
        err && console.log(err);
        callback(err,doc);
    })
}

/**
 *
 * @param _cusId {String} - 用户id
 * @param article {Object} - 文章对象
 * @param callback {Function} - 回调函数
 */
customSchema.statics.pushAriticle = function(_cusId,article,callback){
    if(!article._userId)
        return callback("article._userId 不能为空");
    mongooseUtil.addInnerCollection({
        parentId:_cusId,
        collecname:"articles",
        childPojo:article,
        childDao:Article,
        callback:callback
    },this);
}

/**
 * @desc 删除文章
 * @param _cusId {String} - 用户id
 * @param _ariId {String} - 文章对象
 * @param callback {Function} - 回调函数
 */
customSchema.statics.pullAriticle = function(_cusId,_ariId,callback){
    mongooseUtil.removeInnerCollection({
        "parentId":_cusId,
        "childId":_ariId,
        "childDao":Article,
        "collecname":"articles",
        "callback":callback
    },this);
}

/**
 * @param _cusId {String} - 用户id
 * @param product {Object} - 产品对象
 * @param callback {Function} - 回调函数
 */
customSchema.statics.pushProduct = function(_cusId,pro,callback){
    var _this = this;
    if(!pro._userId)
        return callback("product._userId 不能为空");
    then(function(next){
        custom.findOne({"_id":_cusId},function(err,doc){
            if(doc){
                pro._userName = doc.name;
            }else{
                return callback('该用户不存在');
            }
            next(err);
        })
    }).then(function(next){
        mongooseUtil.addInnerCollection({
            parentId:_cusId,
            collecname:"productions",
            childPojo:pro,
            childDao:Product,
            callback:callback
        },_this);
    }).fail(function(next,err){
        err && console.log(err);
        return callback('创品保存错误');
    })
}

/**
 * @desc 删除产品
 * @param _cusId {String} - 用户id
 * @param _proId {String} - 产品对象
 * @param callback {Function} - 回调函数
 */
customSchema.statics.pullProduct = function(_cusId,_proId,callback){
    mongooseUtil.removeInnerCollection({
        "parentId":_cusId,
        "childId":_proId,
        "childDao":Product,
        "collecname":"productions",
        "callback":callback
    },this);
}

/**
 * @desc 关注用户
 * @param _selfId {String} - 关注方
 * @param _otherId {String} - 被关注方
 * @param callback {Function} - 回调函数
 */
customSchema.statics.pushAttentions = function(_selfId,_otherId,callback){
    mongooseUtil.dealAllCollectionId({
        parentId:_selfId,
        collecname:"attentions",
        childId:_otherId,
        childDao:this,
        childCollecname:"followers",
        parentPojo:_otherId,
        childPojo:_selfId,
        callback:callback
    },this);
}

/**
 * @desc 取消关注
 * @param _selfId {String} - 取消关注方
 * @param _otherId {String} - 被关注方
 * @param callback {Function} - 回调函数
 */
customSchema.statics.pullAttentions = function(_selfId,_otherId,callback){
    mongooseUtil.dealAllCollectionId({
        parentId:_selfId,
        collecname:"-attentions",
        childId:_otherId,
        childDao:this,
        childCollecname:"-followers",
        parentPojo:_otherId,
        childPojo:_selfId,
        callback:callback
    },this);
}



var  custom = mongoose.model("customs", customSchema);
module.exports = custom;


/***********************************************************/