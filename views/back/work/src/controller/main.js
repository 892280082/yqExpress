'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    var then = require("thenjs");
    var $ = require("jquery");
    angular.module("controller.main",["ng.ueditor"]).
    controller('main',['$scope','showCtrl','dataService','FileUploader','pageResult',"$window",'message_server'
        ,function($scope,showCtrl,dataService,FileUploader,pageResult,$window,message_server){
            /************************数据模型****************************/
            //注册或者添加的中间变量
            $scope.pojo_custom = {};
            //保存用户数据数组
            $scope.array_custom = [];
            //查询Pojo
            $scope.search_custom = {in:1};

            $scope.workState = [{id:1,name:'通过'},{id:0,name:"未通过"}];

            $scope.msgPojo = {};

            /*********************注册show service**************************/
            $scope.show = showCtrl;
            $scope.show.$regist('cuslist',['cuslist'],true);
            $scope.show.$regist('cusadd',['cusadd']);
            /***********************分类列表页面************************/

            pageResult.$loadInit({
                url:"/back/getWorkAllData",
                pageSize:15,
                query:$scope.search_custom
            },function(err,result){
                $scope.array_custom = result;
            })




            //查询方法
            $scope.search = function(){
                var query = _.clone($scope.search_custom);
                if($scope.search_custom.cate1$cateId)
                    query.cate1$cateId = $scope.search_custom.cate1$cateId.cateId;
                $scope.array_custom.$search(query);
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

            //进入添加页面
            $scope.changeIntoEdit = function(custom){
                setTimeout(function(){
                    $('.showOverPic').lightGallery();
                },7000)

                $scope.pojo_custom = custom;
                $scope.tempWorkCate1 = custom.cate1;
                $scope.tempWorkCate2 = custom.cate2;
                this.show.$set("cusadd");
            }


            $scope.dealProStatus = function(cus){
                cus.status = !cus.status;
                $scope.saveOrUpdate(cus);
            }

            //删除作品
            $scope.removeCustom = function(cus){
                var tFlag = $window.confirm("确定？此操作无法恢复!");
                if(!tFlag)
                    return false;

                dataService.removeCustomer(cus,function(err,result){
                    !err ? $scope.array_custom.$remove(cus) : alert("删除错误!");
                })
            }

            /***********************添加或编辑用户页面*****************************/
            //返回用户列表页面
            $scope.toPageList = function(){
                $scope.show.$set('cuslist');
            }

            //保存或者更新方法
            $scope.saveOrUpdate = function(){
                //更新
                    delete $scope.pojo_custom.$user;
                    delete $scope.pojo_custom.$active;
                    if(!!$scope.pojo_custom.fileUrls[0])
                        $scope.pojo_custom.fileUrls[0].name = $scope.pojo_custom.title;
                    dataService.updateWork($scope.pojo_custom,function(err,info){
                        if(!err){
                            $scope.show.$set('cuslist');
                        }else{
                            layer.msg('更新失败')
                            console.log(err);
                        }
                    });
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
                $scope.pojo_custom.imgBigUrl = response.path;
            };
            //配置封面上传
            var uploaderBannerurl = $scope.uploaderBannerurl = new FileUploader({
                url: '/upload',
                alias:'fileName'
            });
            uploaderBannerurl.onAfterAddingFile = function(item) {
                item.upload();
            };
            uploaderBannerurl.onCompleteItem = function(fileItem, response, status, headers) {
                $scope.pojo_custom.bannerurl = response.path;
            };
            /****************父级选定****************************/
            $scope.parentShow = !!window.parent.window.parentFun;
            $scope.parentChoose = function(cus){
                var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                window.parent.window.parentFun(cus);
                parent.layer.close(index);
            }

        }])

