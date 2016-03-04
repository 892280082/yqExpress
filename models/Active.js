/****************************************************************************************
 * @desc 用户表
 * @date 2016/2/25
 * @auther yq
 *
 * @api model层
 * 1.validateUser 验证用户，使用md5算法 ok
 *
 * @api pojo层
 * 1.saveUser - 保存用户，并配置加密算法(md5)ok  -call('err',保存后的user对象)
 *
 * @_api
 * crptoUserPassword 加密用户密码
 ****************************************************************************************/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectid = require('objectid');

var activeSchema = new Schema({
    title:String,//活动名称 *
    type:[String],//创品类型 *
    introduce:String,//简介 *
    content:String,//内容 *
    bannerUrl:String,//banner图 *
    bannerno:Number,//在Banner模块展示的顺序
    convertUrl:String,//封面图 *
    converno:Number,//活动推荐顺序
    creatTime:{type:Date,default:Date.now},//创建时间 *
    status:Number,//0未开始 1进行中 2活动结束 *
    checkcounts:Number,//关注量 *
    likes:[Schema.Types.ObjectId],//喜欢
    votes:[Schema.Types.ObjectId],//投票
    collects:[Schema.Types.ObjectId],//收藏
    actStartTime:Date,//活动开始结束时间
    actOverTime:Date,
    signStarTime:Date,//报名开始结束时间
    signOverTime:Date,
})

var  active = mongoose.model("actives", activeSchema);
module.exports = active;
