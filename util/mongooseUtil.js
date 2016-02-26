var objectid = require("objectid"),
    then = require("thenjs");
/**
 * @param option {{ parentId:String,
      childId:String,
      childDao:Object,
      collecname:String,
      childCollection:String?,
      callback:Function}} - 参数
 * @param _this {Object} - mongoose的statics函数this
 */
exports.removeInnerCollection =  function(option,_this){
    //获取参数
    var parentId = objectid(option.parentId),
        childId = objectid(option.childId),
        childDao = option.childDao,
        collecname = option.collecname,
        childCollection = option.childCollection,
        callback = option.callback;
    var pullObject = {};
    pullObject[collecname]=parentId;

    if(!childCollection) { //直接删除子类
        then(function(next){
            childDao.remove({
                "_id": childId
            },function(err){
                next(err);
            })
        }).then(function(next){
            _this.update({"_id": parentId}, {
                "$pull": pullObject
            }, function (err) {
                err && console.log(err);
                callback(err);
            })
        }).fail(function(next,err){
            console.log(err);
            return callback(err);
        })
    }else{  //在子类的collection中删除对象
        var pullChildObject = {};
        pullChildObject[childCollection] = childId;
        then(function(next){
            childDao.update({"_id":childId},
                {"$pull":pullChildObject},
                function(err){
                    next(err);
                })
        }).then(function(next){
            _this.update({"_id": parentId}, {
                "$pull": pullObject
            }, function (err,info) {
                err && console.log(err);
                callback(err,info);
            })
        }).fail(function(next,err){
            console.log(err);
            return callback(err);
        })
    }
}

/**
 * @param option {{
     parentId:String,
     collecname:String,
     childPojo:Object,
     childDao:Object,
     callback:Function
   }} - 参数
 * @param _this {Object} - mongoose的statics函数this
 */
exports.addInnerCollection =  function(option,_this){
    var parentId = option.parentId,
        childDao = option.childDao,
        childPojo = option.childPojo,
        callback = option.callback,
        collecname =  option.collecname;

        var pushObject = {};
        pushObject[collecname]=parentId;

        then(function(next){
            childPojo = new childDao(childPojo);
            childPojo.save(function(err){
                next(err,childPojo._id);
            })
        }).then(function(next,_id){
            _this.update({"_id":parentId},{
                "$push":pushObject
            },function(err,info){
                err && console.log(err);
                return callback(err,_id);
            })
        }).fail(function(next,err){
            console.log(err);
            return callback(err);
        })
}
