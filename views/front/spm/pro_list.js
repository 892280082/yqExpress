/**
 * @desc 处理用户数据
 * @author yq
 * @date 2016/2/29
 * */
var angular = require("angular");
/**加载 原型扩展*/
require("../../lib/jsExtend.js");
/***加载显示插件****/
require("../../lib/src/service/angular-showCtrl.js");
/**加载分页插件*/
var pageResult = require("../../lib/src/service/angular_pageresult.js");
/**加载ueditor插件*/
require("../../lib/src/directive/angular-ueditor.js");
///**加载上传插件*/
require("../../bower_components/angular/angular-file-upload.min.js");
///**加载后台数据接口*/
require("./src/service/pro_list_server.js");
///**加载主程序人口*/
require("./src/controller/pro_list_control.js");

var app = angular.module('myApp',[
    'angularFileUpload',
    'service.showCtrl',
    'service.pro_list_server',
    pageResult.service_pageResult,
    'controller.pro_list_control'
    ]);

app.directive('tsCuslist',function(){
        return {
            restrict:'EAC',
            templateUrl:'cuslist'
        }
    }).directive('tsCusadd',function(){
        return {
            restrict:'EAC',
            templateUrl:'cusadd'
        }
    })