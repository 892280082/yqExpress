var Product = require('../models/demo/product.js');
var Photo = require('../models/demo/photo.js');
var Article = require('../models/demo/article.js');
var Connect = require('../models/demo/connect.js');
var then = require('thenjs');

var service = {};
//测试方法
service.getAuther = function(cb){
    cb({"auther":'yq'});
}


//根据thenjs库重写getAllDatas方法
service.getAllDatasByThen = function(callback){
    var deferParam = {
        "productDocs":null,
        "photoDocs":null,
        "articleDocs":null,
        "connectUs":null
    };
    then(function(defer){
        Product.find(null,{"typeArray.productArray":0},function(err,docs){
            deferParam.productDocs = docs;
            defer(err,deferParam);
        })
    })
        .then(function(defer,deferParam){
            Photo.find(null,function(err,docs){
                deferParam.photoDocs = docs;
                defer(err,deferParam);
            });
        })
        .then(function(defer,deferParam){
            Article.find(null,function(err,docs){
                deferParam.articleDocs = docs;
                defer(err,deferParam);
            });
        })
        .then(function(defer,deferParam){
            Connect.findOne(null,function(err,doc){
                deferParam.connectUs = doc;
                callback(err,deferParam);
            });
        })
        .fail(function(defer,err){
            console.log(err);
            callback(err);
        });
}

service.searchAllDatas = function(search,callback){
    var datas = {
        cateDatas:[], //分类数据 { _id,{ _id,cateName } }
        proDatas:[],	//产品数据 { product }
        airDatas:[],	//文章数据 { _id,airticle }
    }
    then(function(defer){
        Product.find(null,function(err,docs){
            docs.forEach(function(doc){
                doc.typeArray.forEach(function(cate){
                    if(!!~cate.cateName.indexOf(search)){
                        var tempCate = {
                            _id:cate._id,
                            cateName:cate.cateName
                        }
                        datas.cateDatas.push({
                            _id:doc._id,
                            cate:tempCate
                        });
                    }
                    cate.productArray.forEach(function(pro){
                        if(!!~pro.name.indexOf(search)){
                            pro._parentId = {
                                _id:doc._id,
                                _cateId:cate._id
                            }
                            datas.proDatas.push(pro);
                        }
                    });
                });
            });
            defer(err);
        })
    }).then(function(defer){
        Article.find(null,function(err,docs){
            docs.forEach(function(doc){
                doc.typeArray.forEach(function(air){
                    if(!!~air.title.indexOf(search)){
                        datas.airDatas.push({
                            "_id":doc._id,
                            "airticle":air
                        });
                    }
                });
            });
            callback(err,datas);
        });
    }).fail(function(defer,err){
        console.log(err);
        callback(err);
    });
}


module.exports = service;