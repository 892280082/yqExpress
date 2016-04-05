/**
 * @desc 封装的邮箱插件
 * @auther yq
 * @date 2016/2/24
 */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mailConf = require('../conf/email_config');
var main_conf = require('../conf/app_config');


var transport = nodemailer.createTransport(smtpTransport({
    host: mailConf.host,
    port: mailConf.port,
    secure:mailConf.secure,
    auth: {
        user: mailConf.auth.user,//你真实的邮箱
        pass: mailConf.auth.pass//真实的密码
    }
}));

var from = mailConf.prefix+" "+"<"+mailConf.auth.user+">";

/**
 * @desc 发送邮件主要函数
 * @param params {{
    to:String,
    subject:String,
    html:String
   }} -m 发送邮件的必须参数
 *
 * @param callback {Function} -m 回调函数
 *
 * @example
 emailUtil.send({to:"892280082@qq.com",
                subject:"what to do ",
                html:"hello world"},
 function(err,info){
             console.log(info);
})
 */
exports.sendMail = function(params,callback){
    params.from = from;
    transport.sendMail(params, function(err, info){
        err && console.log(err);
        callback(err,info);
    });
}

exports.sendRegistMail = function(name,email,randomStr,callback){
    var subject = "造物者邮箱验证";
    var html = "<a href='"+main_conf.main.root+"/regist/validateEmailLink/"+name+"/"+randomStr+"'+>点击激活链接，验证登陆吧!></a>";
    transport.sendMail({
        to:email,
        subject:subject,
        html:html,
        from:from
    }, function(err, info){
        err && console.log(err);
        callback(err,info);
    });
}

//exports.sendMail({to:"892280082@qq.com",
//        subject:"to Test",
//        html:"测试验证码发送是否正确!"},
//    function(err,info){
//        console.log(info);
//    })