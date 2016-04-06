/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.user_edit_control",[])
        .controller('user_edit_control',['$scope','$window','user_service','FileUploader','$timeout'
        ,function($scope,$window,user_service,FileUploader,$timeout){

            $scope.user = {};

            $scope.userBack = {};

            $scope.jobCate = {};//用户职业分类

            //获取用户信息
            user_service.getUserBaseInfo(function(err,doc){
                if(err){
                    layer.msg("获取用户数据出错");
                }else{
                    $scope.user = doc;


                    $scope.userBack = doc;
                }
            })

            $timeout(function(){
                user_service.getUserJobCate(function(err,doc){
                    if(err)
                        layer.msg("获取用户职业分类出错");
                    $scope.jobCate = doc;
                })
            })



            /**************************上传配置**************************/
            //配置任务图像上传
            var uploader = $scope.uploader = new FileUploader({
                url: '/upload',
                alias:'fileName'
            });
            uploader.onAfterAddingFile = function(item) {
                item.upload();
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                $scope.pojo_custom.imgurl = response.path;
            };

        }])

