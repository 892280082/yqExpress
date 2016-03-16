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

//异步加载产品请求
router.post("/getProduct",function(req,res){
	mongooseUtil.pagination({
		query:req.body.query,
		limit:req.body.limit,
		skip:req.body.skip*req.body.limit,
		sort:req.body.sort,
		model:Product,
	},function(err,result){
		!err ? res.json({result:result})
			 : res.json({err: err});
	})
});

//发现瀑布流页面后台接口
router.post('/getArticleList',function(req,res){
	var query = {status:3}
	mongooseUtil.pagination({
		query:query,
		limit:req.body.limit,
		skip:req.body.skip*req.body.limit,
		sort:req.body.sort,
		model:Article,
	},function(err,result){
		!err ? res.json({result:result})
			: res.json({err: err});
	})
})

//发现列表页面
router.get("/toCusList",function(req,res){
	Customer.find({
		usertype:2
	}).limit(1).sort({"topno":-1}).exec(function(err,docs){
		err && console.log(err);
		indexService.getCusAllInfoByCusArray(docs,function(err,docs){
			res.render('front/page/cus_list',{customers:docs});
		});
	})
});

//人物汇聚页面瀑布流接口
router.post('/getUserList',function(req,res){
	var query = req.body.query;
	//query.usertype = 2;
	mongooseUtil.pagination({
		query:query,
		limit:req.body.limit,
		skip:req.body.skip*req.body.limit,
		sort:{"topno":-1},
		model:Customer,
	},function(err,result){
		indexService.getCusAllInfoByCusArray(result,function(err,docs){
			!err ? res.json({result:docs})
				 : res.json({err: err});
		});
	})
})


//活动汇聚页
router.get("/toActiveList",function(req,res){
	Active.find({}).limit(3).sort({"creatTime":-1}).exec(function(err,docs){
		err && console.log(err);
		res.render('front/page/act_list',{actives:docs});
	})
});

//活动汇聚页接口
router.post('/getActiveList',function(req,res){
	var query = req.body.query;
	//query.usertype = 2;
	mongooseUtil.pagination({
		query:query,
		limit:req.body.limit,
		skip:req.body.skip*req.body.limit,
		sort:{"creatTime":-1},
		model:Active,
	},function(err,result){
			!err ? res.json({result:result})
				: res.json({err: err});
	})
})

//文章详情页页面
router.get("/toArtDetail/:_id"
	,frontWare.increaPojoById(Article,"checkcounts")
	,frontWare.addRandomArt(Article,{"status":3},{"checkcounts":-1})
	,function(req,res){
	var _id = req.params._id;
	Article.findOne({"_id":_id},function(err,doc){
		err && console.log(err);
		res.render('front/page/art_detail',{"article":doc});
	});
});

//文章详情页获取评论接口
router.post('/getArticleComments',function(req,res){
	var query = req.body.query;
	//query.usertype = 2;
	mongooseUtil.pagination({
		query:query,
		limit:req.body.limit,
		skip:req.body.skip*req.body.limit,
		sort:{"creatTime":-1},
		model:ArticleComment,
	},function(err,result){
		!err ? res.json({result:result})
			: res.json({err: err});
	})
})

//提交文章评论
router.post('/pushArticleComment',function(req,res){
	var pushPojo = req.body.pushPojo;
	Article.addComment(pushPojo,function(err,pojo){
		res.json({"err":err,"result":pojo});
	});
})

//文章喜欢数量加1
router.post('/increateArtilce',function(req,res){
	mongooseUtil.increateProtoById(req.body._id,Article,'praiseCounts',function(err){
		res.json({'err':err});
	})
})

//文章详情页页面
router.get("/toActivetail/:_id"
	,frontWare.increaPojoById(Active,"checkcounts")
	,function(req,res){
		var _id = req.params._id;
		Active.findOne({"_id":_id},function(err,doc){
			err && console.log(err);
			console.log(doc,_id);
			res.render('front/page/active_detail',{'active':doc});
		});
});

//名人详情页
router.get("/toCusDetail/:_id"
	,frontWare.increaPojoById(Customer,"checkcounts")
	,function(req,res){
		var _id = req.params._id;
		Customer.findOne({"_id":_id},function(err,doc){
			err && console.log(err);
			res.render('front/page/cus_detail.ejs',{"customer":doc});
		});
	});

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