'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.user_regist_control",["ng.ueditor"]).
    controller('user_regist_control',['$scope','showCtrl','user_service','FileUploader','pageResult',"$window","dataService"
        ,function($scope,showCtrl,user_service,FileUploader,pageResult,$window,dataService){

            /************************数据模型****************************/
            $scope.show = true;

            $scope.emailForm = {};//email信息

            $scope.webConfig = {};

            /**************************提交邮箱表单****************************/
            //更换验证码
            $scope.changePic = function(){
                $scope.changeRandom = _.random(0,10000);
            }
            $scope.changePic();


            $scope.subEmailInof = function(){
                user_service.subEmailRegist($scope.emailForm)
                    .success(function(data){
                        console.log(data);
                    }).error(function(data){
                        console.log('服务器连接失败');
                    })
            }

            dataService.getConfig()
                .success(function(data){
                    if(data.err){
                        alert("获取网站配置参数数据错误");
                    }else{
                        $scope.webConfig.jobCates = data.result.jobCates;
                        $scope.emailForm.job = $scope.webConfig.jobCates[0];
                    }
                }).error(function(data){
                    alert("获取错误");
            })



            //保存或者更新方法
            $scope.saveOrUpdate = function(cus){
                if(cus)
                    $scope.pojo_custom = cus;
                var array = $scope.pojo_custom.type;
                if(_.isString(array))
                $scope.pojo_custom.type = array.split(' ');
                //保存
                if(!$scope.pojo_custom._id){
                    dataService.saveCustomer($scope.pojo_custom)
                    .success(function(data){
                        if(!data.err){
                            $scope.array_custom.$add(data.result);
                            $scope.show.$set('cuslist');
                        }else{
                            alert(data.err);
                        }
                    }).error(function(data){
                         alert("保存错误");
                    })
                }else{
                    //更新
                    dataService.updateCustomer($scope.pojo_custom)
                        .success(function(data){
                            !data.err ?  $scope.show.$set('cuslist')
                                      :   alert(data.err);
                        }).error(function(data){
                            alert("更新错误");
                        })
                }
            }

        }])

