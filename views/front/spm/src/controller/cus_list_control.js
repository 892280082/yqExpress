/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.cus_list_control",[
                                        "ng.ueditor"
    ]).controller('cus_list_control',['$scope','showCtrl','FileUploader','pageResult','$window','user_service'
        ,function($scope,showCtrl,FileUploader,pageResult,$window,user_service){
            /************************数据模型****************************/
            //设置用户的权限分配
            $scope.userPowers = [{name:"普通用户",usertype:1},{name:"名人",usertype:2}]
            //注册或者添加的中间变量
            $scope.pojo_custom = {};
            //保存用户数据数组
            $scope.array_custom = [];
            //查询Pojo
            $scope.search_custom = {"$$_title":"",usertype:""};
            //用户信息
            $scope.user = GLOBAL_USER_INFO;

            $scope._ = _;
            /*********************注册show service**************************/
            $scope.show = showCtrl;
            $scope.show.$regist('cuslist',['cuslist'],true);
            $scope.show.$regist('cusadd',['cusadd']);
            /***********************分类列表页面************************/

            var isAttention = function(array){
                if(!$scope.user._id)
                    return;
                _.each(array,function(ele){
                    if(ele.isAttention)
                        return;
                    ele.isAttention = !!_.contains(ele.followers,$scope.user._id);
                });
            };

            $scope.requestCount = 0;
            //初始获取创品信息
            var getData = function(){
                if($scope.requestCount){
                    $scope.array_custom.$toNext();
                    isAttention($scope.array_custom.$array);
                    $scope.$digest();
                }else{
                    pageResult.$loadInit({
                        url:"/front/getUserList",
                        pageSize:8,
                        waterfull:true,
                        sort:{topno:-1},
                        query:{"cate1.cateId":1}
                    },function(err,result){
                        $scope.array_custom = result;
                        isAttention($scope.array_custom.$array);
                        $scope.requestCount++;;
                    })
                }
            };

            //关注用户
            $scope.attenCustomer = function(cus){

                    user_service.validateLoginState(function(){


                        user_service.attentionUser(cus._id)
                            .success(function(data){
                                if(!data.err){
                                    layer.msg('关注成功');
                                    cus.isAttention = true;
                                }else{
                                    console.log("推送错误");
                                }
                            })

                    })
            }







            //查询方法
            $scope.search = function(){
                $scope.array_custom.$search($scope.search_custom);
            };

            setInterval(function(){
                if ($(document).scrollTop() + $(window).height() > $(document).height() - 100) {
                    getData();
                }
            },100);


        }]);

