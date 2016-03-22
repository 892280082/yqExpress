'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    var md5 = require("md5");
    angular.module("controller.user_login_control",["ng.ueditor"]).
    controller('user_login_control',['$scope','showCtrl','user_service','FileUploader','pageResult',"$window","dataService","$interval"
        ,function($scope,showCtrl,user_service,FileUploader,pageResult,$window,dataService,$interval){
            /*****************************数据Model************************************/
                $scope.subForm = {};


            /**************************控制器************************************/
            var cryptoPassword = function(pojo){
                var newUser = _.clone(pojo);
                newUser.password = md5(newUser.password);
                return newUser;
            }


            //更换验证码
            $scope.changePic = function(){
                $scope.changeRandom = _.random(0,10000);
            }
            $scope.changePic();

            //提交表单
            $scope.subInfo = function(){
                user_service.subLoginInfo(cryptoPassword($scope.subForm))
                    .success(function(data){
                        if(!data.err){
                            alert("登录成功！！！");
                        }else{
                            layer.alert(data.err, {
                                icon: 1,
                                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
                            })
                        }
                    }).error(function(data){


                    })
            }
        }])

