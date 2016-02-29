var express = require('express'),
	md5 = require("md5"),
	Custom = require("../../models/Custom"),
	router = express.Router();

//进入登陆页面
router.get('/login',function(req,res){
	res.render("back/login/login");
})

//用户登录
router.post('/validateUser',function(req,res){
	var pojo = req.body.pojo;
	if(!pojo)
		return  res.json({"result":false,"error":"参数错误"});
	if(pojo.yanzhenma != req.session.yanzhenma){
		return res.json({"result":false,"error":"验证码错误"});
	}
	if(pojo.name === "admin" && pojo.password === md5('admin')){
		req.session.admin = {"name":pojo.name,"password":pojo.password}
		return res.json({"result":true,"error":null});
	}else{
		return res.json({"result":false,"error":"账号密码错误"});
	}
})

//用户注销
router.post('/logoutUser',function(req,res){
	if(!req.session.admin){
		return res.json({"result":false,"error":"操作错误"});
	}else{
		req.session.admin = null;
		return res.json({"result":true,"error":""});
	}
})

//后台主页面
router.get('/main',function(req,res){
	res.render("back/main/index");
})

//后台用户管理页面
router.get('/toCusDeal',function(req,res){
	res.render("back/customer/customer");
})

//获取所有用户信息
router.post('/cusGetAllData',function(req,res){
	var pojo = req.body.searchPojo;
	Custom.find(pojo,function(err,docs){
		err && res.json({"result":false,error:err});
		res.json({"result":docs,"error":null});
	})
})




module.exports = router;