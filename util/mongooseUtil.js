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
    var pushObject = {};
    pushObject[collecname]=parentId;

    if(!childCollection) {
        then(function(next){
            childDao.remove({
                "_id": childId
            },function(err){
                next(err);
            })
        }).then(function(next){
            _this.update({"_id": parentId}, {
                "$pull": pushObject
            }, function (err) {
                err && console.log(err);
                callback(err);
            })
        }).fail(function(next,err){
            console.log(err);
            return callback(err);
        })
    }else{
        var pushChildObject = {};
        pushChildObject[childCollection] = childId;
        then(function(next){
            childDao.update({"_id":childId},
                {"$pull":pushChildObject},
                function(err){
                    next(err);
                })
        }).then(function(next){
            _this.update({"_id": parentId}, {
                "$pull": pushObject
            }, function (err) {
                err && console.log(err);
                callback(err);
            })
        }).fail(function(next,err){
            console.log(err);
            return callback(err);
        })
    }
}