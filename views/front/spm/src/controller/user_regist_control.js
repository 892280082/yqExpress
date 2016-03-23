'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    var md5 = require("md5");
    angular.module("controller.user_regist_control",["ng.ueditor"]).
    controller('user_regist_control',['$scope','showCtrl','user_service','FileUploader','pageResult',"$window","dataService","$interval"
        ,function($scope,showCtrl,user_service,FileUploader,pageResult,$window,dataService,$interval){

            /************************数据模型****************************/
            $scope.show = true;

            $scope.emailForm = {policy:false};//email信息

            $scope.telForm = {};//手机信息注册

            $scope.webConfig = {};

            $scope.sendMessage = 60;

            /**************************提交邮箱表单****************************/
            //更换验证码
            $scope.changePic = function(){
                $scope.changeRandom = _.random(0,10000);
            }
            $scope.changePic();

            //时间倒计时
            $scope.startCount = function(){
               var timePromise =  $interval(function(){
                   $scope.sendMessage--;
                   if($scope.sendMessage === 0){
                       $interval.cancel(timePromise);
                       $scope.sendMessage = 60;
                   }
                },1000)
            }


            //加密上传对象的密码
            var cryptoPassword = function(pojo){
                var newUser = _.clone(pojo);
                newUser.password = md5(newUser.password);
                return newUser;
            }

            //获取登录邮箱页面
            var getEmailUrl = function(email){
                return gotoEmail(email);
            }

            //邮箱注册提交
            $scope.subEmailInof = function(){
                var index = layer.load(1, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
                user_service.subEmailRegist(cryptoPassword($scope.emailForm))
                    .success(function(data){
                        layer.close(index);
                        if(!data.err){
                            var url = getEmailUrl($scope.emailForm.email);
                            if(url) {
                                layer.confirm('注册成功，前往验证邮箱!', {
                                    btn: ['确定','取消'] //按钮
                                }, function(){
                                    window.location.href = "http://" + url;
                                }, function(){

                                });
                            }else{
                                layer.alert('邮箱注册成功', {
                                    icon: 1,
                                    skin: 'layer-ext-moon'
                                })
                            }
                        }else{
                            $scope.changePic();
                            layer.alert(data.err, {
                                icon: 0,
                                skin: 'layer-ext-moon'
                            })
                        }
                    }).error(function(data){
                        $scope.changePic();
                        layer.close(index);
                        layer.alert(data.err, {
                            icon: 0,
                            skin: 'layer-ext-moon'
                        })
                    })
            }

            //提交手机注册信息
            $scope.subTelInfo = function(){
                user_service.subTelRegist(cryptoPassword($scope.telForm))
                    .success(function(data){
                        console.log(data);
                    }).error(function(data){
                        console.log('服务器连接失败');
                    })
            }

            //获取职业分类信息
            dataService.getConfig()
                .success(function(data){
                    if(data.err){
                        alert("获取网站配置参数数据错误");
                    }else{
                        $scope.webConfig.jobCates = data.result.jobCates;
                        $scope.emailForm.job = $scope.webConfig.jobCates[0];
                        $scope.telForm.job = $scope.webConfig.jobCates[0];
                    }
                }).error(function(data){
                    alert("获取错误");
            })

            function gotoEmail($mail) {
                var $t = $mail.split('@')[1];
                $t = $t.toLowerCase();
                if ($t == '163.com') {
                    return 'mail.163.com';
                } else if ($t == 'vip.163.com') {
                    return 'vip.163.com';
                } else if ($t == '126.com') {
                    return 'mail.126.com';
                } else if ($t == 'qq.com' || $t == 'vip.qq.com' || $t == 'foxmail.com') {
                    return 'mail.qq.com';
                } else if ($t == 'gmail.com') {
                    return 'mail.google.com';
                } else if ($t == 'sohu.com') {
                    return 'mail.sohu.com';
                } else if ($t == 'tom.com') {
                    return 'mail.tom.com';
                } else if ($t == 'vip.sina.com') {
                    return 'vip.sina.com';
                } else if ($t == 'sina.com.cn' || $t == 'sina.com') {
                    return 'mail.sina.com.cn';
                } else if ($t == 'tom.com') {
                    return 'mail.tom.com';
                } else if ($t == 'yahoo.com.cn' || $t == 'yahoo.cn') {
                    return 'mail.cn.yahoo.com';
                } else if ($t == 'tom.com') {
                    return 'mail.tom.com';
                } else if ($t == 'yeah.net') {
                    return 'www.yeah.net';
                } else if ($t == '21cn.com') {
                    return 'mail.21cn.com';
                } else if ($t == 'hotmail.com') {
                    return 'www.hotmail.com';
                } else if ($t == 'sogou.com') {
                    return 'mail.sogou.com';
                } else if ($t == '188.com') {
                    return 'www.188.com';
                } else if ($t == '139.com') {
                    return 'mail.10086.cn';
                } else if ($t == '189.cn') {
                    return 'webmail15.189.cn/webmail';
                } else if ($t == 'wo.com.cn') {
                    return 'mail.wo.com.cn/smsmail';
                } else if ($t == '139.com') {
                    return 'mail.10086.cn';
                } else {
                    return '';
                }
            };

        }])

