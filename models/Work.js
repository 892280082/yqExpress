/**
 * @desc 用户作品表
 * @author yq
 * @date 216/3/17
 * */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectid = require('objectid');

var workSchema = new Schema({
    title:String,//作品名称
    userId:Schema.Types.ObjectId,//用户ID
    $user:{},
    actId:Schema.Types.ObjectId,//活动ID
    $active:{},
    cate1:{},//类型1
    cate2:{},//类型2
    introduce:String,// 作品简介 *
    creatTime:{type:Date,default:Date.now},//创建时间 *
    checkcounts:Number,//关注量 *
    likes:{ type:Number,default:0},//喜欢
    votes:[Schema.Types.ObjectId],//投票
    topno:{ type:Number,default:0},
    attachment:{    //附件
        url:String,//下载路径
        name:String//文件名
    },
    fileUrls:[String],
})

var  Work = mongoose.model("works", workSchema);
module.exports = Work;