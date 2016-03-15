/**
 * @desc 前台中间件
 * @author yq
 * @date 2016/3/14
 *
 * @API
 * 1. increaPojoById -----------------增加文章的查看次数
 * 2. addRandomArt ---------------随机选取数据
 * 3. getComment -----------------获取评论
 *
 * */
var Article = require("../../models/Article");
var _ = require("underscore");


/**
 * @param Dao {Object} -model对象
 * @param proName {String} -属性名
 */
exports.increaPojoById = function(Dao,proName){
    return function(req,res,next){
        var shell = {};
        shell[proName]=1;
        Dao.update({"_id":req.params._id},{$inc:shell},function(err){
            err && console.log(err);
        });
        next();
    }
}

/**
 * @param Dao {Object} -model对象
 * @param condition {Object} -条件
 * @param sort {Object} -条件
 * @param number {Number?} 数字
 * @returns {Function} -callback(Function)
 */
exports.addRandomArt = function(Dao,condition,sort,number){
    return function(req,res,next){
        number = number || 3;
        Dao.find(condition).sort(sort).limit(30).exec(function(err,docs){
            docs = _.shuffle(docs);
            res.locals.$randomData = docs.splice(0,number);
            next();
        })
    }
}