'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.main",["ng.ueditor"]).
    controller('main',['$scope','showCtrl','dataService','FileUploader','pageResult',"$window"
        ,function($scope,showCtrl,dataService,FileUploader,pageResult,$window){
            /************************数据模型****************************/
            //设置用户的权限分配
            $scope.userPowers = [{name:"普通用户",value:"1"},{name:"名人",value:"2"}]
            //注册或者添加的中间变量
            $scope.pojo_custom = {};
            //保存用户数据数组
            $scope.array_custom = [];
            //查询Pojo
            $scope.search_custom = {"$$_title":""};
            //获取作品分类信息
            $scope.productCate = [];
            //所有分类信息
            $scope.webConfig = {};
            /*********************注册show service**************************/
            $scope.show = showCtrl;
            $scope.show.$regist('cuslist',['cuslist'],true);
            $scope.show.$regist('cusadd',['cusadd']);
            /***********************分类列表页面************************/

            //初始获取所有活动信息
            pageResult.$loadInit({
                                url:"/back/actGetAllData",
                                pageSize:15,
                                query:{},
            },function(err,result){
                $scope.array_custom = result;
            })

            $scope._ = _;

            //查询方法
            $scope.search = function(){
                $scope.array_custom.$search($scope.search_custom);
            }

            //设置关键字
            $scope.manngerKey = function(){
                $(".ttty").fadeIn();
            }

            //初始获取所有分类信息
            dataService.getConfig()
                .success(function(data){
                    if(data.err){
                        console.log(data.err);
                        alert("获取网站配置参数数据错误");
                    }else{
                        $scope.webConfig = data.result;
                    }
                }).error(function(data){
                    alert("获取错误");
                })

            //删除子分类
            $scope.removeCate = function(parent,child){
                var flag = $window.confirm("真的要删除这个分类？")
                if(!flag)
                    return false;
                parent.remove(child);
            }

            //重置子分类
            $scope.resetWorkCate = function(){
                var tFlag = $window.confirm("真的要重置吗？");
                if(!tFlag)
                    return false;
                $scope.pojo_custom.workCate = $scope.webConfig.workCates;
            }

            //删除方法
            $scope.removeCustom = function(cus){
                var tFlag = $window.confirm("真的要添加吗");
                if(!tFlag)
                    return false;
                dataService.removeCustomer(cus._id,cus._userId)
                    .success(function(data){
                        if(data.err){
                            alert(data.result);
                        }else{
                            $scope.array_custom.$remove(cus);
                        }
                    }).error(function(data){
                        alert("系统错误");
                    })
            }

            //对象的拷贝
            function deepCopy(source) {
                var result={};
                for (var key in source) {
                    result[key] = typeof source[key]==='object'
                        ? deepCopy(source[key])
                        : source[key];
                }
                return result;
            }

            //进入添加页面
            $scope.changeIntoEdit = function(custom){
                if(!custom){
                    $scope.pojo_custom = {};
                    $scope.pojo_custom.keyword = [];
                    $scope.pojo_custom.workCate = [];
                    $scope.pojo_custom.checkcounts = 0;
                    $scope.pojo_custom.organize = '安徽雅集文化研究中心';
                    $scope.pojo_custom.copyRight = '安徽雅集文化传媒版权所有';
                    $scope.pojo_custom.topno=0;
                    $scope.pojo_custom.status = true;
                }else{
                        $scope.pojo_custom = custom;
                }
                if(!$scope.pojo_custom.workCate || $scope.pojo_custom.workCate.length<1){
                    $scope.pojo_custom.workCate =  deepCopy($scope.webConfig.workCates);
                }
                this.show.$set("cusadd");
            }
            /***********************添加或编辑用户页面*****************************/
            //返回用户列表页面
            $scope.toPageList = function(){
                $scope.show.$set('cuslist');
            }

            //保存或者更新方法
            $scope.saveOrUpdate = function(){
                //保存
                if(!$scope.pojo_custom._id){
                    dataService.saveCustomer($scope.pojo_custom)
                    .success(function(data){
                        if(!data.err){
                            $scope.array_custom.$add(data.result);
                            $scope.show.$set('cuslist');
                        }else{
                            alert(data.err);
                        }
                    }).error(function(data){
                         alert("保存错误");
                    })
                }else{
                    //更新
                    dataService.updateCustomer($scope.pojo_custom)
                        .success(function(data){
                            !data.err ?  $scope.show.$set('cuslist')
                                      :   alert(data.err);
                        }).error(function(data){
                            alert("更新错误");
                        })
                }
            }
            //选定状态
            $scope.validateTime = function(startData,overData,infos) {
                var currentTime = new Date();
                startData = new Date(startData);
                overData = new Date(overData);
                console.log(currentTime,overData,currentTime<overData);

                if (currentTime < startData)
                    return infos[0];
                if (currentTime >= startData && currentTime <= overData)
                    return infos[1];
                else
                    return infos[2];
            }



            /**************************上传配置**************************/
             //配置大图图像上传
            var uploader = $scope.uploader = new FileUploader({
                url: '/upload',
                alias:'fileName'
            });
            uploader.onAfterAddingFile = function(item) {
                item.upload();
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                $scope.pojo_custom.bannerUrl = response.path;
            };
            //配置封面上传
            var uploaderconvertUrl = $scope.uploaderconvertUrl = new FileUploader({
                url: '/upload',
                alias:'fileName'
            });
            uploaderconvertUrl.onAfterAddingFile = function(item) {
                item.upload();
            };
            uploaderconvertUrl.onCompleteItem = function(fileItem, response, status, headers) {
                $scope.pojo_custom.convertUrl = response.path;
            };
            //配置封面上传
            var fileUpload = $scope.fileUpload = new FileUploader({
                url: '/upload',
                alias:'fileName'
            });
            fileUpload.onAfterAddingFile = function(item) {
                item.upload();
            };
            fileUpload.onCompleteItem = function(fileItem, response, status, headers) {
                if(!$scope.pojo_custom.attachment)
                    $scope.pojo_custom.attachment = {};
                $scope.pojo_custom.attachment.url = response.path;
                $scope.pojo_custom.attachment.name = response.originalname;
            };
            /****************父级选定****************************/
            $scope.parentShow = !!window.parent.window.parentFun;
            $scope.parentChoose = function(cus){
                var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                window.parent.window.parentFun(cus);
                parent.layer.close(index);
            }
    }])

