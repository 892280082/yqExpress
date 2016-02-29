'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    angular.module("controller.main",[
        "ng.ueditor"
    ]).controller('main',['$scope','showCtrl','dataService','FileUploader'
        ,function($scope,showCtrl,dataService,FileUploader){
            /*********************注册show service**************************/
            $scope.show = showCtrl;
            $scope.show.$regist('catelist',['catelist'],true);
            $scope.show.$regist('articlelist',['articlelist']);
            $scope.show.$regist('articleadd',['articleadd']);
            /***********************分类列表************************/
            //获取所有用户信息
            dataService.getAllCustomData({})
                .success(function(data){

                }).error(function(data){

                })


        }]);