/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.user_detail_control",[
                                        "ng.ueditor"
    ]).controller('user_detail_control',['$scope','showCtrl','FileUploader','pageResult','$window','user_service'
        ,function($scope,showCtrl,FileUploader,pageResult,$window,user_service){

            /************************数据模型****************************/
            $scope.GLOBAL_USER =GLOBAL_USER;


            /*********************注册show service**************************/
            $scope.show = showCtrl;
            $scope.show.$regist('cuslist',['cuslist'],true);
            $scope.show.$regist('cusadd',['cusadd']);

            /***********************分类列表页面************************/


            pageResult.$loadInit({
                url:"/front/getAllWorks",
                pageSize:8,
                query:{userId:$scope.GLOBAL_USER._id},
            },function(err,result){
                console.log(err,result);
                $scope.works = result;
            })


            //检测切换页面
            $scope.$watch(function(){
                return  $scope.works.$curPage;
            },function(){
                _.delay(function(){
                    $('.showOverPic').lightGallery();
                },1000)
            })


        }])

