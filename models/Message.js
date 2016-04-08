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
cate key info:
1    a   .管理员修改用户作品的分类消息，并给予提示“若有疑问，请联系造物者：contact@zwzhe.com”；
2    b   .管理员审核用户的作品消息，并给予提示“若有疑问，请联系造物者：contact@zwzhe.com”；
3    c   .管理员删除了用户作品的消息，并给予提示“若有疑问，请联系造物者：contact@zwzhe.com”;
4    d   .管理员删除了用户的非法评论，并给予提示;
5    e   .其他用户对我发表文章的评论;
6    f   .对我发表帖子的评论;
7    g   .对我发表作品的评论（目前不实现;
8    h   .对我评论的回复;
9    i   .对我所有的赞;
 ********************************************************************************************/
var a = new Schema({ //修改分类
    workName:String,//作品名
    oldCateName:String,//老的分类名
    newCateName:String,//新的分类名
})

var workAndActive = new Schema({ //审核作品
    actiiveName:String,//活动名
    activeId:Schema.Types.ObjectId,//活动ID
    workName:String,//作品名
    workId:String,//作品ID
})

var userAndComment = new Schema({


})


var MessageSchema = new Schema({
    a:a,
    b:workAndActive,
    c:workAndActive,
    user:Schema.Types.ObjectId,
    cate:Number,//消息类型
    extend:String,//扩展
    state:Number,//是否查看过了 1 看过 0 未看过
    prix:String,//后缀
    creatTime:{type:Date,default:Date.now},//创建时间
})



var  Message = mongoose.model("Messages", MessageSchema);
module.exports = Message;