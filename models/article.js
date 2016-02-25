
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectid = require('objectid');
/***
 * @desc  文章对象
 * @date 2016/2/25
 * @auther yq
 */
var articleSchema = new Schema({
    /**
     * @desc 基本属性
     */
    _id:Schema.Types.ObjectId,//主键
    _userId:Schema.Types.ObjectId,//用户Id
    title:String,//用户标题
    type:[],//文章类型
    introduce:String,//简介
    creatTime:{type:Date,default:Date.now},//创建时间
    authorName:String,//作者
    keyword:[],//关键字
    status:Number,// 作品 1-待审核 2-草稿
    reason:String,//审核未通过原因
    content:String,//文章内容
    isDelete:String,//是否被删除
    checkcounts:Number,//查看次数
    collectcounts:Number,//收藏次数
    /**
     * @desc 特殊属性
     * */
    comments:[Schema.Types.ObjectId],//评论数组,储存评论_id
    imgUrl:String,//首页列表图
    topno:Number,//展示在首页的顺序
    from:String,//来源
    otherno:[],//作者其他推荐文章
    relationno:[],//相关文章推荐
    articlefrom:[],//文章来源 0-名人 1-造物志
    bannerno:Number,//模块Banner展示
    bigimgurl:String,//首页banner
    coverimgurl:[],//列表的图片
    bannerurl:[],//列表的banner
    sortno:Number,//排序
    attentionno:Number,//关注量
});

