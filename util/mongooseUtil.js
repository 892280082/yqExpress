var objectid = require("objectid"),
    _ = require('underscore'),
    then = require("thenjs");
/**
 * @desc mongoose 工具
 * @date 2016/2/25
 * @auther yq
 *
 * @api
 * 1.createShell  -指令生成器
 * 2.addInnerCollection  -父类的子集合添加子对象的Id,子对象在新集合中创建。-call('err','子类添加的pojo对象');
 * 3.removeInnerCollection -addInnerCollection的逆方法，同时删除在父对象中的子集合id和子集合中的对象
 * 4.dealAllCollectionId -处理子父间的集合关系
 * 5.saveSingle -保存单个Pojo
 * 6.removeSingleById -通过ID删除单个POJO
 * 7.updateSingleById -通过ID更新单个POJO
 * 8.pagination -分页工具
 * 9.increateProtoById model一个属性的增加和减少 -call('err');
 * 10.pushInnerCollectionById 像model的内部集合推送对象 -call(err,info);
 * 11.pushInnerCollectionById 像model的内部集合删除对象 -call(err,info);
 * 12.contains 判断数组中是否有指定的object -call(Boolean)
 * 13.converIdsArray -将ObjectId数组转换成对象数组
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
 * @param callback {Function} - call('err',{保存后的对象})
 */
exports.saveSingle = function(pojo,Dao,callback){
    var newPojo = new Dao(pojo);
    newPojo.save(function(err){
        callback(err,newPojo);
    })
}

/**
 * @desc 删除单个信息
 * @param _id {String} -m id
 * @param Dao {Object} - mongoose model
 * @param callback - 回调函数 call{total:'共有多少条记录',docs:'查询的结果集合'}
 */
exports.removeSingleById = function(_id,Dao,callback){
    if(!_.isString(_id))
        callback('_id type error');
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
        return callback('mongooseUtil->updateSingleById ERRIR: no id param  ');
    if(!_.isString(pojo._id))
        return callback('mongooseUtil->updateSingleById ERRIR:  id type Error');
    var _id = pojo._id;
    delete  pojo._id;
    Dao.update({"_id":_id},pojo,function(err,info){
        err && console.log(err);
        return callback(err,info);
    })
}

/**
 * @desc mongoose 分页工具
 * @param params {{ query:Object,skip:Number?,limit:Number?,model:Object,sort:Object }}
 * @param callback -回调函数  callback{total:'查询的数量',docs:'查询的文档集合','skip':'跳过多少页','limit':'限制分页条数'}
 * @example
     var serachPojo = { title:"tit", type:"地方"}
     var mongooseUtil = require('../util/mongooseUtil');
     var condition = {'title':{$regex: serachPojo.title, $options:'i'}}
     mongooseUtil.pagination({
        query:condition,
        model:product,
        limit:2
    },function(err,result){
        console.log(result);
    })
 */
exports.pagination = function(params,callback){
    var model = params.model;
    if(!model)
        callback('mongooseUtil ->pagination :   no set Dao');

    var condition = params.query || {},
        skip = params.skip || 0,
        limit = params.limit || 200,
        sort = params.sort || {'_id':-1};

    var query = model.find({});
    _.mapObject(condition,function(value,key){
        query.where(key,value);
    });

    query.skip(skip);
    query.limit(limit);
    query.sort(sort);

    then(function(next){
        query.exec(function (err, docs) {
            next(err,docs);
        });
    }).then(function(next,docs){
        query.limit(0);
        query.count().exec(function(err,length){
            return callback(err,{
                total:length,
                docs:docs,
                skip:skip,
                limit:limit
            })
        });
    }).fail(function(next,err){
        err && console.log(err);
        return callback('mongooseUtil ->pagination :   search Dao fail');
    })
}

/**
 * @param _id {String} -id
 * @param dao {Object} -model对象
 * @param prototype {String} -属性
 * @param callback {Function} - 回调函数
 * @param number {Number?} -增加的大小
 */
exports.increateProtoById = function(_id,dao,prototype,callback,number){
    var shell = {};
    shell[prototype]=1;
    dao.update({"_id":_id},{$inc:shell},function(err){
        err && console.log(err);
        callback(err);
    });
}

/**
 * @param _id {String} -id
 * @param Dao {Object} -model
 * @param innerCollec {String} -内部集合名
 * @param pojo {Object} -需要push的对象
 * @param callback {Function} -回掉函数
 */
exports.pushInnerCollectionById = function(_id,Dao,innerCollec,pojo,callback){
    var shell = exports.createShell("$push",innerCollec,pojo);
    Dao.update({"_id":_id},shell,function(err,info){
        if(err){
            console.log("mongooseUtil->pushInnerCollectionById:",err);
        }
        return callback(err,info);
    })
}

exports.pullInnerCollectionById = function(_id,Dao,innerCollec,pojo,callback){
    var shell = exports.createShell("$pull",innerCollec,pojo);
    Dao.update({"_id":_id},shell,function(err,info){
        if(err){
            console.log("mongooseUtil->pushInnerCollectionById:",err);
        }
        return callback(err,info);
    })
}

/**
 * @param idArray {Array} -id数组
 * @param targetId -{String} -目标ID
 * @returns {boolean}
 */
exports.contains = function(idArray,targetId){
   return !! _.find(idArray,function(ele){
       return ele == targetId;
   })
}


exports.converIdsArray = function(array,Dao,callback){
    var results = [];
    then.each(array,function(ele){
        Dao.findOne()

    })



}











