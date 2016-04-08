/**
 * @desc 用户消息队列表
 * @author yq
 * @date 216/3/17
 * @API
 *
 *
 * */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongooseUtil = require("../util/mongooseUtil"),
    objectid = require('objectid');



/******************************************************************************************
cate:
 1.修改用户作品的分类消息，并给予提示“若有疑问，请联系造物者：contact@zwzhe.com
 2.


********************************************************************************************/

var MessageSchema = new Schema({
    user:Schema.Types.ObjectId,
    cate:Number,//消息类型




    creatTime:{type:Date,default:Date.now},//创建时间
})





var  Message = mongoose.model("Messages", MessageSchema);
module.exports = Message;