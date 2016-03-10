var WebConfig = require("../models/WebConfig");
var Custom = require("../models/Custom");
var Article = require("../models/Article");
var Active = require("../models/Active");
var Product = require("../models/Product");
var _ = require("underscore");
var then = require("thenjs");

//首页数据
var indexData = {
    cache:false,
    "articles":{},
    "customs":{},
    "actives":{},
    "products":{},
    "banners":{},
};

//获取首页数据
exports.getIndexData = function(callback){
    then(function(next){ //获取名人
        Custom.find({
            "usertype":2
        }).sort({ topno:-1 }).limit(4).exec(function(err,docs){
            indexData.customs = docs;
            next(err);
        })
    }).then(function(next){//查询文章
        Article.find({
        }).sort({ topno:-1 }).limit(4).exec(function(err,docs){
            indexData.articles = docs;
            next(err);
        })
    }).then(function(next){//查询创品
        Product.find({
        }).sort({ topno:-1 }).limit(10).exec(function(err,docs){
            indexData.products = docs;
            next(err);
        })
    }).then(function(next){//查询活动
        Active.find({
        }).sort({ topno:-1 }).limit(3).exec(function(err,docs){
            indexData.actives = docs;
            next(err);
        })
    }).then(function(next){
        WebConfig.findOne(function(err,doc){
            if(err){
                next(err);
            }else{
                indexData.cache = true;
                indexData.banners = doc.banners;
                callback(null,indexData);
            }
        });
    }).fail(function(next,err){
        console.log("indexService - >getIndexData",err);
        callback(err);
    });
}

//清除首页数据缓存
exports.removeIndexCache = function(){
    indexData.cache = false;
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







