'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    var $ = require("jquery");
    angular.module("controller.main",["ng.ueditor"]).
    controller('main',['$scope','showCtrl','dataService','FileUploader','userPageResult',"$window"
        ,function($scope,showCtrl,dataService,FileUploader,userPageResult,$window){
            /************************数据模型****************************/
            //注册或者添加的中间变量
            $scope.pojo_custom = {};
            //保存用户数据数组
            $scope.array_custom = [];
            //查询Pojo
            $scope.search_custom = {"$$_name":""};

            $scope.workState = [{id:1,name:'通过'},{id:0,name:"未通过"}];

            /*********************注册show service**************************/
            $scope.show = showCtrl;
            $scope.show.$regist('cuslist',['cuslist'],true);
            $scope.show.$regist('cusadd',['cusadd']);
            /***********************分类列表页面************************/

            $scope.groupArray = function(Array){
                if(!Array)
                    return [];
                return _.reduce(Array,function(mem,ele){
                    var subArray = _.last(mem);
                    subArray.length<4 ? subArray.push(ele) : mem.push([]);

                    var lasts = _.last(mem);
                    var delx =Array.length - _.flatten(mem).length;
                    var lastArray = _.last(mem);
                    if(delx<5 &&  lastArray.length === 0)
                        lastArray.push(ele);

                    return mem;
                },[[]]);
            }

            //$scope.tttt = [[{name:"aaa1"},{name:"aaa1"},{name:"aaa1"},{name:"aaa1"}],[{name:"aaa2"},{name:"aaa2"},{name:"aaa1"},{name:"aaa1"}]]

            //查询方法
            $scope.search = function(){
                $scope.array_custom.$search($scope.search_custom);
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
                if(!custom){
                    $scope.pojo_custom = {};
                    $scope.pojo_custom.creatTime = new Date();
                }else{
                    $scope.pojo_custom = custom;
                }
                this.show.$set("cusadd");
            }

            $scope.dealProStatus = function(cus){
                cus.status = !cus.status;
                $scope.saveOrUpdate(cus);
            }
            /***********************添加或编辑用户页面*****************************/
            //返回用户列表页面
            $scope.toPageList = function(){
                $scope.show.$set('cuslist');
            }

            //保存或者更新方法
            $scope.saveOrUpdate = function(cus){
                if(cus)
                    $scope.pojo_custom = cus;
                var array = $scope.pojo_custom.type;
                if(_.isString(array))
                $scope.pojo_custom.type = array.split(' ');
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

