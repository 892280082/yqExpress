/**
 * @desc 处理用户数据
 * @author yq
 * @date 2016/2/29
 * */
var angular = require("angular");
require("../../lib/jsExtend.js");//加载 原型扩展
require("../../lib/src/directive/areaSelect/templates.js");//地区选择器模板
require("../../lib/src/directive/areaSelect/china-area-selector.js");//地区选择器模板
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


app.directive('remoteValidation',["$http",function($http){
    return {
        require : 'ngModel',
        link : function(scope, elm, attrs, ctrl) {
            elm.bind('blur', function() {
                var data = {};

                if(attrs.ingnore == ctrl.$viewValue){
                    return ctrl.$setValidity('remote',true)
                }


                data[attrs.param] = ctrl.$viewValue;
                $http.post("/api/checkUserInfo",{"pojo":data})
                    .success(function(data){
                        !data.err ? ctrl.$setValidity('remote',true)
                            : ctrl.$setValidity('remote',false);
                    }).error(function(data){
                        console.log("连接服务器异常");
                        ctrl.$setValidity('remote',false);
                    })
            });
        }
    };
}])

app.directive('passwordValidation',function(){
    return {
        require : 'ngModel',
        scope:{
            repassword:'='
        },
        link : function(scope, elm, attrs, ctrl) {
            elm.bind('keyup', function() {
                var flag = scope.repassword === ctrl.$viewValue;
                ctrl.$setValidity('repassword',flag);
                scope.$watch(function(){
                    return scope.repassword;
                },function(){
                    var flag = scope.repassword === ctrl.$viewValue;
                    ctrl.$setValidity('repassword',flag);
                })
                scope.$apply();
            });
        }
    };
});



