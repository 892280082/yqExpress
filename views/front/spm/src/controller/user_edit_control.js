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

                    $scope.$watch(function(){//个人描述_字数监听
                        return $scope.user.introduce;
                    },function(){
                        if($scope.user.introduce.length > 200){
                            $scope.user.introduce = $scope.user.introduce.substring(0,200)
                        }
                    })
                }
            })

            $timeout(function(){
                user_service.getUserJobCate(function(err,doc){
                    if(err)
                        layer.msg("获取用户职业分类出错");
                    $scope.jobCate = doc.jobCates;
                })
            })


            //提交信息修改
            $scope.subChangeInfo = function(){
                user_service.updateUserInfo($scope.user,function(err,info){
                    err ? layer.msg("更新错误!") : layer.msg('更新成功!');

                    setTimeout(function(){
                        window.location.reload();
                    },1500)
                })
            }


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
                $scope.user.imgurl = response.path;
            };

            var fileType = ['jpg','png','gif'];
            uploader.filters.push({
                name: 'queueLimit',
                fn: function(item /*{File|FileLikeObject}*/, options) {

                    var ext = _.last(item.name.split("."));
                    if(!_.contains(fileType,ext)){
                        layer.alert('图片格式必须为'+fileType,{
                            icon: 0,
                            skin: 'layer-ext-moon'
                        });
                        return false;
                    }

                    if(item.size > 1000*1000){
                        layer.alert('图片大小不得超过'+1000 +'KB',{
                            icon: 0,
                            skin: 'layer-ext-moon'
                        });
                        return false;
                    }
                    return true;
                }
            })

        }])

