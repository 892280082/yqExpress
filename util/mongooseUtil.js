var objectid = require("objectid"),
    then = require("thenjs");

/**
 * @desc 指令生成器
 * @param shell {String} -m 指令
 * @param collecname {String} - 集合名
 * @param pojo {Object} - 对象
 * @returns {Object}
 */
function createShell(shell,collecname,pojo){
    var innerShell = {};
    innerShell[collecname] = pojo;
    var outShell = {};
    outShell[shell] = innerShell;
    return outShell;
}

/**
 * @desc 父类的子集合添加子对象的Id,子对象在新集合中创建。
 * @param option {{
     parentId:String,
     collecname:String,
     childPojo:Object,
     childDao:Object,
     callback:Function
   }} - 参数
 * @param _this {Object} - mongoose的statics函数this
 * @example
 * customSchema={
 *  articles:[Shema.Types.Objectid]
 * }
 * ArticleSchema={
 *
 * }
 * customSchema.statics.pushAriticle = function(_cusId,article,callback){
    if(!article._userId)
        return callback("article._userId 不能为空");
    mongooseUtil.addInnerCollection({
        parentId:_cusId,
        collecname:"articles",
        childPojo:article,
        childDao:Article,
        callback:callback
    },this);
}
 *
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


/**
 * @desc addInnerCollection的逆方法，同事删除在父对象中的子集合id和子集合中的对象
 * @param option {{ parentId:String,
      childId:String,
      childDao:Object,
      collecname:String,
      childCollection:String?,
      callback:Function}} - 参数
 * @param _this {Object} - mongoose的statics函数this
 * @example
 *
 mongooseUtil.removeInnerCollection({
        "parentId":_cusId,
        "childId":_ariId,
        "childDao":Article,
        "collecname":"articles",
        "callback":callback
    },this);
 }
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
 * @desc 处理子父间的集合关系
 * @param option {{
        parentId:String,
        collecname:String,
        childId:String,
        childDao:Object,
        childCollecname:String,
        callback:Function,
        parentPojo:Object?,
        childPojo:Object?
        }} - 选项
 * @param _this
 */
exports.dealAllCollectionId = function(option,_this){
    var parentId = option.parentId,
        collecname =  option.collecname,
        childId = option.childId,
        childDao = option.childDao,
        childCollecname = option.childCollecname,
        callback = option.callback;

    var parentPojo = option.parentPojo || parentId;
    var childPojo = option.childPojo || childId;

    var parentShell = {};
    var childShell = {};
    if(collecname.indexOf("-") == 0){
        parentShell = createShell("$pull",collecname.slice(1),parentPojo);
    }else{
        parentShell = createShell("$push",collecname,parentPojo);
    }
    if(childCollecname.indexOf("-") == 0){
        childShell = createShell("$pull",childCollecname.slice(1),childPojo);
    }else{
        childShell = createShell("$push",childCollecname,childPojo);
    }

    then(function(next){
        _this.update({"_id":parentId},parentShell,function(err){
            next(err);
        })
    }).then(function(){
        childDao.update({"_id":childId},childShell,function(err){
            err && console.log(err);
            return callback(err);
        });
    }).fail(function(next,err){
        console.log(err);
        return callback(err);
    })
}

