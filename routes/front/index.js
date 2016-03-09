var express = require('express');
var router = express.Router();
var then = require('thenjs');
var indexWare = require("./index_ware");
var Product = require("../../models/Product");

//首页
router.get("/prolist",function(req,res){
	res.render('front/page/pro_list');
});


module.exports = router;