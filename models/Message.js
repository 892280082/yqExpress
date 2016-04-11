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
a           .管理员修改用户作品的分类消息，并给予提示“若有疑问，请联系造物者：contact@zwzhe.com”；
b           .管理员审核用户的作品消息，并给予提示“若有疑问，请联系造物者：contact@zwzhe.com”；
c           .管理员删除了用户作品的消息，并给予提示“若有疑问，请联系造物者：contact@zwzhe.com”;
d           .管理员删除了用户的非法评论，并给予提示;
e           .其他用户对我发表文章的评论;
f           .对我发表帖子的评论;
g           .对我发表作品的评论（目前不实现;
h           .对我评论的回复;
l           .对我所有的赞;
 ********************************************************************************************/
var changeWorkCate = new Schema({//修改分类
    workId:{type:Schema.Types.ObjectId,ref:'works'},
    oldCateName:String,//老的分类名 a
    newCateName:String,//新的分类名 a
})

var workAndActive = new Schema({//审核作品
    actiiveName:String,//活动名 bc
    activeId:{type:Schema.Types.ObjectId,ref:'actives'},//活动ID bc
    workName:String,//作品名 bc
    workId:{type:Schema.Types.ObjectId,ref:'works'},//作品ID bc
})

var articleAndComment = new Schema({
    articleId:{type:Schema.Types.ObjectId,ref:'articles'},//文章ID e
    articleName:String,//文章名 e
    content:String,//评论内容 e
    userName:String,//用户姓名 h
    userId:{type:Schema.Types.ObjectId,ref:'customs'},//用户ID h
    replay:String,//回复内容 h
})

var MessageSchema = new Schema({
    a:changeWorkCate,
    b:workAndActive,
    c:workAndActive,
    d:articleAndComment,
    h:articleAndComment,

    user:{type:Schema.Types.ObjectId,ref:'customs'},
    cate:String,
    msg:String,//追加提醒
    prix:String,//后缀

    state:{type:Number,default:0},//是否查看过了 1 看过 0 未看过
    creatTime:{type:Date,default:Date.now},//创建时间
})

var  Message = mongoose.model("Messages", MessageSchema);
module.exports = Message;