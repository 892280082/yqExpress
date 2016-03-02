var express = require('express'),
	md5 = require("md5"),
	Custom = require("../../models/Custom"),
	Product = require("../../models/product");
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
	console.log("pojo"+"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",pojo);
	Custom.find(pojo,function(err,docs){
		err && res.json({"result":false,error:err});
		res.json({"result":docs,"error":null});
	})
})

//保存用户信息
router.post('/cusSaveCustom',function(req,res){
	var pojo = req.body.pojo;
	var cus = new Custom(pojo);
	cus.saveUser(function(err,doc){
		err && console.log(err);
		!err ? res.json({ "result":doc,"err":null})
		     : res.json({ "result":null,"err":"注册错误"});
	});
})

//删除用户信息
router.post('/cusRemoveCustom/:_id',function(req,res){
	var _id = req.params._id;
	if(!_id)
		res.json({"err":true,"result":"no _id param!"});
	Custom.remove({"_id":_id},function(err,info){
		if(err){
			console.log(err);
			return res.json({ "err":true,"result":" 删除错误 "});
		}else{
			return res.json({ "err":null, "result":null });
		}
	})
})

//更新用户信息
router.post('/updateCustorm',function(req,res){
	var cus = req.body.updatePojo;
	if(!cus)
		res.json({"err":true,"result":"no customer param!"});
	var _id = cus._id;
	delete  cus._id;
	Custom.update({"_id":_id},cus,function(err){
		if(err){
			console.log(err);
			return res.json({ "err":true,"result":" 更新错误 "});
		}else{
			return res.json({ "err":null, "result":null });
		}
	})
})

//进入后台创品页面
router.get('/toProducs',function(req,res){
	res.render("back/product/product");
})

//获取所有创品信息接口
router.post('/proGetAllData',function(req,res){
	var pojo = req.body.searchPojo;
	Product.find(pojo,function(err,docs){
		if(err)
		{
			console.log(err);
			return res.json({ "err":"接口出错","result":null });
		}
		res.json({"result":docs,"error":null});
	})
})

//保存创品信息
router.post('/proSaveSingle',function(req,res){
	var pojo = req.body.pojo;
	var _cusId = pojo._cusId;
	if(!_cusId){
		return res.json({"err":'缺少用户信息'});
	}
	Custom.pushProduct(_cusId,pojo,function(err,newPojo){
		if(err){
			return res.json({ "err":err });
		}else{
			return res.json({ "result":newPojo });
		}
	})
})



module.exports = router;