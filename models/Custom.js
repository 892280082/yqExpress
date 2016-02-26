
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
    product = require('./product');//产品集合

mongoose.connect("mongodb://localhost/zwzhetest");

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
    var _ariId = objectid();
    var _this = this;
    article._id = _ariId;
    article._userId = objectid(_cusId);
    article = new Article(article);
    then(function(defer){
        article.save(function(err){
            defer(err);
        })
    }).then(function(err){
        _this.update(
            {"_id":_cusId},
            { "$push":{ "articles":_ariId }}
            ,function(err){
                err && console.log(err);
                return callback(err);
            })
    }).fail(function(defer,err){
        console.log(err);
        return callback(err);
    })
}

/**
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


var  custom = mongoose.model("customs", customSchema);
module.exports = custom;

/**********************方法测试*******************************/

// custom.pushAriticle(
//      "56cfe6524d59aa7426a23c18",
//     {"title":"我是文章2"},function(err){
//         !err && console.log("pushAriticle 测试OK");
// })

//parent 56cfe6524d59aa7426a23c18
//child 56cfe6cc0f1ac28820000001


custom.pullAriticle(
    "56cfe6524d59aa7426a23c18",
    "56cfe6cc0f1ac28820000001",
    function(err){
        console.log(err);
    });




/***********************************************************/