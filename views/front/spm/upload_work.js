/**
 * @desc 处理用户数据
 * @author yq
 * @date 2016/2/29
 * */
var angular = require("angular");
var ngAnimate = require("angular-animate");//加载动画效果
require("../../lib/jsExtend.js");//加载原型扩展
require("../../bower_components/angular/angular-file-upload.min.js");//加载上传插件
require("./src/service/art_detail_server.js");//创品服务
require("./src/service/pro_list_server.js");//创品服务
require("./src/service/dataService.js");//数据分类服务
require("./src/service/user_service.js");//用户服务
require("./src/service/active_server.js");//活动服务
require("./src/controller/upload_work_controller.js");//上传作品控制器
require('angular-ui-bootstrap');//加载bootstrap Ui

var app = angular.module('myApp',[
    'ui.bootstrap',
    ngAnimate,
    'angularFileUpload',
    'controller.upload_work_controller',
    'service.user_service',
    'service.active_server',
]);





