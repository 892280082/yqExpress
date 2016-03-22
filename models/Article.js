/***
 * @desc  文章对象
 *        因为字段过多，故将评论和回复单独放在ArticleComment集合内，方便操作。
 * @date 2016/2/25
 * @auther yq
 *
 * @api model层
 * 1.pushCollection 像收藏集合中添加用户id
 * 2.pullCollection 在集合中删除用户id
 * 3.添加评论 addComment -call('err',保存后的评论对象)
 * 4.getLink      获取文章及文章作者 -call(err,获取级联后的对象)
 * @api pojo层
 *
 * @_api
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectid = require('objectid');
var AriticleCollection = require('./AriticleCollection');
var ArticleComment = require("./ArticleComment");
var mongooseUtil = require("../util/mongooseUtil");
var then = require("thenjs");

var articleSchema = new Schema({
    _userId:Schema.Types.ObjectId,//用户Id
    authorName:String,//作者
    title:String,//文章标题
    introduce:String,//简介
    content:String,//文章内容
    creatTime:{type:Date,default:Date.now},//创建时间
    status:Number,// 作品 0-未通过 1-待审核 2-草稿 3-审核通过
    reason:String,//审核未通过原因
    bannerurl:String,//列表的banner
    imgUrl:String,//封面图
    from:String,//来源
    content:String,//文章内容
    topno:{ type:Number,default:0},//展示在首页的顺序
    /** 集合*/
    cate1:{},//文章类型
    keyword:[String],//关键字
    checkcounts:{type:Number,default:0},//查看次数
    collections:[Schema.Types.ObjectId],//收藏次数 添加用户id
    comments:[Schema.Types.ObjectId],//评论数组,储存评论_id
    praiseCounts:{type:Number,default:0},//喜欢次数
    /** 从内容中抽取的图片路径 */
    contentPicUrl:String,

    /**非持久化对象*/
    $user:{},//用户对象
});


/**
 * @param _airId {String} -文章ID
 * @param callback {Function} 回调函数
 */
articleSchema.statics.getLink = function(_airId,callback){
    var _this = this;
    then(function(next){
        _this.findOne({"_id":_airId},function(err,doc){
            next(err,doc);
        });
    }).then(function(next,article){
        var Customer = require("./Custom");
        Customer.findOne({"_id":article._userId},function(err,doc){
            if(!err){
                article.$user = doc;
                callback(err,article);
            }else{
                next(err);
            }
        });
    }).fail(function(next,err){
        console.log("Article ->getLink:",err);
        callback(err);
    })
}


/**@desc 像收藏集合中添加用户id
 * @param {Object} - _airId 文章id
 * @param {Object} - _userId 用户id
 * @param {Function} - 回调函数
 */
articleSchema.statics.pushCollection = function(_airId,_userId,callback){
    this.update({"_id":_airId},{
        "$push":{ "collections":objectid(_userId)}
    },function(err){
        if(err){
            console.log(err);
        }else{
            AriticleCollection.addRecord(_userId,_airId);//增加记录
            callback(err);
        }
    })
}


/**@desc 在集合中删除用户id
 * @param {Object} - _airId 文章id
 * @param {Object} - _userId 用户id
 * @param {Function} - 回调函数
 */
articleSchema.statics.pullCollection = function(_airId,_userId,callback){
    this.update({"_id":_airId},{
        "$pull":{ "collections":objectid(_userId)}
    },function(err){
        if(err){
            console.log(err);
        }else{
            AriticleCollection.removeRecord(_userId,_airId);//删除记录
            callback(err);
        }
    })
}

/**
 * @param comment {Object} - 评论对象
 * @param callback  {Function} - 回调函数
 */
articleSchema.statics.addComment = function(comment,callback){
    if(!comment._articleId)
        return callback('评论的文章的文章ID不能为空');
    if(!comment._userId)
        return callback('评论的文章用户ID不能为空');
    mongooseUtil.addInnerCollection({
        parentId:comment._articleId,
        collecname:"comments",
        childPojo:comment,
        childDao:ArticleComment,
        callback:callback
    },this)
}





var  article = mongoose.model("articles", articleSchema);
module.exports = article;