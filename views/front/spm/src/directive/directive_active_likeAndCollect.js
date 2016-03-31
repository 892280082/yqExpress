/**
 * @desc 用户和活动的交互  喜欢&收藏
 * @author yq
 * @date 216/3/31
 * @example
     <active-like actid="<%- active._id %>" cusid="<%- $session.USER._id %>"></active-like>

     <active-collect actid="<%- active._id %>" cusid="<%- $session.USER._id %>"></active-collect>
 * */
"use strict;"
require("../service/user_service.js")
require("../service/active_server.js")
var _ = require("underscore");


var activeCache;
angular.module("directive_active_likeAndCollect",["service.user_service"])
    .directive("activeLike",["user_service","$http","active_server",function(user_service,$http,active_server){
        return {
            restrict:"EAC",
            template:'<span ng-show="!userStatu.likeFlag"><a title="喜欢" ng-click="likeCurrActive()"><img src="/front/resource/images/lisk.jpg" /></a>' +
                     '<p>{{ userStatu.active.likes.length  }}人喜欢/点击喜欢</p></span>'+
                     '<span ng-show="userStatu.likeFlag"><a title="喜欢" ng-click="cancelCurrLikeActive()" ><img src="/front/resource/images/lisk.jpg" /></a>' +
                     '<p>{{ userStatu.active.likes.length  }}人喜欢/点击不喜欢</p></span>',
            scope:{
                activeStatu:'=activeStatu',
                active:"=active"
            },
            link:function(scope, element, attr,ctrl){
                /*********************指令参数配置*******************************/
                var cusId = attr.cusid;//名家ID
                var actId = attr.actid;//活动ID

                if(!cusId){
                    console.log("你应该设置用户ID attr.cusid");
                }

                if(scope.active){
                    activeCache = scope.active;
                }else if(!actId){
                    alert('你必须设置活动ID actid=<%- actid._id %>');
                    return false;
                }


                scope.userStatu = {
                    active:{},//活动对象
                    likeFlag:false,//是否已喜欢
                    collectFlag:false,//是否已收藏
                }
                /**********************model*******************************/

                if(!activeCache) { //获取活动该信息
                    active_server.getActiveBaseByIdVa(actId,function(err,doc){
                        err && console.log(err);
                        activeCache = doc;
                        scope.userStatu.active = activeCache;

                        if(!cusId)
                            return false;

                        scope.userStatu.likeFlag = !!_.find(activeCache.likes,function(ele){
                            return cusId === ele;
                        })

                        scope.userStatu.collectFlag = !!_.find(activeCache.collects,function(ele){
                            return cusId === ele;
                        })

                    })
                }

                //收藏当前活动
                scope.likeCurrActive = function(){
                    user_service.validateLoginState(function(){
                        user_service.userLikeActive(actId,function(err,info){
                            if(!err){
                                scope.userStatu.likeFlag = true;
                                scope.userStatu.active.likes.push(cusId);
                            }else{
                                console.log("喜欢出错");
                            }
                        })
                    })
                }

                //取消收藏当前活动
                scope.cancelCurrLikeActive = function(){
                    user_service.validateLoginState(function(){
                        user_service.cancelLikeActiveById(actId,function(err,info){
                            if(!err){
                                scope.userStatu.likeFlag = false;
                                scope.userStatu.active.likes.pop(cusId);
                            }else{
                                console.log("喜欢出错");
                            }
                        })
                    })
                }

            }
        };
    }]).directive("activeCollect",["user_service","$http","active_server",function(user_service,$http,active_server){
        return {
            restrict:"EAC",
            template:'<span ng-show="!userStatu.collectFlag"><a title="收藏" ng-click="collectCurrActive()"><img src="/front/resource/images/scang.jpg" /></a>' +
            '<p>{{ userStatu.active.collects.length  }}人收藏/点击收藏</p></span>'+
            '<span ng-show="userStatu.collectFlag"><a title="收藏" ng-click="cancelCurrLikeActive()" ><img src="/front/resource/images/scang.jpg" /></a>' +
            '<p>{{ userStatu.active.collects.length  }}人收藏/点击不收藏</p></span>',
            scope:{
                activeStatu:'=activeStatu',
                active:"=active"
            },
            link:function(scope, element, attr,ctrl){
                /*********************指令参数配置*******************************/
                var cusId = attr.cusid;//名家ID
                var actId = attr.actid;//活动ID

                if(!cusId){
                    console.log("你应该设置用户ID attr.cusid");
                }

                if(scope.active){
                    activeCache = scope.active;
                }else if(!actId){
                    alert('你必须设置活动ID actid=<%- actid._id %>');
                    return false;
                }


                scope.userStatu = {
                    active:{},//活动对象
                    likeFlag:false,//是否已喜欢
                    collectFlag:false,//是否已收藏
                }
                /**********************model*******************************/

                if(!activeCache) { //获取活动该信息
                    active_server.getActiveBaseByIdVa(actId,function(err,doc){
                        err && console.log(err);
                        activeCache = doc;
                        scope.userStatu.active = activeCache;

                        if(!cusId)
                            return false;

                        scope.userStatu.likeFlag = !!_.find(activeCache.likes,function(ele){
                            return cusId === ele;
                        })

                        scope.userStatu.collectFlag = !!_.find(activeCache.collects,function(ele){
                            return cusId === ele;
                        })

                    })
                }

                //收藏当前活动
                scope.collectCurrActive = function(){
                    user_service.validateLoginState(function(){
                        user_service.userCollectActive(actId,function(err,info){
                            if(!err){
                                scope.userStatu.collectFlag = true;
                                scope.userStatu.active.collects.push(cusId);
                            }else{
                                console.log("收藏出错");
                            }
                        })
                    })
                }

                //取消收藏当前活动
                scope.cancelCurrLikeActive = function(){
                    user_service.validateLoginState(function(){
                        user_service.cancelUserCollectActive(actId,function(err,info){
                            if(!err){
                                scope.userStatu.collectFlag = false;
                                scope.userStatu.active.collects.pop(cusId);
                            }else{
                                console.log("喜欢出错");
                            }
                        })
                    })
                }

            }
        };
    }])

