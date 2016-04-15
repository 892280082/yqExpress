/**
 * @desc 回复对象
 * @author yq
 * @date 2016/3/15
/****************************************************************************************
 * @API model层方法
 * 1.pushReplay                     向评论添加回复
 * 2.pullReplay                     向评论删除回复
 * 3.addReplayPraise                用户赞回复
 * 4.addCommentPraise               用户赞评论
 * 5.saveComment                    添加评论，关联ariticle集合
 * 6.removeComment                  删除评论，关联ariticle集合
 * 7.getCommentByAirId              根据文章ID获取评论
 * 8.doCommentReport                评论的举报
 * 9.doReplayReport                 回复的举报
 ****************************************************************************************/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectid = require('objectid'),
    mongooseUtil = require("../util/mongooseUtil"),
    Ariticle = require('./Article');


var replaySchema = new Schema({
    toName:String,//被回复的昵称
    toUserId:Schema.Types.ObjectId,//被回复用户外键
    userName:String,//回复用户姓名
    _userId:Schema.Types.ObjectId,//回复用户外键
    headUrl:String,//回复用户头像
    content:String,//回复内容
    creatTime:{type:Date,default:Date.now},//回复时间
    praise:[{type:Schema.Types.ObjectId,unique:true,ref:'customs'}],//赞次数
    report:[{type:Schema.Types.ObjectId,unique:true,ref:'customs'}],//举报次数
})

/**
 * @desc 评论对象
 */
var commentSchema = new Schema({
    _articleId:Schema.Types.ObjectId,//文章外键
    _userId:Schema.Types.ObjectId,//评论用户外键
    userName:String,//评论用户姓名
    headUrl:String,//评论用户头像
    content:String,//评论内容
    creatTime:{type:Date,default:Date.now},//评论时间
    praise:[{type:Schema.Types.ObjectId,ref:'customs'}],//赞次数
    report:[{type:Schema.Types.ObjectId,ref:'customs'}],//举报次数
    replays:[replaySchema]//回复数组
})


/**
 * @desc 向评论添加回复
 * @param _ariId {Object} -m 文章ID
 * @param replay {Object} -m 回复对象
 * @param callback {Function} -m 回调函数
 */
commentSchema.statics.pushReplay = function(_ariId,replay,callback){
    this.update({
        "_id":_ariId
    },{
        "$push":{ "replays":replay }
    },function(err,info){
        err && console.log(err);
        callback(err,info);
    });
}

/**
 * @desc 向评论删除回复
 * @param _ariId {Object} -m 文章ID
 * @param _repId {Object} -m 回复对象ID
 * @param callback {Function} -m 回调函数
 */
commentSchema.statics.pullReplay = function(_ariId,_repId,callback){
    this.update({
        "_id":_ariId
    },{
        "$pull":{ "replays":{ "_id":_repId } }
    },function(err,info){
        err && console.log(err);
        callback(err);
    });
}

/**
 * @desc 回复的赞+1
 * @param _ariId {Object} -m 评论ID
 * @param _repId {Object} -m 回复ID
 * @param callback {Function} -m 回调函数
 */
commentSchema.statics.addReplayPraise = function(_commentId,_repId,_userId,callback){

    console.log("_commentId,_repId,",_commentId,_repId);

    this.update({
        "_id":_commentId,
        "replays._id":_repId,
    },{
        "$push":{"replays.$.praise":_userId}
    },function(err,info){
        err && console.log(err);
        callback(err,info);
    });
}

/**
 * @desc 评论的赞+1
 * @param _ariId {Object} -m 文章ID
 * @param callback {Function} - call(err,info)
 */
commentSchema.statics.addCommentPraise = function(_commentId,_userId,callback){
    this.update({
        "_id":_commentId,praise:{"$ne":_userId}
    },{
        "$push":{praise:_userId}
    },function(err,info){
        err && console.log(err);
        callback(err,info);
    });
}



/**
 * @desc saveComment 添加评论，关联ariticle集合
 * @param _airId {Object} -m 文章id
 * @param comment {Object} -m 评论对象
 * @param callback {Function} -m 回调函数
 */
commentSchema.statics.saveComment = function(_airId,comment,callback){
    var _repId = objectid();
    comment._id = _repId;
    this.save(comment,function(err){
        if(err){
            console.log(err);
            return callback(err);
        }else{
            Ariticle.update({"_id":_airId},{
                "$push":{ comments:objectid(_repId) }
            },function(err){
                err && console.log(err);
                callback(err);
            })
        }
    })

}

/**
 * @desc removeComment
 * @param _airId {Object} - 文章ID
 * @param _comId {Object} - 评论ID
 * @param callback {Function} - 回调函数
 */
commentSchema.statics.removeComment = function(_airId,_comId,callback){
    this.remove({"_id":_comId},function(err){
        if(err){
            console.log(err);
            return callback(err);
        }else{
            Ariticle.update({"_id":_airId},
                {"$pull":{ comments:objectid(_comId) }},
            function(err){
                err && console.log(err);
                return callback(err);
            })
        }
    })
}

/**
 * @desc 根据文章ID获取评论
 * @param _airId {Object} - 文章id
 * @param callback {Function} - 回调函数
 */
commentSchema.statics.getCommentByAirId = function(_airId,callback){
    this.find({"_id":_airId},function(err,docs){
        err && console.log(err);
        return callback(err,docs);
    })
}

/**
 * @param _commentId {String} 评论ID
 * @param _userId {String} 举报用户ID
 * @param callback {Function} -call(err)
 */
commentSchema.statics.doCommentReport = function(_commentId,_userId,callback){
    this.update({
        "_id":_commentId,report:{"$ne":_userId}
    },{
        "$push":{report:_userId}
    },function(err,info){
        if(err)
            console.log(err);
        callback(err,info);
    });
}

/**
 * @param _commentId {String} -评论ID
 * @param _replayId {String} - 回复ID
 * @param _userId {String} -用户ID
 * @param callback {Function} -call(err, info)
 */
commentSchema.statics.doReplayReport = function(_commentId,_replayId,_userId,callback){
    this.update({
        "_id":_commentId,
        "replays._id":_replayId,
    },{
        "$push":{"replays.$.report":_userId}
    },function(err,info){
        err && console.log(err);
        callback(err,info);
    });
}


var  articleComment = mongoose.model("articleComment", commentSchema);

module.exports = articleComment;
