/**
 * @desc 处理用户数据
 * @author yq
 * @date 2016/2/29
 * */
var angular = require("angular");
var _ = require('underscore');
/**加载 原型扩展*/
require("../../lib/jsExtend.js");
/***加载显示插件****/
require("../../lib/src/service/angular-showCtrl.js");
/**加载分页插件*/
require("../../lib/src/service/angular_pageResult.js");
/**加载ueditor插件*/
require("../../lib/src/directive/angular-ueditor.js");
///**加载上传插件*/
require("../../bower_components/angular/angular-file-upload.min.js");
///**加载后台数据接口*/
require("./src/service/dataService");
///**加载主程序人口*/
require("./src/controller/main");
//分页指令
require("../../lib/src/directive/directive_pagination.js");
//加载消息通知
require("../../front/spm/src/service/message_server.js");
var app = angular.module('myApp',[
    'loadDate',//代码有全局变量,只能外部引入,不能被压缩。
    'angularFileUpload',
    'service.showCtrl',
    'service.dataService',
    'service_pageResult',
    'controller.main',
    'directive_pagination',
    'service_pageResult',
    'service.message_server'
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