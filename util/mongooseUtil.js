var objectid = require("objectid"),
    then = require("thenjs");
/**
 * @desc mongoose 工具
 * @date 2016/2/25
 * @auther yq
 *
 * @api
 * 1.createShell  -指令生成器
 * 2.addInnerCollection  -父类的子集合添加子对象的Id,子对象在新集合中创建。
 * 3.removeInnerCollection -addInnerCollection的逆方法，同时删除在父对象中的子集合id和子集合中的对象
 * 4.dealAllCollectionId -处理子父间的集合关系
 * 5.saveSingle -保存单个Pojo
 * 6.removeSingleById -通过ID删除单个POJO
 * 7.updateSingleById -通过ID更新单个POJO
 */


/**
 * @desc 指令生成器
 * @param shell {String} -m 指令
 * @param collecname {String} - 集合名
 * @param pojo {Object} - 对象
 * @returns {Object}
 * @example
 * createShell("$update",'articles',{do:"aa"})
 * return {"$update":{ "articles":{ do:"aa "}}}
 * @needUpdate $update 可以加-$update
 */
exports.createShell = function(shell,collecname,pojo){
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

        then(function(next){
            childPojo = new childDao(childPojo);
            childPojo.save(function(err){
                next(err,childPojo._id);
            })
        }).then(function(next,_id){
            pushObject[collecname]=_id;
            _this.update({"_id":parentId},{
                "$push":pushObject
            },function(err,info){
                err && console.log(err);
                return callback(err,childPojo);
            })
        }).fail(function(next,err){
            console.log(err);
            return callback('保存失败');
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
    pullObject[collecname]=childId;

    if(!childCollection) { //直接删除子类
        then(function(next){
            childDao.remove({
                "_id": childId
            },function(err){
                next(err);
            })
        }).then(function(next){
            console.log("mongooseUTil 136",pullObject);

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
    }else{  //在子类的集合中删除对象
        var pullChildObject = {};
        pullChildObject[childCollection] = childId;
        console.log("mongooseUtil 149",pullChildObject);
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
        parentShell = exports.createShell("$pull",collecname.slice(1),parentPojo);
    }else{
        parentShell = exports.createShell("$push",collecname,parentPojo);
    }
    if(childCollecname.indexOf("-") == 0){
        childShell = exports.createShell("$pull",childCollecname.slice(1),childPojo);
    }else{
        childShell = exports.createShell("$push",childCollecname,childPojo);
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

/**
 * @desc 保存单个信息
 * @param pojo {Object} - 保存对象
 * @param Dao {Object} - 保存Dao
 * @param callback {Function} - 回调函数
 */
exports.saveSingle = function(pojo,Dao,callback){
    var newPojo = new Dao(pojo);
    newPojo.save(function(err){
        callback(err);
    })
}

/**
 * @desc 删除单个信息
 * @param _id {String} -m id
 * @param Dao {Object} - mongoose model
 * @param callback {Function} 回调函数
 */
exports.removeSingleById = function(_id,Dao,callback){
    Dao.remove({"_id":_id},function(err,info){
        callback(err,info);
    })
}

/**
 * @desc 更新单个信息
 * @param pojo {Object} - 更新对象
 * @param Dao {Object} - mongoose model
 * @param callback {Function} 回调函数
 */
exports.updateSingleById = function(pojo,Dao,callback){
    if(!pojo._id)
        return callback('mongooseUtil->updateSingleById ERRIR: no id param ');
    var _id = pojo._id;
    delete  pojo._id;
    Dao.update({"_id":_id},pojo,function(err,info){
        return callback(err,info);
    })
}