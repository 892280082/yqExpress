
/****************************************************************************************
 * @desc 用户表
 * @date 2016/2/25
 * @auther yq
 *
 * @api model层
 * 1.validateUser 验证用户，使用md5算法 ok
 * 2.pushAriticle 添加文章
 * 3.pullAriticle 删除文章
 * 4.pushProduct 添加产品
 * 5.pullProduct 删除产品
 * 6.pushAttentions 添加关注，被关注的一方pushfollowers
 * 7.pullAttentions 取消关注  被关注的一方pullfollowers
 *
 * @api pojo层
 * 1.saveUser 保存用户，并配置加密算法(md5)  ok
 *
 * @_api
 * crptoUserPassword 加密用户密码
 ****************************************************************************************/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectid = require('objectid'),
    crypto = require('crypto'),
    then = require('thenjs'),
    mongooseUtil = require("../util/mongooseUtil");
    Article = require('./Article'),//文章集合
    Product = require('./product');//产品集合


var customSchema = new Schema({
    name:String,//用户姓名
    job:String,//用户职业
    password:String,//密码
    introduce:String,//用户介绍
    email:String,//邮件
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
    qq:String,//QQ
    weibo:String,//微博

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
    var hasher=crypto.createHash("md5");
    return hasher.update(password).digest('hex');
}
/**
 * @param callback {Function} - 回调函数
 */
customSchema.methods.saveUser = function(callback){
    this.password = crptoUserPassword(this.password);//加密用户密码
    this.save(function(err){
        err && console.log(err);
        return callback(err);
    })
}

/**
 * @desc 验证本地登录用户
 * @param name {String} - 用户名
 * @param password {String} - 用户密码
 * @param callback {Function} - 回调函数
 */
customSchema.statics.validateUser = function(name,password,callback){
    password = crptoUserPassword(password);
    this.findOne({
        "name":name,
        "password":password
    },function(err,doc){
        if(err){
            console.log(err);
            return callback(err);
        }else{
            return doc;
        }
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
 *
 * @param _cusId {String} - 用户id
 * @param product {Object} - 产品对象
 * @param callback {Function} - 回调函数
 */
customSchema.statics.pushProduct = function(_cusId,pro,callback){
    if(!pro._userId)
        return callback("product._userId 不能为空");
    mongooseUtil.addInnerCollection({
        parentId:_cusId,
        collecname:"productions",
        childPojo:pro,
        childDao:Product,
        callback:callback
    },this);
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
    _selfId = objectid(_selfId);
    _otherId = objectid(_otherId);
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

/**********************方法测试*******************************/
function TEST() {
    mongoose.connect("mongodb://localhost/zwzhetest");

    (function(){
        then(function (next) {   //保存文章
            var ariticle = {
                "title": "新的文件夹123",
            }
            ariticle._userId = "56cfe6524d59aa7426a23c18",
                custom.pushAriticle("56cfe6524d59aa7426a23c18", ariticle, function (err, childId) {
                    next(err, childId);
                })
        }).then(function (next, childId) { //通过用户id和文章id
            Article.findOne({
                    "_userId": "56cfe6524d59aa7426a23c18",
                    "_id": childId
                },
                function (err, doc) {
                    doc ? console.log("pushAriticle 执行成功")
                        : console.log("pushAriticle 执行失败");
                    next(err, doc);
                })
        }).then(function (next, doc) {
            custom.pullAriticle(
                "56cfe6524d59aa7426a23c18",
                doc._id,
                function (err) {
                    !err ? console.log("pullAriticle 执行成功")
                        : console.log("pullAriticle 执行失败");
                }
            )
        }).fail(function (next, err) {
            console.log("pushAriticle 执行失败");
            console.log("pullAriticle 执行失败");
        })
    })();

    (function(){
        var cus1 = new custom({name:"小张"});
        var cus2 = new custom({name:"小王"});
        then(function(next){
            cus1.save(function(err){
                next(err);
            })
        }).then(function(next){
            cus2.save(function(err){
                next(err);
            })
        }).then(function(next){
            custom.pushAttentions(cus1._id,cus2._id,function(err){
                   err ? console.log("pushAttentions 执行失败")
                       : console.log("pushAttentions 执行成功");
                   next(err);
            })
        }).then(function(next){
            custom.pullAttentions(cus1._id,cus2._id,function(err){
                err ? console.log("pullAttentions 执行失败")
                    : console.log("pullAttentions 执行成功");
                next(null);
            })
        }).fail(function(next,err){
            console.log("pushAttentions 执行失败");
            console.log("pullAttentions 执行失败");
        })
    })();
}

TEST();
/***********************************************************/