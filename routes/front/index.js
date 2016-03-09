var express = require('express');
var router = express.Router();
var then = require('thenjs');
var indexWare = require("./index_ware");
var Product = require("../../models/Product");
var Article = require("../../models/Article");

//创品列表页面
router.get("/prolist",function(req,res){
	Product.find({
		status:true
	}).limit(12).sort({"_id":-1}).exec(function(err,docs){
		err && console.log(err);
		res.render('front/page/pro_list',{products:docs});
	})
});

//发现列表页面
router.get("/artlist",function(req,res){
	Article.find({
		status:3
	}).limit(12).sort({"_id":-1}).exec(function(err,docs){
		err && console.log(err);
		res.render('front/page/art_list',{articles:docs});
	})
});


module.exports = router;