/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.cus_detail_control",[
                                        "ng.ueditor"
    ]).controller('cus_detail_control',['$scope','showCtrl','FileUploader','pageResult','$window'
        ,function($scope,showCtrl,FileUploader,pageResult,$window){
            //克隆
            var ariPageResult;
            angular.copy(pageResult,ariPageResult);
            /************************数据模型****************************/
            $scope.globalInfo = GLOBAL_USER_INFO;

            //设置用户的权限分配
            $scope.userPowers = [{name:"普通用户",usertype:1},{name:"名人",usertype:2}]
            //注册或者添加的中间变量
            $scope.pojo_custom = {};
            //保存用户数据数组
            $scope.array_custom = [];
            //查询Pojo
            $scope.search_custom = {"$$_title":"",usertype:""};

            /*********************注册show service**************************/
            $scope.show = showCtrl;
            $scope.show.$regist('cuslist',['cuslist'],true);
            $scope.show.$regist('cusadd',['cusadd']);

            /***********************分类列表页面************************/

            //获取用户创品
            pageResult.$loadInit({
                url:"/front/getCurCusPro/"+$scope.globalInfo._id,
                pageSize:8,
                skip:0
            },function(err,result){
                $scope.array_custom = result;
            })

            //获取用户文章
            pageResult.$loadInit({
                url:"/front/getCurCusAri/"+$scope.globalInfo._id,
                pageSize:8,
                skip:0
            },function(err,result){
                $scope.array_custom = result;
            })

            //查询方法
            $scope.search = function(){
                $scope.array_custom.$search($scope.search_custom);
            }

            $scope.validateTime = function(startData,overData,infos) {
                var currentTime = new Date();
                if (currentTime < startData)
                    return infos[0];
                if (currentTime >= startData && currentTime <= overData)
                    return infos[1];
                else
                    return infos[2];
            }


        }])

