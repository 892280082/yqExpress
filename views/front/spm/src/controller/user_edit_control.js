/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.user_edit_control",[])
        .controller('user_edit_control',['$scope','$window','user_service','FileUploader','$timeout','$interval'
        ,function($scope,$window,user_service,FileUploader,$timeout,$interval){

            $scope.user = {}; //用户基本信息对象

            $scope.userBack = {};

            $scope.jobCate = {};//用户职业分类

            $scope.emailPojo = { //邮箱绑定对象
                email:"",
                yanzhenma:"",
            }

            $scope.phonePojo = { //手机绑定对象
                phoneNumber:"",
                yanzhenma:""
            }

            $scope.passwordPojo = { //密码重置对象
                oldPass:"",
                newPass:'',
                rePass:'',
            }

            $scope.sendEmailMessage = 60; //邮箱倒计时
            //时间倒计时
            $scope.startCount = function(){
                var timePromise =  $interval(function(){
                    $scope.sendEmailMessage--;
                    if($scope.sendEmailMessage === 0){
                        $interval.cancel(timePromise);
                        $scope.sendEmailMessage = 60;
                    }
                },1000)
            }



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

            //获取用户职业分类
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

            //提交用户邮箱修改信息
            $scope.subEmailChange = function(){
                var re= /\w@\w*\.\w/;
                if($scope.emailPojo.email && !re.test($scope.emailPojo.email)){
                    return layer.msg("请输入合法邮箱");
                }
                if(!$scope.emailPojo.yanzhenma)
                    return layer.msg("请输入验证码");

                user_service.updateUserImportInfo($scope.emailPojo,function(err,info){
                    err ? layer.msg(err) : layer.msg('更新成功!');

                    setTimeout(function(){
                        window.location.reload();
                    },1500)
                })
            }

            //发送邮箱验证码
            $scope.subEmailYzm = function(){
                var re= /\w@\w*\.\w/;
                if(!$scope.emailPojo.email && !re.test($scope.emailPojo.email)){
                    return layer.msg("请输入合法邮箱");
                }
                $scope.startCount();
                user_service.sendEmailYzm($scope.emailPojo.email,function(err,info){
                    if(err) {
                        layer.alert('邮箱验证码发送错误', {
                            icon: 2,
                            skin: 'layer-ext-moon'
                        })
                    }
                })
            }

            //更改密码
            $scope.changePassword = function(){
                user_service.userChangePassword(
                    $scope.passwordPojo.oldPass,$scope.passwordPojo.newPass,function(err,info){
                        if(!err){
                            layer.msg('更新成功,请重新登录!');
                            setTimeout(function(){
                                window.location.href = '/regist/login';
                            },1500)
                        }else{
                            layer.alert(err, {
                                icon: 2,
                                skin: 'layer-ext-moon'
                            })
                        }
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

