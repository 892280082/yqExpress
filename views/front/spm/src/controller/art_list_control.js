/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.art_list_control",[
                                        "ng.ueditor"
    ]).controller('art_list_control',['$scope','showCtrl','FileUploader','pageResult','$window'
        ,function($scope,showCtrl,FileUploader,pageResult,$window){
            /************************数据模型****************************/
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
            $scope.requestCount = 0;
            //初始获取创品信息
            var getData = function(){
                if($scope.requestCount){
                    $scope.array_custom.$toNext();
                }else{
                    pageResult.$loadInit({
                        url:"/front/getArticleList",
                        pageSize:12,
                        waterfull:true,
                        skip:1
                    },function(err,result){
                        $scope.array_custom = result;
                        $scope.requestCount++;
                    })
                }
            }
            //查询方法
            $scope.search = function(){
                $scope.array_custom.$search($scope.search_custom);
            }


            setInterval(function(){
                if ($(document).scrollTop() + $(window).height() > $(document).height() - 100) {
                    getData();
                }
            },100);


        }])

