'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */

    var tempPageResult;
    var _ = require("underscore");
    angular.module("controller.user_center_work",["ng.ueditor"]).
    controller('user_center_work',['$scope','user_service','FileUploader','pageResult',"$window"
        ,function($scope,user_service,FileUploader,pageResult,$window){
        /*****************************数据Model************************************/
            $scope.global_info = GLOBAL_USER_INFO;

            $scope.works = tempPageResult;

            if(!$scope.works){
                pageResult.$loadInit({
                    url:"/front/getAllWorks",
                    pageSize:8,
                    query:{userId:$scope.global_info._id},
                },function(err,result){
                    console.log(err,result);
                    tempPageResult = result;
                    $scope.works = tempPageResult;
                })
            }


            //检测切换页面
            $scope.$watch(function(){
                return  $scope.works.$curPage;
            },function(){
                _.delay(function(){
                    $('.showOverPic').lightGallery();
                },1000)
            })





        }])

