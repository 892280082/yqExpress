/***
 * @desc 用户表
 * @date 2016/2/25
 * @auther yq
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectid = require('objectid');

var customSchema = new Schema({
    _id:Schema.Types.ObjectId,//主键
    job:String,//用户职业
    followerCounts:Number,//粉丝数量
    productionCounts:Number,//作品数量
    password:String,//密码
    introduce:String,//用户介绍
    email:String,//邮件
    postAddress:String,//邮编
    realName:String,//真实姓名
    provice:String,//省份
    city:String,//城市
    phoneNumber:String,//联系方式
    ability:String,//能力标签
    creatTime:{type:Date,default:Date.now},//添加时间
    topno:Number,//首页baner顺序
    imgurl:String,//图像
    usertype:Number,//用户身份 0->普通用户 1->管理员 2->人物
    focusno:Number,//人物聚焦
    bannerno:Number,//模块Banner展示
    sex:Number,//性别 0男1女
    bigimgurl:String,//大图
    coverimgurl:String,//封面url
    birthday:{type:Date,default:null},//生日
    educational:String,//学历
    qq:String,//QQ
    weibo:String,//微博
    detailAddress:String,//详细地址
    bannerurl:String,//
    sortno:Number,//排序
    attentionno:Number,//关注量
});