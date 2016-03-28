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
require("./src/service/active_server.js");
//加载用户server
require("./src/service/user_service.js");
//加载用户指令server
require("./src/directive/directive_attention.js");
///**加载主程序人口*/
require("./src/controller/active_detail_control.js");
//加载地址选择器
require("../../../public/plugin/area/selectAddress2.js");


var app = angular.module('myApp',[
    'selectAddress',
    'angularFileUpload',
    'service.showCtrl',
    'service.active_server',
    'service.user_service',
    'directive-attention',
    pageResult.service_pageResult,
    'controller.active_detail_control'
    ]);
app.directive("setFocus",["$timeout",function($timeout){
    return {
        restrict:"A",
        scope:{
            "flag":'=flag'
        },
        link:function(scope, element, attr){
            scope.$watch("flag",function(){
                console.log('flag',scope.flag);
                if(scope.flag)
                    element[0].focus();
                $timeout(function(){
                    scope.flag = false;
                },0)
            })
        }
    };
 }]);