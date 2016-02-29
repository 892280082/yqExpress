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
    this.validateUser = function(userInfo){
        var md5Password = md5(userInfo.password);
        return $http.post("/back/validateUser",{"pojo":{
            "name":userInfo.name,
            "password":md5Password,
            "yanzhenma":userInfo.yanzhenma
        }});
    };
    this.test = function(){
        alert("adsf");
    }
}]) ;

app.controller("main",["$scope","loginService","$location"
    ,function($scope,loginService,$location){
        //用户信息
        $scope.userInfo = {
            "name":"",
            "password":"",
            "yanzhenma":""
        }
        //更换验证码
        $scope.picUrl = '/yanzhenma';
        $scope.changePic = function(){
            $scope.picUrl = '/yanzhenma?'+Math.random()*10000;
        }
        //提交用户信息
        $scope.tipUserInfo = function(){
            var userInfo = $scope.userInfo;
            if(!userInfo.name || !userInfo.password){
                alert("请输入账号或密码");
                return;
            }else if(!userInfo.yanzhenma){
                alert("请输入验证码");
                return;
            }else {
                loginService.validateUser($scope.userInfo)
                    .success(function (data) {
                        if(data.result){
                            window.location.href = "/back/main"
                        }else{
                            alert(data.error);
                        }
                    }).error(function (data) {
                        alert("系统错误");
                    })
            }
        }
}])

