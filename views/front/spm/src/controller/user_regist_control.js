'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.user_regist_control",["ng.ueditor"]).
    controller('user_regist_control',['$scope','showCtrl','user_service','FileUploader','pageResult',"$window"
        ,function($scope,showCtrl,user_service,FileUploader,pageResult,$window){

            /************************数据模型****************************/

            $scope.show = true;

            $scope.emailInfo = {};//email信息


            /**************************提交表单****************************/
            $scope.subEmailInof = function(){
                alert("aaa");
            }


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

