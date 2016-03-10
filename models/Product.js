/***
 * @desc  创品表
 * @date 2016/2/25
 * @auther yq
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    _userId:Schema.Types.ObjectId,//用户Id
    title:String,//产品名称
    price:Number,//价格
    imgUrl:String,//封面url
    imgBigUrl:String,//首页大图
    introduce:String,//简介
    guige:String,//规格
    detailimgarr:String,//详情页banner URL 集合，逗号隔开
    bannerurl:String,//
    converturl:String,//
    taobaoUrl:String,//淘宝商品url
    creatTime:{type:Date,default:Date.now},//创建时间
    type:[],//创品类型
    kucun:Number,//库存
    topno:{ type:Number,default:0},//在首页的顺序
    bannerno:Number,//模块Banner展示
    attentionno:Number,//关注量
    status:Boolean,//创品状态 true 上架中 false 已下架
    //冗余字段
    _userName:String,//用户姓名
})

var  product = mongoose.model("products", productSchema);
module.exports = product;
