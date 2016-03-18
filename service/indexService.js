var WebConfig = require("../models/WebConfig");
var Custom = require("../models/Custom");
var Article = require("../models/Article");
var Active = require("../models/Active");
var Product = require("../models/Product");
var _ = require("underscore");
var then = require("thenjs");

/**
 * @desc 前台service
 * @author yq
 * @date 2016/3/14
 * @api
 * 1.getIndexData -获取首页数据 -call(err,data);
 * 2.getCusAllInfoByCusArray -通过用户的数组，查询用户的创品和文章共4个 -call(err,[用户信息])
 * */



//获取首页数据
exports.getIndexData = function(callback){
    var indexData = {
        cache:false,
        "articles":[],
        "customs":[],
        "actives":[],
        "products":[],
        "banners":[],
    };
    var webConfig = {};
    then(function(next){
        WebConfig.findOne(function(err,config){
            indexData.banners = config.banners;
            webConfig = config;
            next(err,webConfig);
        });
    }).then(function(defer){
        then.each(webConfig.customers,function(next,value){
            Custom.findOne({"_id":value.pojo._id},function(err,doc){
                indexData.customs.push(doc);
                next();
            })
        }).then(function(next){
            defer();
        })
    }).then(function(defer){
        then.each(webConfig.actives,function(next,value){
            Active.findOne({"_id":value.pojo._id},function(err,doc){
                indexData.actives.push(doc);
                next();
            })
        }).then(function(next){
            defer();
        })
    }).then(function(defer){
        then.each(webConfig.articles,function(next,value){
            Article.findOne({"_id":value.pojo._id},function(err,doc){
                indexData.articles.push(doc);
                next();
            })
        }).then(function(){
            defer();
        })
    }).then(function(){
        Product.find({}).sort({ topno:-1 }).limit(10)
        .exec(function(err,docs){
            indexData.products = docs;
            return callback(err,indexData);
        })
    }).fail(function(next,err){
        console.log("indexService - >getIndexData",err);
        callback(err);
    })
}

//清除首页数据缓存
exports.removeIndexCache = function(){
    // indexData = {
    //     cache:false,
    //     "articles":[],
    //     "customs":[],
    //     "actives":[],
    //     "products":[],
    //     "banners":[],
    // };
}

/**
 * @desc 通过用户的数组，查询用户的创品和文章共4个
 * @param cusArray {Array} -用户信息数组
 * @param callback {Function} -回调 callback('err',Array);
 */
exports.getCusAllInfoByCusArray = function(cusArray,callback){
    then.each(cusArray,function(next,cus){
        var searchLimit = 4 - cus.recommens.length;
        if(searchLimit){
            Product.find({
                status:true,
                _userId:cus._id
            }).sort({"topno":-1}).limit(searchLimit).exec(function(err,pros){
                err && defer(err);
                _.each(pros,function(ele){
                    cus.recommens.push({
                        "urlId":ele._id,
                        "picUrl":ele.imgBigUrl,
                        "type":1,
                    })
                })
                next();
            })
        }else{
            next();
        }
    }).each(cusArray,function(next,cus){
        var searchLimit = 4 - cus.recommens.length;
        if(searchLimit){
            Article.find({
                status:3,
                _userId:cus._id
            }).sort({"topno":-1}).limit(searchLimit).exec(function(err,articles){
                err && defer(err);
                _.each(articles,function(ele){
                    cus.recommens.push({
                        "urlId":ele._id,
                        "picUrl":ele.imgUrl,
                        "type":2,
                    })
                })
                next();
            })
        }else{
            next();
        }
    }).then(function(defer){
        return callback(null,cusArray);
    }).fail(function(defer,err){
        console.log(err);
        return callback(err);
    })
}







