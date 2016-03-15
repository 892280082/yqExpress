/**
 * @desc 测试用户model的API
 * @API
 * 1."pushAriticle","用来保存文章";
 * 2."pullAriticle","用来删除文章";
 * 3."pushAttentions","关注用户";
 * 4."pullAttentions","取消关注用户";
 * 5."saveUser","保存用户的操作";
 * 6."validateUser","验证用户登陆";
 * 7."pushProduct","保存用户的创品";
 * 8."pullProduct","删除用户的创品";
 */
    var custom = require("../models/Custom"),
        debug = require("../util/debug")("customTest"),
      Article = require("../models/Article"),
          then= require('thenjs'),
     objectid = require('objectid');
    var _ = require('underscore');




    debug.set("pushAriticle","用来保存文章");
    debug.set("pullAriticle","用来删除文章");
    (function(){
        var cusId = objectid();
        then(function(next){
            var cus = new custom({_id:cusId,name:"haha"});
            cus.save(function(err){
                next(err);
            })
        }).then(function (next) {   //保存文章

            var ariticle = {
                "title": "新的文件夹123",
            }
            ariticle._userId = cusId;
            custom.pushAriticle(cusId, ariticle, function (err, childId) {
                next(err, childId);
            })
        }).then(function (next, childId) { //通过用户id和文章id
            Article.findOne({
                    "_userId":cusId,
                    "_id": childId
                },
                function (err, doc) {
                    doc ? debug.done("pushAriticle")
                        : debug.done("pushAriticle",err);
                    next(err, doc);
                })
        }).then(function (next, doc) {
            custom.pullAriticle(
                cusId,
                doc._id,
                function (err) {
                    !err ? debug.done("pullAriticle")
                        : debug.done("pullAriticle",err);
                }
            )
        }).fail(function (next, err) {
            debug.done("pullAriticle",err);
            debug.done("pushAriticle",err);
        })
    })();


    debug.set("pushAttentions","关注用户");
    debug.set("pullAttentions","取消关注用户");
    (function(){
        var cus1 = new custom({name:"小张1","_id":objectid()});
        var cus2 = new custom({name:"小王1","_id":objectid()});
        then(function(next){
            cus1.save(function(err){
                next(err);
            })
        }).then(function(next){
            cus2.save(function(err){
                next(err);
            })
        }).then(function(next){
            custom.pushAttentions(cus1._id,cus2._id,function(err){
                err ? debug.done("pushAttentions",err)
                    : debug.done("pushAttentions");
                next(err);
            })
        }).then(function(next){
            custom.pullAttentions(cus1._id,cus2._id,function(err){
                err ? debug.done("pullAttentions",err)
                    : debug.done("pullAttentions");
                next(null);
            })
        }).fail(function(next,err){
            debug.done("pushAttentions",err);
            debug.done("pullAttentions",err);
        })
    })();

debug.set("saveUser","保存用户的操作").set("validateUser","验证用户登陆");
(function(){
    then(function(next){
        var name = "sdfsdf"+(Math.random()*100000);
        var cus = new custom({ "name":name,password:"123abc" });
        cus.saveUser(function(err){
            !err && debug.done("saveUser");
            next(err,cus);
        })
    }).then(function(next,cus){
        custom.validateUser(cus.name,cus.password,function(err,doc){
            if(!err){
                if(doc) {
                    if (doc.name == cus.name) {
                        debug.done("validateUser");
                    } else {
                        debug.done("validateUser", "用户查找的结果不对");
                    }
                }else{
                    debug.done("validateUser","找不到用户");
                }
            }else{
                debug.done("validateUser",err);
            }
        })
    }).fail(function(next,err){
        debug.done("saveUser",err);
        debug.done("validateUser",err);
    })
})()

debug.set("pushProduct","保存用户的创品");
debug.set("pullProduct","删除用户的创品");
(function(){
    var cusId = objectid();
    then(function(next){
        var cus = new custom({_id:cusId,name:"hahaaaaa"+Math.random()*10000});
        cus.saveUser(function(err){
            next(err);
        })
    }).then(function (next) {   //保存文章
        var product = {
            "title": "测试的产品",
        }
        product._userId = cusId;
        custom.pushAriticle(cusId, product, function (err, childPojo) {
            !err&&debug.done("pushProduct");
            next(err,childPojo);
        })
    }).then(function(next,childPojo){
        custom.pullAriticle(cusId,childPojo._id,function(err){
            !err ? debug.done("pullProduct")
                 : debug.done("pullProduct");
        })
    }).fail(function (next, err) {
        debug.done("pushProduct",err);
        debug.done("pullProduct",err);
    })
})();


//debug.set("pushArticleComment","用来保存文章的评论");
//(function(){
//    var cusId = objectid();
//    then(function(next){
//        var cus = new custom({_id:cusId,name:"haha"+ _.random(0,100000)});
//        cus.save(function(err){
//            next(err);
//        })
//    }).then(function (next) {   //保存文章
//        var comment = {
//
//        }
//
//
//
//    }).then(function (next, childId) { //通过用户id和文章id
//        Article.findOne({
//                "_userId":cusId,
//                "_id": childId
//            },
//            function (err, doc) {
//                doc ? debug.done("pushAriticle")
//                    : debug.done("pushAriticle",err);
//                next(err, doc);
//            })
//    }).then(function (next, doc) {
//        custom.pullAriticle(
//            cusId,
//            doc._id,
//            function (err) {
//                !err ? debug.done("pullAriticle")
//                    : debug.done("pullAriticle",err);
//            }
//        )
//    }).fail(function (next, err) {
//        debug.done("pushArticleComment",err);
//    })
//})();