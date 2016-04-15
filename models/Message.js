/**
 * @desc 用户消息队列表
 * @author yq
 * @date 216/3/17
 * @API
 *
 *
 * */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongooseUtil = require("../util/mongooseUtil"),
    objectid = require('objectid');
/*********************************************表规范*******************************************
cate/key    info:
a           .管理员修改用户作品的分类消息，并给予提示“若有疑问，请联系造物者：contact@zwzhe.com”; [完成]
b           .管理员审核用户的作品消息，并给予提示“若有疑问，请联系造物者：contact@zwzhe.com”;    [完成]
c           .管理员删除了用户作品的消息，并给予提示“若有疑问，请联系造物者：contact@zwzhe.com”;  [完成]
d           .管理员删除了用户的非法评论，并给予提示;
e           .其他用户对我发表文章的评论;  @example userId用户 在articleId文章 评论内容content           [完成]
f           .其他用户对我评论的赞  @example userId用户 | 在articleId文章 | 赞了你的评论 评论内容:content      [完成]
g           .其他用户对我评论的举报 @example userId用户 | 在articleId文章 | 举报了你的评论 | 评论内容："XXXXX" [完成]
h           .其他用户对我二级评论的回复 @example userId用户 | 在articleId文章 | 对您commentId评论的内容进行了回复:content | 回复内容:replay | 点击回复 [完成]
i           .其他用户对我二级回复的赞 @example  userId用户 | 在articleId文章 | 对您的回复:replay | 点了一个赞!
j           .其他用户对我二级回复的举报 @example userId用户 | 在articleId文章 | 对您的回复:replay | 进行了举报

            .对我发表作品的评论（目前不实现;
            .对我评论的回复;
            .对我所有的赞;
 ********************************************************************************************/
var changeWorkCate = new Schema({//修改分类
    workId:{type:Schema.Types.ObjectId,ref:'works'},
    oldCateName:String,//老的分类名 a
    newCateName:String,//新的分类名 a
})

var workAndActive = new Schema({//审核作品
    activeId:{type:Schema.Types.ObjectId,ref:'actives'},//活动ID bc
    workName:String,//作品名 bc
    workId:{type:Schema.Types.ObjectId,ref:'works'},//作品ID bc
})

var articleAndComment = new Schema({
    articleId:{type:Schema.Types.ObjectId,ref:'articles'},//文章ID efhgij
    content:String,//评论内容 efh
    userId:{type:Schema.Types.ObjectId,ref:'customs'},//用户ID efhij
    replay:String,//回复内容 hij
    commentId:{type:Schema.Types.ObjectId,ref:'articleComment'},//评论ID efh
})

var MessageSchema = new Schema({
    a:changeWorkCate,
    b:workAndActive,
    c:workAndActive,
    e:articleAndComment,
    d:articleAndComment,
    h:articleAndComment,
    i:articleAndComment,

    user:{type:Schema.Types.ObjectId,ref:'customs'},
    cate:String,
    msg:String,//追加提醒
    prix:String,//后缀

    state:{type:Number,default:0},//是否查看过了 1 看过 0 未看过
    creatTime:{type:Date,default:Date.now},//创建时间
})

var  Message = mongoose.model("Messages", MessageSchema);
module.exports = Message;