'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */

    var tempFolowPageResult;
    var cacheAttenCount;
    var _ = require("underscore");
    angular.module("controller.user_center_follow",["ng.ueditor"]).
    controller('user_center_follow',['$scope','user_service','FileUploader','pageArray',"$window",'removeCord'
        ,function($scope,user_service,FileUploader,pageArray,$window,removeCord){
        /*****************************数据Model************************************/
            $scope.global_info = GLOBAL_USER_INFO;
            $scope._ = _;




            var followsPage = angular.copy(pageArray);

            $scope.follows = tempFolowPageResult;
            $scope.attentionCount = cacheAttenCount;

            if($scope.follows){
                _.each($scope.follows._array,function(ele){
                    if(ele.isConnect && _.contains(removeCord.removeAttentions,ele._id)){
                        ele.isConnect = false;
                    }
                })
            }


            if(!$scope.follows){
                followsPage.$array = [];
                user_service.getUserFollowsArray(function(err,doc){
                    if(!err){
                        tempFolowPageResult = $scope.follows = followsPage.$init(doc.followers,12);
                        cacheAttenCount = $scope.attentionCount = doc.attentionCount;
                    }
                })
            }



            //移除粉丝
            $scope.cancelFollows = function(cus){

            var confirmIndex =  layer.confirm('您是真的要删除粉丝吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    layer.close(confirmIndex);
                    user_service.removeFollows(cus._id,function(err,info){
                        if(!err){
                            removeCord.removeFollows.push(cus._id);
                            $("#doFans").text((+$("#doFans").text())-1);
                            $scope.follows.$remove(cus);
                        }
                    })
                }, function(){

                });
            }

        }])

