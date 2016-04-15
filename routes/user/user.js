var express = require('express');
var router = express.Router();
var then = require('thenjs');
var Product = require("../../models/Product");
var Article = require("../../models/Article");
var mongooseUtil = require("../../util/mongooseUtil");
var indexService = require("../../service/indexService");
var Customer = require("../../models/Custom");
var Active = require("../../models/Active");
var Work = require("../../models/Work");
var WebConfig = require("../../models/WebConfig");
var ArticleComment = require("../../models/ArticleComment");
var activeService = require("../../service/activeService");
var userService = require("../../service/userService.js");
var emailUtil = require("../../util/email_util");
var Message = require("../../models/Message");
var _  = require("underscore");

//处理用户未登录
router.get("*",function(req,res,next){
    if(!req.session.USER)
        return res.redirect("/regist/login");
    next();
})

router.post("*",function(req,res,next){
    if(!req.session.USER)
        return res.json({err:'no login'});
    next();
})

//用户赞文章评论的接口
router.post("/doUserCommParise",function(req,res){
    var _commentId = req.body._id;
    var currentUserId = req.session.USER._id;

    then(function(next){ //保存赞
        ArticleComment.addCommentPraise(_commentId,currentUserId,function(err,info){
            next(err);
        })
    }).then(function(next){ //查出评论
        ArticleComment.findOne({_id:_commentId},function(err,doc){
            next(err,doc);
        })
    }).then(function(next,doc){
        var baseInfo = {
            user:doc._userId,
            cate:'f',
        }
        baseInfo.f = {
            articleId:doc._articleId,
            content:doc.content,
            userId:currentUserId,
            commentId:doc._id,
        }
        mongooseUtil.saveSingle(baseInfo,Message,function(err,info){
            return res.json({err:err,result:info});

        })
    }).fail(function(next,err){
        console.log("/doUserCommParise",err);
        return res.json({err:'操作失败了'});
    })

})

//用户举报文章评论的接口
router.post("/doUserReport",function(req,res){
    var _commentId = req.body._id;
    var currentUserId = req.session.USER._id;

    then(function(next){ //保存举报信息
        ArticleComment.doCommentReport(_commentId,req.session.USER._id,function(err,info){
            next(err);
        })
    }).then(function(next){ //查出评论
        ArticleComment.findOne({_id:_commentId},function(err,doc){
            next(err,doc);
        })
    }).then(function(next,doc){
        var baseInfo = {
            user:doc._userId,
            cate:'g',
        }
        baseInfo.f = {
            articleId:doc._articleId,
            content:doc.content,
            userId:currentUserId,
            commentId:doc._id,
        }
        mongooseUtil.saveSingle(baseInfo,Message,function(err,info){
            return res.json({err:err,result:info});

        })
    }).fail(function(next,err){
        console.log("/doUserReport",err);
        return res.json({err:'操作失败了'});
    })
})

//用户赞文章二级评论的接口
router.post("/doReplayPraise",function(req,res){
    var currentUserId = req.session.USER._id;

    var _replayId = req.body._replayId;
    var _commentId = req.body._commentId;



    then(function(next){ //保存点赞信息
        ArticleComment.addReplayPraise(_commentId,_replayId,currentUserId,function(err,info){
            next(err);
        })
    }).then(function(next){ //查出评论
        ArticleComment.findOne({_id:_commentId},function(err,doc){
            next(err,doc);
        })
    }).then(function(next,doc){

        var replayContent = _.find(doc.replays,function(ele){
            return _replayId == ele._id;
        })

        var baseInfo = {
            user:replayContent._userId,
            cate:'i',
        }
        baseInfo.i = {
            articleId:doc._articleId,
            replay:replayContent.content,
            userId:currentUserId,
        }

        mongooseUtil.saveSingle(baseInfo,Message,function(err,info){
            return res.json({err:err,result:info});

        })
    }).fail(function(next,err){
        console.log("/doReplayPraise",err);
        return res.json({err:'操作失败了'});
    })

})

//用户举报文章二级评论接口
router.post("/doReplayReport",function(req,res){
    var currentUserId = req.session.USER._id;

    var _replayId = req.body._replayId;
    var _commentId = req.body._commentId;



    then(function(next){ //保存举报信息
        ArticleComment.doReplayReport(_commentId,_replayId,currentUserId,function(err,info){
            next(err);
        })
    }).then(function(next){ //查出评论
        ArticleComment.findOne({_id:_commentId},function(err,doc){
            next(err,doc);
        })
    }).then(function(next,doc){

        var replayContent = _.find(doc.replays,function(ele){
            return _replayId == ele._id;
        })

        var baseInfo = {
            user:replayContent._userId,
            cate:'j',
        }

        baseInfo.i = {
            articleId:doc._articleId,
            replay:replayContent.content,
            userId:currentUserId,
        }

        mongooseUtil.saveSingle(baseInfo,Message,function(err,info){
            return res.json({err:err,result:info});

        })
    }).fail(function(next,err){
        console.log("/doReplayReport",err);
        return res.json({err:'操作失败了'});
    })

})

module.exports = router;