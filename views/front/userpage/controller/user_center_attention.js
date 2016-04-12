'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */

var tempAttenPageResult;
var cacheFolowCount;
var _ = require("underscore");
angular.module("controller.user_center_attention",["ng.ueditor"]).
    controller('user_center_attention',['$scope','user_service','FileUploader','pageArray',"$window"
        ,function($scope,user_service,FileUploader,pageArray,$window){
            /*****************************数据Model************************************/
            $scope.global_info = GLOBAL_USER_INFO;
            $scope._ = _;

            var followsPage = angular.copy(pageArray);

            $scope.attentions = tempAttenPageResult;
            $scope.followCount = cacheFolowCount;

            if(!$scope.attentions){
                followsPage.$array = [];
                user_service.getUserAttentionsArray(function(err,doc){
                    if(!err){
                        tempAttenPageResult = $scope.attentions = followsPage.$init(doc.attentions,12);
                        cacheFolowCount = $scope.followCount = doc.followCount;
                    }
                })
            }

            //移除粉丝
            $scope.cancelattentions = function(cus){

                var confimIndex = layer.confirm('您是真的要取消关注吗？',{
                        btn: ['确定','取消'] //按钮
                    }, function(){

                        user_service.cencalAttentionUser(cus._id)
                        .success(function(data){
                            if(!data.err){
                                $scope.attentions.$remove(cus);
                            }else{
                                layer.msg('取消关注出错');
                            }
                            layer.close(confimIndex);
                        })

                    },function(){

                    });
            }

        }])

