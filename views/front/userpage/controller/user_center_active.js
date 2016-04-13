'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var loadPageResult;
    var _ = require("underscore");
    angular.module("controller.user_center_active",["ng.ueditor"]).
    controller('user_center_active',['$scope','user_service','FileUploader','pageResult',"$window"
        ,function($scope,user_service,FileUploader,pageResult,$window){
            /*****************************数据Model************************************/
                $scope.global_info = GLOBAL_USER_INFO;

                var activePage = angular.copy(pageResult);

                if(!loadPageResult) {
                    activePage.$loadInit({
                        url: "/front/getJoinAllActive",
                        pageSize: 8,
                        query:{"collects":{"$in":[GLOBAL_USER_INFO._id]}}
                    }, function (err, result) {
                        loadPageResult = result;
                        $scope.actives = loadPageResult;
                    })
                }else{
                    $scope.actives = loadPageResult;
                }

        }])

