/**
 * @desc 用户作品表
 * @author yq
 * @date 216/3/17
 * @API
 * 1.删除作品
 *
 *
 *
 * */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongooseUtil = require("../util/mongooseUtil"),
    objectid = require('objectid');

var fileSchema = new Schema({
    url:String,//路径
    name:String,//文件名
    introduce:String,//介绍
    state:String,//状态
})

var workSchema = new Schema({
    title:String,//作品名称

    in:{type:Number,default:0},//是否含有作品 0没有 1有

    userId:Schema.Types.ObjectId,//用户ID
    actId:Schema.Types.ObjectId,//活动ID

    userName:String,//用户名
    activeName:String,//活动名

    form:{//报名表信息
        name: String,//真实姓名
        tel: String,//联系方式
        email: String,//邮箱
        address: String,//地址
        unit: String,//工作单位
    },

    cate1:{},//类型1
    cate2:{},//类型2

    introduce:String,// 作品简介 *
    checkcounts:{ type:Number,default:0},//关注量

    votes:[Schema.Types.ObjectId],//投票
    topno:{ type:Number,default:0},//排序

    fileUrls:[fileSchema],

    creatTime:{type:Date,default:Date.now},//创建时间
    editTime:{type:Date,default:Date.now},//最后修改时间

    state:{type:Number,default:0},//状态 0未通过 1通过

    /**非持久化对象*/
    $user:{},//用户对象
    $active:{},//活动对象
})





var  Work = mongoose.model("works", workSchema);
module.exports = Work;