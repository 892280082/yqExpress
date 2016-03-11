var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var to = '892280082@qq.com';//发送地址
// var to='admin@xxx.com,editor@xxx.com'; //发送给多个人，英文逗号隔开
//http://www.nodeclass.com/articles/69420
var subject = 'lala'; //发送的标题
var html = '<div>hello world!</div>';//发送的内容

var transport = nodemailer.createTransport(smtpTransport({
        host: 'smtp.exmail.qq.com',
        port: 465,
        secure:true,
        auth: {
            user: 'contact@zwzhe.com',//你真实的邮箱
            pass: 'ZWzhe@2016'//真实的密码
        }
}));

var mailOptions = {
        from: '雅集 <contact@zwzhe.com>',
        to: to,
        subject:subject,
        html:html
}; 

transport.sendMail(mailOptions, function(error, info){
    error && console.log(error);
    console.log(info);
}); 