var express = require('express');
var router = express.Router();
var printService = require("../../service/printService");
var then = require('thenjs');
var indexWare = require("./index_ware");

//nameSpace级别拦截器
router.use(indexWare.all)

//主页
router.get("/index",function(req,res,next){
	printService.getAllDatas(function(err,datas){
		!err ? res.render("print/index.html",datas) : res.send("system error!");
	});
});

router.get("/data",function(req,res){
	printService.getAllDatasByThen(function(err,result){
		err && console.log(err);
		res.json(result);
	})
});

/**
 * @desc 测试路由
 * @ware isLogin - 判断是否登陆
 * @ware isAdmin - 判断是否是管理员
 * */
router.get("/hello",indexWare.isLogin,
					indexWare.isAdmin,
	function(req,res){
	printService.getAuther(function(auther){
		res.render("print/hello",auther);
	})
});



module.exports = router;