/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.active_detail_control",[
                                        "ng.ueditor"
    ]).controller('active_detail_control',['$scope','showCtrl','FileUploader','pageResult','user_service'
        ,function($scope,showCtrl,FileUploader,pageResult,user_service) {
            /************************数据模型****************************/



            /***************************控制*****************************/
            //提交名单
            $scope.doJoinActive = function(){
                user_service.validateLoginState(function(){
                    layer.open({
                        type: 1,
                        title: false,
                        closeBtn: 0,
                        area: '417px',
                        //skin: 'layui-layer-nobg', //没有背景色
                        shadeClose: true,
                        content: $('#activeForm').html()
                    });
                })
            }

        }])

