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
                            layer.msg('登录成功！');
                            window.parent.location.reload();
                            setTimeout(function(){
                                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                                console.log(index);
                                parent.layer.close(index);
                            },1000)
                        }else{
                            $scope.changePic();
                            layer.alert(data.err, {
                                icon: 2,
                                skin: 'layer-ext-moon'
                            })
                        }
                    }).error(function(data){


                    })
            }
        }])

