/**
 * @desc 处理用户数据
 * @author yq
 * @date 2016/2/29
 * */
var angular = require("angular");
require("../../lib/jsExtend.js");//加载 原型扩展
require("./src/service/art_detail_server.js");//创品服务
require("./src/service/pro_list_server.js");//创品服务
require("./src/service/dataService.js");//数据分类服务
require("../../bower_components/angular/angular-file-upload.min.js");///**加载上传插件*/
require("./src/service/user_service.js");//用户服务
require("./src/service/active_server.js");//用户服务
require("./src/controller/user_edit_control.js");//上传作品控制器

var app = angular.module('myApp',[
    'china-area-selector',
    'angularFileUpload',
    'controller.user_edit_control',
    'service.user_service',
    'service.active_server',
]);





