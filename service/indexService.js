var WebConfig = require("../models/WebConfig");
var Custom = require("../models/Custom");
var Article = require("../models/Article");
var Active = require("../models/Active");
var Product = require("../models/Product1");
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








