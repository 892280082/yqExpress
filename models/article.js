/***
 * @desc  文章对象
 *        因为字段过多，故将评论和回复单独放在ArticleComment集合内，方便操作。
 * @date 2016/2/25
 * @auther yq
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectid = require('objectid');

var articleSchema = new Schema({
    _id:Schema.Types.ObjectId,//主键
    _userId:Schema.Types.ObjectId,//用户Id
    authorName:String,//作者
    title:String,//文章标题
    type:[String],//文章类型
    introduce:String,//简介
    content:String,//文章内容
    creatTime:{type:Date,default:Date.now},//创建时间
    keyword:[String],//关键字
    status:Number,// 作品 0-未通过 1-待审核 2-草稿
    reason:String,//审核未通过原因
    isDelete:Boolean,//是否被删除
    checkcounts:{type:Number,default:0},//查看次数
    collectcounts:{type:Number,default:0},//收藏次数
    attentionno:{type:Number,default:0},//关注量
    comments:[Schema.Types.ObjectId],//评论数组,储存评论_id
    imgUrl:String,//首页列表图
    topno:Number,//展示在首页的顺序
    from:String,//来源
    /**
     * @desc 非持久化对象
     */
    __comments:[],//评论数组
    __othernos:[],//作者其他推荐文章
    __relationnos:[],//相关文章推荐
    articlefroms:[],//文章来源 0-名人 1-造物志
    bannerno:Number,//模块Banner展示
    bigimgurl:String,//首页banner
    coverimgurl:[],//列表的图片
    bannerurl:[],//列表的banner
    sortno:Number,//排序
});

/****************************************************************************************
 * @desc model层方法
 * 1.addPraise 文章的赞+1
 * 2.addCheck 查看次数+1
 ****************************************************************************************/

 articleSchema.statics.addCheck = function(_airId){
     this.update({"_id":_airId},function(err,fino){
         err && console.log(err);
     })
 }



var  article = mongoose.model("articles", articleSchema);
module.exports = article;