var express = require('express'),
	md5 = require("md5"),
	Custom = require("../../models/Custom"),
	mongooseUtil = require("../../util/mongooseUtil"),
	Article = require("../../models/Article"),
	Product = require("../../models/product"),
	Active = require("../../models/Active"),
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

//后台头部页面
router.get('/main_top',function(req,res){
	res.render("back/main/main_top");
})

//后台左边引导栏目页面
router.get('/main_left',function(req,res){
	res.render("back/main/main_left");
})

//后台用户管理页面
router.get('/toCusDeal',function(req,res){
	res.render("back/customer/customer");
})

//获取所有用户信息
router.post('/cusGetAllData',function(req,res){
	//Custom.find(pojo,function(err,docs){
	//	err && res.json({"result":false,error:err});
	//	res.json({"result":docs,"error":null});
	//})
	mongooseUtil.pagination({
		query:req.body.query,
		limit:req.body.limit,
		skip:req.body.skip*req.body.limit,
		model:Custom,
	},function(err,result){
		if(err) {
			res.json({err: err});
		}else{
			res.json({result:result});
		}
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
	var _userId = pojo._userId;
	if(!_userId){
		return res.json({"err":'缺少用户信息'});
	}
	Custom.pushProduct(_userId,pojo,function(err,newPojo){
		if(err){
			return res.json({ "err":err });
		}else{
			return res.json({ "result":newPojo });
		}
	})
})

//删除创品信息
router.post('/proRemoveSingle',function(req,res){
	var _id = req.body._id;
	var _userId = req.body._userId;
	if(!_id && !_userId)
		res.json({"err":true,"result":"no _id param!"});
	Custom.pullProduct(_userId,_id,function(err,info){
		if(err){
			console.log(err);
			return res.json({ "err":"删除错误"});
		}else{
			return res.json({  "result":info });
		}
	})
})

//更新创品信息
router.post('/proUpdateSingle',function(req,res){
	var pro = req.body.updatePojo;
	if(!pro || !pro._id)
		res.json({"err":"no customer param!"});

	mongooseUtil.updateSingleById(pro,Product,function(err,info){
		if(err){
			return res.json({ "err":"更新错误"});
		}else{
			return res.json({ "result":info });
		}
	})
})

//进入文章显示页面
router.get('/toArticlePage',function(req,res){
	res.render("back/article/article");
})

//获取所有文章信息
router.post('/artGetAllData',function(req,res){
	var pojo = req.body.searchPojo;
	Article.find(pojo,function(err,docs){
		if(err)
		{
			console.log(err);
			return res.json({ "err":"接口出错"});
		}
		res.json({"result":docs,"error":null});
	})
})

//保存单篇文章
router.post('/artSaveSingle',function(req,res){
	var pojo = req.body.pojo;
	var _userId = pojo._userId;
	if(!_userId){
		return res.json({"err":'缺少用户信息'});
	}
	Custom.pushAriticle(_userId,pojo,function(err,newPojo){
		if(err){
			return res.json({ "err":err });
		}else{
			return res.json({ "result":newPojo });
		}
	})
})

//删除文章信息
router.post('/artRemoveSingle',function(req,res){
	var _id = req.body._id;
	var _userId = req.body._userId;
	if(!_id && !_userId)
		res.json({"err":true,"result":"no _id param!"});
	Custom.pullAriticle(_userId,_id,function(err,info){
		if(err){
			return res.json({ "err":err});
		}else{
			return res.json({ "result":info });
		}
	})
})

//更新文章信息
router.post('/artUpdateSingle',function(req,res){
	var pro = req.body.updatePojo;
	if(!pro || !pro._id)
		res.json({"err":"no customer param!"});

	mongooseUtil.updateSingleById(pro,Article,function(err,info){
		if(err){
			return res.json({ "err":"更新错误"});
		}else{
			return res.json({ "result":info });
		}
	})
})

//进入活动列表页面
router.get('/toActivePage',function(req,res){
	res.render("back/active/active");
})

//获取所有活动信息
router.post('/actGetAllData',function(req,res){
	var pojo = req.body.searchPojo;
	Active.find(pojo,function(err,docs){
		if(err)
		{
			console.log(err);
			return res.json({ "err":"接口出错"});
		}
		res.json({"result":docs,"error":null});
	})
})

//保存一项活动信息
router.post('/actSaveSingle',function(req,res){
	var active = req.body.pojo;
	if(!active)
		return res.json({'err':'缺少活动信息'});
	mongooseUtil.saveSingle(active,Active,function(err,pojo){
		!err ? res.json({'result':pojo}) : res.json({'err':'保存错误'});
	})
})

//保存一项活动信息
router.post('/actRemoveSingle',function(req,res){
	var _id = req.body._id;
	if(!_id)
		res.json({ "err":'no _id param!' });
	mongooseUtil.removeSingleById(_id,Active,function(err,info){
		!err ? res.json({ 'result':info }):res.json({ 'err':err });
	});
})

//更新活动信息
router.post('/actUpdateSingle',function(req,res){
	var pro = req.body.updatePojo;
	if(!pro || !pro._id)
		res.json({"err":"no active param!"});

	mongooseUtil.updateSingleById(pro,Active,function(err,info){
		if(err){
			return res.json({ "err":"更新错误"});
		}else{
			return res.json({ "result":info });
		}
	})
})

module.exports = router;