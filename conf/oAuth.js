var config = require('./config');
/**
 * @desc 三方登陆账号配置
 * */
function getRooUrlt(ext){
    var url = "http://"+config.main.root
    var _port = config.main.port;
    if(_port != 80){
        url+=":"+_port;
    }
    return url+ext;
}

module.exports = {
    /**
     * @desc QQ第三方登陆数据
     * */
    qq:{
        open:true,
        clientID:"101270475",
        clientSecret:"54d139d79a54bf51068f624a102c1e4b",
        callbackURL:getRooUrlt("/auth/qq/callback")
    },
    weibo:{
        open:true,
        clientID:"12416540",
        clientSecret:"2662e01a000432ef61890438baaf95d6",
        callbackURL:getRooUrlt("/auth/weibo/callback")
    },
    wechat:{
        open:false,
        appID:"",
        appSecret:"",
        client:"web",//{wechat[微信]|web[网站]}
        callbackURL:getRooUrlt("/auth/wechat/callback"),
        scope:"snsapi_base",//{snsapi_userinfo [多信息] | snsapi_base [仅获取基本信息]}
        state:"STATE"
    },
}
