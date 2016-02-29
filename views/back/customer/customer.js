/**
 * @desc 处理用户数据
 * @author yq
 * @date 2016/2/29
 * */

var angular = require("angular");
var _ = require('underscore');
/***加载显示插件****/
require("../../lib/src/service/angular-showCtrl.js");
require("../../lib/src/directive/angular-ueditor.js");
///**加载上传插件*/
require("../../bower_components/angular/angular-file-upload.min.js");
///**加载后台数据接口*/
require("./src/service/dataService");
///**加载主程序人口*/
require("./src/controller/main");

var app = angular.module('myApp',[
    'angularFileUpload',
    'service.showCtrl',
    'service.dataService',
    'controller.main']);

//app.directive('tsArticlelist'
//    ,function(){
//        return {
//            restrict:'EAC',
//            templateUrl:'articlelist'
//        }
//    }).directive('tsCatelist'
//    ,function(){
//        return {
//            restrict:'EAC',
//            templateUrl:'catelist'
//        }
//    }).directive('tsArticleadd'
//    ,function(){
//        return {
//            restrict:'EAC',
//            templateUrl:'articleadd'
//        }
//    })

