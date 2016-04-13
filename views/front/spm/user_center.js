/**
 * @desc 处理用户数据
 * @author yq
 * @date 2016/2/29
 * */
var angular = require("angular");
var ngAnimate = require("angular-animate");
require("angular-ui-router");
require("../../lib/jsExtend.js");//加载 原型扩展
var pageResult = require("../../lib/src/service/angular_pageresult.js");//加载分页插件
require("../../lib/src/directive/angular-ueditor.js");//加载ueditor插件
require("../../bower_components/angular/angular-file-upload.min.js");//加载上传插件
require("./src/service/art_detail_server.js");//创品服务
require("./src/service/pro_list_server.js");//创品服务
require("./src/service/dataService.js");//数据分类服务
require("./src/service/user_service.js");//用户服务
require("./src/service/art_detail_server.js");//发现服务
require("../userpage/controller/user_center_active.js");//活动控制器
require("../userpage/controller/user_center_collect.js");//收藏控制器
require("../userpage/controller/user_center_work.js");//作品控制器
require("../userpage/controller/user_center_attention.js");//关注控制器
require("../userpage/controller/user_center_follow.js");//粉丝控制器

var app = angular.module('myApp',[
    ngAnimate,
    'ui.router',
    'angularFileUpload',
    'controller.user_center_active',
    'controller.user_center_collect',
    'controller.user_center_work',
    'controller.user_center_attention',
    'controller.user_center_follow',
    'service.user_service',
    'service.art_detail_server',
    pageResult.service_pageResult,
]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state('work', {
        url: '/work',
        templateUrl: '/front/userpage/work.html',
        controller: 'user_center_work'
    }).state('active', {
        url: '/active',
        templateUrl: '/front/userpage/active.html',
        controller: 'user_center_active'
    }).state('collect', {
        url: '/collect',
        templateUrl: '/front/userpage/collec.html',
        controller: 'user_center_collect'
    }).state('follow', {
        url: '/follow',
        templateUrl: '/front/userpage/follow.html',
        controller: 'user_center_follow'
    }).state('attention', {
        url: '/attention',
        templateUrl: '/front/userpage/attention.html',
        controller: 'user_center_attention'
    });

    $urlRouterProvider.otherwise('/work');
}])

app.controller("main",["$scope","$location",function($scope,$location){

    $scope.overFlag=1;
    switch ($location.path()){
        case "/work" : $scope.overFlag=1;break;
        case "/active" : $scope.overFlag=2;break;
        case "/collect" : $scope.overFlag=3;break;
        case "/follow" : $scope.overFlag=4;break;
    }

    $scope.getOver = function(number){
        return number == $scope.overFlag ? 'over':''
    };

    $scope.getOver($scope.overFlag);


    //时间选择器
    $scope.validateTime = function(startData,overData,infos) {
        var currentTime = new Date();
        startData = new Date(startData);
        overData = new Date(overData);
        if (currentTime < startData)
            return infos[0];
        if (currentTime >= startData && currentTime <= overData)
            return infos[1];
        else
            return infos[2];
    }


}]);

app.service('removeCord',[function(){
    this.removeFollows = [];
    this.removeAttentions = [];
}])
