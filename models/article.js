/***
 * @desc  文章对象
 *        因为字段过多，故将评论和回复单独放在ArticleComment集合内，方便操作。
 * @date 2016/2/25
 * @auther yq
 *
 * @api model层
 * 1.pushCollection 像收藏集合中添加用户id
 * 2.pullCollection 在集合中删除用户id
 * @api pojo层
 *
 * @_api
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectid = require('objectid'),
    AriticleCollection = require('./AriticleCollection');

var articleSchema = new Schema({
    _userId:Schema.Types.ObjectId,//用户Id
    authorName:String,//作者
    title:String,//文章标题
    introduce:String,//简介
    content:String,//文章内容
    creatTime:{type:Date,default:Date.now},//创建时间
    status:Number,// 作品 0-未通过 1-待审核 2-草稿 3-审核通过
    reason:String,//审核未通过原因
    bannerFlag:Boolean,//是否开启banner展示
    bannerurl:String,//列表的banner
    imgUrl:String,//首页列表图
    from:String,//来源
    content:String,//文章内容
    topno:{ type:Number,default:0},//展示在首页的顺序
    /** 集合*/
    type:String,//文章类型
    keyword:[String],//关键字
    checkcounts:{type:Number,default:0},//查看次数
    collections:[Schema.Types.ObjectId],//收藏次数 添加用户id
    comments:[Schema.Types.ObjectId],//评论数组,储存评论_id
    /** 从内容中抽取的图片路径 */
    contentPicUrl:String,
    /**
     * @desc 非持久化对象
     */
    __comments:[],//评论数组
    __othernos:[],//作者其他推荐文章
    __relationnos:[],//相关文章推荐
    articlefroms:[],//文章来源 0-名人 1-造物志
});



/**
 * @desc 文章查看次数+1
 * @param {Object} - _airId
 */
 articleSchema.statics.addCheck = function(_airId){
     this.update({"_id":_airId},{
         "$inc":{ "checkcounts":1}
     },function(err){
         err && console.log(err);
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





var  article = mongoose.model("articles", articleSchema);
module.exports = article;