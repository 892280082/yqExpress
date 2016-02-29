/**
 * @desc 前台登陆js
 * @author yq
 * @date 2016/2/29
 * */
//更换图片
var angular = require("angular");
var md5 = require("md5");


var app =  angular.module("login",[]);

app.service("loginService",["$http",function($http){



}]) ;

app.controller("main",["$scope","loginService"
    ,function($scope,loginService){



        $scope.picUrl = '/yanzhenma';
        $scope.changePic = function(){
            $scope.picUrl = '/yanzhenma?'+Math.random()*10000;
        }
}])

