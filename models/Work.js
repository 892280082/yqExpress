/**
 * @desc 用户作品表
 * @author yq
 * @date 216/3/17
 * */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectid = require('objectid');

var fileSchema = new Schema({
    url:String,//路径
    name:String,
    introduce:String,
})

var workSchema = new Schema({
    title:String,//作品名称
    userId:Schema.Types.ObjectId,//用户ID
    $user:{},
    actId:Schema.Types.ObjectId,//活动ID
    $active:{},
    cate1:{},//类型1
    cate2:{},//类型2
    introduce:String,// 作品简介 *
    checkcounts:{ type:Number,default:0},//关注量 *
    likes:{ type:Number,default:0},//喜欢

    votes:[Schema.Types.ObjectId],//投票
    topno:{ type:Number,default:0},

    fileUrls:[fileSchema],

    creatTime:{type:Date,default:Date.now},//创建时间 *
    editTime:{type:Date,default:Date.now},//最后修改时间
})

var  Work = mongoose.model("works", workSchema);
module.exports = Work;