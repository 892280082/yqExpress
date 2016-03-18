var express = require('express');
var router = express.Router();
var then = require('thenjs');
var Product = require("../../models/Product");
var Article = require("../../models/Article");
var mongooseUtil = require("../../util/mongooseUtil");
var indexService = require("../../service/indexService");
var Customer = require("../../models/Custom");
var Active = require("../../models/Active");
var frontWare = require("./front_ware");
var ArticleComment = require("../../models/ArticleComment");

//创品列表页面
router.get('/index',function(req,res){
    res.render('front/loginPage/user_regist');
})

//创品列表页面
router.get('/login',function(req,res){
    res.render('front/loginPage/user_login');
})

module.exports = router;