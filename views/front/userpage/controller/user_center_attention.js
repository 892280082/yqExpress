'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */

    var tempFolowPageResult;
    var _ = require("underscore");
    angular.module("controller.user_center_attention",["ng.ueditor"]).
    controller('user_center_attention',['$scope','user_service','FileUploader','pageResult',"$window"
        ,function($scope,user_service,FileUploader,pageResult,$window){
        /*****************************数据Model************************************/
            $scope.global_info = GLOBAL_USER_INFO;

            var followsPage = angular.copy(pageResult);
            var attentionPage = angular.copy(pageResult);

            $scope.follows = tempFolowPageResult;

            if(!$scope.works){
                follwsPage.$loadInit({
                    url:"/front/getAllWorks",
                    pageSize:12,
                    query:{userId:$scope.global_info._id},
                },function(err,result){
                    console.log(err,result);
                    tempPageResult = result;
                    $scope.works = tempPageResult;
                })
            }

        }])

