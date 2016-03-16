/****************************************************************************************
 * @desc 分类表
 * @date 2016/2/25
 * @auther yq
 ****************************************************************************************/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectid = require('objectid');

var banner = new Schema({
    _id:Schema.Types.ObjectId,
    title:String,//标题
    type:String,//类型
    url:String,//连接地址
    picUrl:String//图片路径
})

var thirdCate = {
    cateId:Number,
    cateName:String,
    subCate:[],
};

var webConfig = new Schema({

    banners:[banner],//首页banner图片

    articles:[banner],//首页文章推荐

    customers:[banner],//首页用户推荐

    products:[banner],//首页产品推荐

    articleCates:[],//文章类型

    articleKeys:[String],//关键字类型

    productCates:[thirdCate],//产品类型

    activeCates:[],//活动类型

    customerCates:[],//任务类型

})

var  webConfig = mongoose.model("webConfig", webConfig);
module.exports = webConfig;
