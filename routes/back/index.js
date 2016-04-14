var express = require('express'),
	md5 = require("md5"),
	Custom = require("../../models/Custom"),
	mongooseUtil = require("../../util/mongooseUtil"),
	Article = require("../../models/Article"),
	Product = require("../../models/Product"),
	Active = require("../../models/Active"),
	WebConfig = require("../../models/WebConfig"),
	indexService = require("../../service/indexService"),
	activeService = require("../../service/activeService.js"),
	Work = require('../../models/Work'),
	then = require('thenjs'),
	Message = require('../../models/Message'),
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
});

//后台头部页面
router.get('/main_top',function(req,res){
	res.render("back/main/main_top");
});

//后台左边引导栏目页面
router.get('/main_left',function(req,res){
	res.render("back/main/main_left");
});

//后台用户管理页面
router.get('/toCusDeal',function(req,res){
	res.render("back/customer/customer");
})

//获取所有用户信息
router.post('/cusGetAllData',function(req,res){
	mongooseUtil.pagination({
		query:req.body.query,
		limit:req.body.limit,
		skip:req.body.skip*req.body.limit,
		sort:req.body.sort,
		model:Custom,
	},function(err,result){
		!err ? res.json({result:result})
			 : res.json({err: err});
	})
})

//保存用户信息
router.post('/cusSaveCustom',function(req,res){
	var pojo = req.body.pojo;
	var cus = new Custom(pojo);
	cus.saveUser(function(err,doc){
		err && console.log(err);
		!err ? res.json({ "result":doc,"err":null})
		     : res.json({ "result":null,"err":err});
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
	mongooseUtil.pagination({
		query:req.body.query,
		limit:req.body.limit,
		skip:req.body.skip*req.body.limit,
		sort:req.body.sort,
		model:Product,
	},function(err,result){
		if(err)
			console.log("/proGetAllData",err);
		return res.json({err: err,result:result});
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

	then(function(next){

		mongooseUtil.updateOutKey({
			subPojo:pro,
			subDao:Product,
			outDao:Custom,
			outKey:'_userId',
			innerCollet:'productions',
		},function(err){
			next(err);
		});

	}).then(function(next){

		mongooseUtil.updateSingleById(pro,Product,function(err,info){
					next(err);
					return res.json({err:err,result:info});
		});

	}).fail(function(next,err) {
		if (err)
			console.log("/proUpdateSingle----->", err);
		return res.json({err: '更新错误'});
	});


});

//进入文章显示页面
router.get('/toArticlePage',function(req,res){
	res.render("back/article/article");
});

//获取所有文章信息
router.post('/artGetAllData',function(req,res){
	mongooseUtil.pagination({
		query:req.body.query,
		limit:req.body.limit,
		skip:req.body.skip*req.body.limit,
		sort:req.body.sort,
		model:Article,
	},function(err,result){
		!err ? res.json({result:result})
			 : res.json({err: err});
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


	then(function(next){

		mongooseUtil.updateOutKey({
			subPojo:pro,
			subDao:Article,
			outDao:Custom,
			outKey:'_userId',
			innerCollet:'articles',
		},function(err){
			next(err);
		});

	}).then(function(next){

		mongooseUtil.updateSingleById(pro,Article,function(err,info){
			next(err);
			return res.json({err:err,result:info});
		})

	}).fail(function(next,err){
		console.log('artUpdateSingle ---->',err);
		return res.json({err:err});
	})

})

//进入活动列表页面
router.get('/toActivePage',function(req,res){
	res.render("back/active/active");
})

//获取所有活动信息
router.post('/actGetAllData',function(req,res){
	mongooseUtil.pagination({
		query:req.body.query,
		limit:req.body.limit,
		skip:req.body.skip*req.body.limit,
		sort:req.body.sort,
		model:Active,
	},function(err,result){
		!err ? res.json({result:result})
			 : res.json({err: err});
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

//删除一项活动信息
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

//进入banner控制页面
router.get('/toMangerBanner',function(req,res){
	res.render("back/webMannger/banner");
})

//获取网站参数对象
router.post('/getWebConfig',function(req,res){
	WebConfig.findOne(function(err,doc){
		err && console.log(err);
		res.json({ "err":err,"result":doc });
	})
});

//更新活动信息
router.post('/webConfigUpSingle',function(req,res){
	var pro = req.body.updatePojo;
	if(!pro || !pro._id)
		res.json({"err":"no active param!"});

	mongooseUtil.updateSingleById(pro,WebConfig,function(err,info){
		if(err){
			return res.json({ "err":"更新错误"});
		}else{
			return res.json({ "result":info });
		}
	});
});

//保存一项活动信息
router.post('/savetWebConfig',function(req,res){
	var webCon = req.body.pojo;
	if(!webCon)
		return res.json({'err':'缺少配置信息'});
	mongooseUtil.saveSingle(webCon,WebConfig,function(err,pojo){
		!err ? res.json({'result':pojo}) : res.json({'err':'保存错误'});
	})
})

//进入类型管理页面
router.get('/toMangerCate',function(req,res){
	res.render("back/cateMannger/cateMan");
})

//进入文章推荐管理页面
router.get('/toArtRecommd',function(req,res){
	res.render("back/webMannger/articles_recommd");
})

//进入文章推荐管理页面
router.get('/toCusRecommd',function(req,res){
	res.render("back/webMannger/customer_recommd");
})

//进入活动推荐管理页面
router.get('/toActiveRecommd',function(req,res){
	res.render("back/webMannger/active_recommd");
})

//进入创品推荐管理页面
router.get('/toProductRecommd',function(req,res){
	res.render("back/webMannger/product_recommd");
})

//清除首页缓存
router.post('/cleanIndexCache',function(req,res){
	indexService.removeIndexCache();
	res.send("缓存清楚成功!!!");
})

//进入作业推荐管理页面
router.get('/toWorkMann',function(req,res){
	res.render("back/work/work");
});

//获取作业列表
router.post('/getWorkAllData',function(req,res){
	mongooseUtil.pagination({
		query:req.body.query,
		limit:req.body.limit,
		skip:req.body.skip*req.body.limit,
		sort:req.body.sort,
		model:Work,
	},function(err,result){
		activeService.getAllWorkInfo(result.docs,function(err,docs){
			!err ? res.json({result:result})
				: res.json({err: err});
		})
	})
});

//更新作品信息
router.post("/updateWorkById",function(req,res){
	var work = req.body.pojo;
	var message = {
		user:work.userId,
		msg:work._changeCateInfo,//追加提醒
		prix:'造物者 contact@zwzhe.com',//后缀
	}
	then(function(next){ //查询数据库保存的作品
		Work.findOne({"_id":work._id},function(err,doc){
			next(err,doc);
		})
	}).then(function(next,doc){
		//判断分类是否修改
		if(doc.cate1.cateId != work.cate1.cateId || doc.cate2.cateId != work.cate2.cateId){
			var inner = {
				workId:work._id,
				oldCateName:doc.cate1.cateName+'/'+doc.cate1.cateName,
				newCateName:work.cate1.cateName+'/'+work.cate2.cateName,
			}
			message.cate = 'a';
			message.a = inner;
			mongooseUtil.saveSingle(message,Message,function(err){
				next(err,doc);
			})
		}else{
			next(null,doc);
		}
	}).then(function(next,doc){
		//判断作品是否从未通过修改成通过
		if(doc.state === 0 && work.state == 1){
			message.cate = 'b';
			message.b = {
				activeId:doc.actId,
				workName:doc.title
			}
			mongooseUtil.saveSingle(message,Message,function(err){
				next(err,doc);
			})
		}else{
			next();
		}
	}).then(function(next){
		mongooseUtil.updateSingleById(work,Work,function(err,info){
			return res.json({err:err,result:info});
		});
	}).fail(function(err,doc){
		console.log("/updateWorkById",err);
		return res.json({err:'更新错误'});
	})
});

//删除作品
router.post("/removeWorkById",function(req,res){

	var removePojo = req.body.removePojo;

	then(function(next){
		mongooseUtil.removeSingleById(removePojo._id,Work,function(err,info){
			next(err)
		});
	}).then(function(next){
		Active.update({"_id":removePojo.actId},{"$pull":{"works":removePojo._id}},function(err,info){
					next(err);
		})
	}).then(function(next){
		Custom.update({"_id":removePojo.userId},{"$pull":{"works":removePojo._id}},function(err,info){
				next(err);
		})
	}).then(function(next){
		var baseMsg = {
			user:removePojo.userId,
			cate:'c',
		}
		baseMsg.c = {
			activeId:removePojo.activeId,//活动ID bc
			workName:removePojo.title,//作品名 bc
		}
		mongooseUtil.saveSingle(baseMsg,Message,function(err,info){
			return res.json({err:err,result:info});
		})
	}).fail(function(next,err){
		console.log("/back/removeWorkById--->",err);
		res.json({"err":err})
	})
});



module.exports = router;