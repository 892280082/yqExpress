/***
 * @desc 第三方登陆路由
 * @auther yq
 * @time 2016/2/23
 */
var express = require('express'),
    router = express.Router(),
    oAuthConfig = require('../conf/oAuth'),
    passport = require('passport'),
    qqStrategy = require('passport-qq').Strategy,
    WeiboStrategy = require('passport-weibo').Strategy;

/***
 * @desc 配置QQ第三方登陆
 */
if(oAuthConfig.qq.open) {
    passport.use(new qqStrategy(
        {
            clientID: oAuthConfig.qq.clientID,
            clientSecret: oAuthConfig.qq.clientSecret,
            callbackURL: oAuthConfig.qq.callbackURL
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOrCreate({qqId: profile.id}, function (err, user) {
                return done(err, user);
            });
        }
    ));

    router.get('/qq',
        passport.authenticate('qq'),
        function(req, res){
            // The request will be redirected to qq for authentication, so this
            // function will not be called.
        });

    router.get('/qq/callback',
        passport.authenticate('qq', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });
}

/**
 * @desc 配置微博第三方登陆
 */
if(oAuthConfig.weibo.open){

    passport.use(new WeiboStrategy({
            clientID: oAuthConfig.weibo.clientID,
            clientSecret: oAuthConfig.weibo.clientSecret,
            callbackURL:oAuthConfig.weibo.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOrCreate({ weiboId: profile.id }, function (err, user) {
                return done(err, user);
            });
        }
    ));

    router.get('/weibo',
        passport.authenticate('weibo'));

    router.get('/weibo/callback',
        passport.authenticate('weibo', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

}

/**
 * @desc 配置微信三方登陆
 */
if(oAuthConfig.wechat.open){
    var wechatConfig = oAuthConfig.wechat;
    passport.use(new WechatStrategy({
            appID:wechatConfig.appID,
            //name:{默认为wechat,可以设置组件的名字}
            appSecret:wechatConfig.appSecret,
            client:wechatConfig.client,
            callbackURL:wechatConfig.callbackURL,
            scope:wechatConfig.scope,
            state:wechatConfig.state
            },function(accessToken, refreshToken, profile, done) {
                return done(null,profile);
            }
    ));

    router.get('/wechat', passport.authenticate('wechat'));

    router.get('/wechat/callback', passport.authenticate('wechat', {
        failureRedirect: '/auth/fail',
        successReturnToOrRedirect: '/'
    }));

}


module.exports = router;

