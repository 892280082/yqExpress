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
    /***************基本信息****************/
    title:String,//活动名称 *
    cate1:{},//类型
    introduce:String,//简介 *
    keyword:[String],//活动关键字
    content:String,//内容 *
    bannerUrl:String,//banner图 *
    convertUrl:String,//封面图 *
    creatTime:{type:Date,default:Date.now},//创建时间 *
    status:Number,//0未开始 1进行中 2活动结束 *
    organize:String,//组织机构
    copyRight:String,//版权所有
    topno:{ type:Number,default:0},
    fileUrl:String,//活动附件
    attachment:{//附件
        url:String,//下载路径
        name:String//文件名
    },

    /***************上传作品要求****************/
    demand:{
        fileType:{type:String},//上传文件的类型
        fileSize:{type:Number,default:10},//单个文件大小限制
        fileMax:{type:Number,default:20},//上传图片的个数限制
        introduce:String,//特别要求
    },

    /***************** 状态信息 **************/
    actStartTime:Date,//活动开始结束时间
    actOverTime:Date,
    signStarTime:Date,//报名开始结束时间
    signOverTime:Date,
    address:String,//活动地址
    report:String,//活动播报

    /***************** 活动关注 **************/
    checkcounts:Number,//关注量 *
    likes:[Schema.Types.ObjectId],//喜欢
    votes:[Schema.Types.ObjectId],//投票
    collects:[Schema.Types.ObjectId],//报名

    /****************作品信息*****************/
    workCate:[],//作品分类
    workCount:{ type:Number,default:0},//作品数量
})

var  active = mongoose.model("actives", activeSchema);
module.exports = active;
