/***
 * @desc 平台对外接口
 * @author yq
 * @date 2016/3/17
 * @api
 *
 * 1./getCurCusPro/:_id -通过用户ID获取创品  -call('err',docs)
 * 2./getCurCusAri/:_id -通过用户ID获取文章列表 -call('err',docs)
 */
var express = require('express');
var router = express.Router();
var then = require('thenjs');
var Product = require("../../models/Product");
var Article = require("../../models/Article");
var mongooseUtil = require("../../util/mongooseUtil");
var indexService = require("../../service/indexService");
var Customer = require("../../models/Custom");
var Active = require("../../models/Active");
var ArticleComment = require("../../models/ArticleComment");

//获取名人的作品
router.post("/getCurCusPro/:_id",function(req,res){
    var query = req.body.query;
    query._userId = req.params._id;
    mongooseUtil.pagination({
        query:query,
        limit:req.body.limit,
        skip:req.body.skip*req.body.limit,
        sort:{"creatTime":-1},
        model:Product,
    },function(err,result){
        !err ? res.json({result:result})
            : res.json({err: err});
    })
})

//获取名人的文章
router.post("/getCurCusAri/:_id",function(req,res){
    var query = req.body.query;
    query._userId = req.params._id;
    mongooseUtil.pagination({
        query:query,
        limit:req.body.limit,
        skip:req.body.skip*req.body.limit,
        sort:{"creatTime":-1},
        model:Article,
    },function(err,result){
        !err ? res.json({result:result})
            : res.json({err: err});
    })
})

module.exports = router;