/**
 * @desc 处理用户数据
 * @author yq
 * @date 2016/2/29
 * */
var angular = require("angular");
var ngAnimate = require("angular-animate");
require("../../lib/jsExtend.js");//加载 原型扩展
var pageResult = require("../../lib/src/service/angular_pageresult.js");//加载分页插件
require("../../lib/src/directive/angular-ueditor.js");//加载ueditor插件
require("../../bower_components/angular/angular-file-upload.min.js");//加载上传插件
require("../../bower_components/angular/angular-route.min.js");//加载路由插件
require("./src/service/art_detail_server.js");//创品服务
require("./src/service/pro_list_server.js");//创品服务
require("./src/service/dataService.js");//数据分类服务
require("./src/service/user_service.js");//用户服务
require("../userpage/controller/user_center_active.js");//活动控制器
require("../userpage/controller/user_center_collect.js");//收藏控制器
require("../userpage/controller/user_center_work.js");//作品控制器

var app = angular.module('myApp',[
    ngAnimate,
    'ngRoute',
    'angularFileUpload',
    'controller.user_center_active',
    'controller.user_center_collect',
    'controller.user_center_work',
    'service.user_service',
    pageResult.service_pageResult,
]);


app.config(["$routeProvider",function($routeProvider){
        $routeProvider
        //活动主页
        .when('/',{
            templateUrl : '/front/userpage/active.html',
            controller  : 'user_center_active'
        })

        .when('/collect', {
            templateUrl : '/front/userpage/collec.html',
            controller  : 'user_center_collect'
        })

        // route for the contact page
        .when('/work', {
            templateUrl : '/front/userpage/work.html',
            controller  : 'user_center_work'
        });
}]);

app.animation('.view-slide-in', function () {
    return {
        enter: function(element, done) {
            element.css({
                opacity: 0.5,
                position: "relative",
                top: "10px",
                left: "20px"
            })
                .animate({
                    top: 0,
                    left: 0,
                    opacity: 1
                }, 1000, done);
        }
    };
});
