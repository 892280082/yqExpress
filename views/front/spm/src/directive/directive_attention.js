/**
 <attention-load
     count="<%- user.followers.length  %>"
     cusid="<%- user._id %>"
     fanscount=follwsCount
 >
 </attention-load>
 * */
"use strict;"
require("../service/user_service.js")
var _ = require("underscore");
angular.module("directive-attention",["service.user_service"])
    .directive("attentionLoad",["user_service","$http",function(user_service,$http){
    return {
        restrict:"EAC",
        template:'<aa class="gz"  ng-click="cancelAttention()" style="cursor: pointer;" ng-show="attenFlag">取消关注</aa>' +
                 '<aa class="gz"  ng-click="addAttention()" style="cursor: pointer;" ng-show="!attenFlag">关注</aa>',
        scope:{
            fanscount:'=fanscount'
        },
        link:function(scope, element, attr,ctrl){
            var autherId = attr.cusid;//名家ID
            scope.fanscount = +attr.count;

            user_service.getAttentionState(autherId)
                .success(function(data){
                    if(!data.err){
                        scope.attenFlag = data.result;
                        console.log("data.result",data.result);
                    }else{
                        console.log(data.err);
                        scope.attenFlag = false;
                    }
                }).error(function(data){

                })

            //关注用户
            scope.addAttention = function(){
                user_service.validateLoginState(function(){
                    user_service.attentionUser(autherId)
                        .success(function(data){
                            if(!data.err){
                                scope.attenFlag = !scope.attenFlag;
                                    scope.fanscount++;
                            }else{
                                console.log("推送错误");
                            }
                        })
                })
            }

            //取消关注
            scope.cancelAttention = function(){
                user_service.cencalAttentionUser(autherId)
                    .success(function(data){
                        if(!data.err){
                            scope.attenFlag = !scope.attenFlag;
                                scope.fanscount--;
                        }else{
                            console.log("推送错误");
                        }
                    })
            }

        }
    };
}])

