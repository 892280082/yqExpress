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
var mailUtil = require("../../util/email_util");
var md5 = require("md5");
var _ = require("underscore");

//用户注册页面
router.get('/index',function(req,res){
    res.render('front/loginPage/user_regist');
})

//用户登录页面
router.get('/login',function(req,res){
    res.render('front/loginPage/user_login');
})

//用户邮箱注册
router.post('/emailRegist',function(req,res){
    var pojo = req.body.pojo;

    if(req.session.yanzhenma != pojo.yanzhenma)
        return res.json({"err":'验证码错误',code:1})

    then(function(next){
        pojo.randomStr = md5(pojo.name)+ _.random(0,10000);

        mailUtil.sendRegistMail(pojo.name,pojo.email,pojo.randomStr,function(err){
            if(err){
                console.log(err);
                next(3);
            }else{
                next();
            }
        })
    }).then(function(next){
        //限制注册字段
        var tempPojo = {
            name:pojo.name,
            password:pojo.password,
            email:pojo.email,
            job:pojo.job,
            randomStr:pojo.randomStr
        };
        var cusPojo = new Customer(tempPojo);
        cusPojo.save(function(err){
            if(err){
                console.log(err);
                next(2,cusPojo);
            }else{
                next();
            }
        })
    }).then(function(){
        return res.json({result:"ok"});
    }).fail(function(next,err){
        if(err === 2)
            return res.json({"err":'数据库保存错误',code:2});
        if(err === 3)
            return res.json({"err":'邮件发送错误',code:3});
    })
});

//验证用户邮箱
router.get("/validateEmailLink/:name/:randomstr",function(req,res){
    var name = req.params.name;
    var randomStr = req.params.randomstr;

    then(function(next){
        Customer.findOne({"name":name,"randomStr":randomStr},function(err,doc){
            if(!doc){
                return res.render("front/loginPage/email_validate",{result:false});
            }
            next(err,doc);
        })
        //"randomStr":""
    }).then(function(next,doc){
        Customer.update({"_id":doc._id},{"state":2,},function(err,info){
            if(err){
                next(err);
            }else{
               return res.render("front/loginPage/email_validate",{result:true});
            }
        })
    }).fail(function(next,err){
        console.log("Router:regist->validateEmailLink:",err);
        return res.render("front/loginPage/email_validate",{result:false});
    })
})

//手机注册
router.post('/telRegist',function(req,res){
    var pojo = req.body.pojo;

    if(req.session.telYanzhenma != pojo.telYanzhenma){
        return res.json({"code":1,err:'手机验证码错误'});
    }

    //限制注册字段
    var tempPojo = {
        name:pojo.name,
        password:pojo.password,
        phoneNumber:pojo.phoneNumber,
        job:pojo.job,
        state:1//手机注册标示
    };

    var cusPojo = new Customer(tempPojo);
    cusPojo.save(function(err){
        if(err){
            console.log(err);
            return res.json({"code":2,err:'数据保存错误'});
        }else{
            return res.json({result:"ok"});
        }
    })
});

//用户登录
router.post('/doValiLogin',function(req,res){
    var pojo = req.body.pojo;

    if(req.session.yanzhenma != pojo.yanzhenma)
        return res.json({"err":'验证码错误',code:1})

    then(function(next){
        Customer.findOne({"email":pojo.name,"password":pojo.password},function(err,doc){
            if(doc){
                if(doc.state === 2 ){
                    req.session.USER = doc;
                    return res.json({"result":"ok"});
                }else{
                    return res.json({err:'该用户邮箱未激活'});
                }
            }else{
                next(err);
            }
        })
    }).then(function(next){
        Customer.findOne({"phoneNumber":pojo.name,"password":pojo.password},function(err,doc){
            if(doc){
                    req.session.USER = doc;
                    return res.json({"result":"ok"});
            }else{
                next(err);
            }
        })
    }).then(function(next){
        return res.json({"err":"用户名或密码不正确"});
    }).fail(function(next,err){
        console.log("Router:regist->doValiLogin:",err);
        return res.json({"err":'验证登录错误'});
    })
})


module.exports = router;