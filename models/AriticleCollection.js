/***
 * @desc  文章收藏集合
 * @date 2016/2/25
 * @auther yq
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectid = require('objectid');

var articleCollectionSchema = new Schema({
    _id:Schema.Types.ObjectId,
    _userId:Schema.Types.ObjectId,//用户id
    _ariId:Schema.Types.ObjectId,//文章id
    createTime:{type:Date,default:Date.now}//创建时间
})

/****************************************************************************************
 * @desc model层方法
 * 1.addRecord 增加一条记录
 * 2.removeRecord 删除一条记录
 ****************************************************************************************/

/**
 * @desc 增加一条记录
 * @param _userId {Object} - 用户ID
 * @param _ariId {Object} - 文章Id
 */
articleCollectionSchema.statics.addRecord = function(_userId,_ariId){
    var savePojo = {
        "_id":objectid(),
        "_userId":objectid(_userId),
        "_ariId":objectid(_ariId)
    }
    this.save(savePojo,function(err){
        err && console.log(err);
    })
}

/**
 * @desc 删除一条记录
 * @param _userId {Object} - 用户ID
 * @param _ariId {Object} - 文章Id
 */
articleCollectionSchema.statics.removeRecord = function(_userId,_ariId){
    this.remove({
        "_userId":_userId,
        "_ariId":_ariId
    },function(err){
        err && console.log(err);
    })
}

var Collection = mongoose.model("articleCollection", articleCollectionSchema);

module.exports = Collection;
