var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectid = require('objectid');
//mongoose.connect("mongodb://localhost/zwzhetest");

/**
 * @desc 回复对象
 */
var replaySchema = new Schema({
    _id:Schema.Types.ObjectId,//主键
    _userId:Schema.Types.ObjectId,//回复用户外键
    userName:String,//回复用户姓名
    content:String,//回复内容
    creatTime:{type:Date,default:Date.now},//回复时间
    praiseCounts:Number,//赞次数
})

/**
 * @desc 评论对象
 */
var commentSchema = new Schema({
    _id:Schema.Types.ObjectId,//主键
    _articleId:Schema.Types.ObjectId,//文章外键
    _userId:Schema.Types.ObjectId,//评论用户外键
    userName:String,//评论用户姓名
    content:String,//评论内容
    creatTime:{type:Date,default:Date.now},//评论时间
    praiseCounts:{type:Number,default:0},//赞次数
    replays:[replaySchema],//回复数组
    testId:[]
})
var  articleComment = mongoose.model("articleComment", commentSchema);

module.exports = articleComment;
