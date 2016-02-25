/***
 * @desc  文章表
 * @date 2016/2/25
 * @auther yq
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectid = require('objectid');

var articleSchema = new Schema({
    _id:Schema.Types.ObjectId,//主键
    _userId:Schema.Types.ObjectId,//用户Id
    title:String,//用户标题
    checkcounts:Number,//查看次数
    collectcounts:Number,//收藏次数
    commentcounts:Number,//评论次数
    imgUrl:String,//首页列表图
    content:String,//文章内容
    creatTime:{type:Date,default:Date.now},//创建时间
    topno:Number,//展示在首页的顺序
    from:String,//来源
    isDelete:String,//是否被删除
    type:[],//文章类型
    introduce:String,//简介
    otherno:[],//作者其他推荐文章
    relationno:[],//相关文章推荐
    articlefrom:[],//文章来源 0-名人 1-造物志
    bannerno:Number,//模块Banner展示
    keyword:[],//关键字
    authorName:String,//作者
    bigimgurl:String,//首页banner
    coverimgurl:[],//列表的图片
    bannerurl:[],//列表的banner
    status:Number,// 作品 1-待审核 2-草稿
    sortno:Number,//排序
    attentionno:Number,//关注量
    reason:String//审核未通过原因
});

