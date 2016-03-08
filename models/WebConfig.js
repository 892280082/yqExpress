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


var banner = new Schema({
    _id:Schema.Types.ObjectId,
    title:String,//标题
    type:String,//类型
    url:String,//连接地址
    picUrl:String//图片路径
})

var webConfig = new Schema({
    banners:[banner]
})

var  webConfig = mongoose.model("webConfig", webConfig);
module.exports = webConfig;
