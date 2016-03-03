'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.main",["ng.ueditor"]).
    controller('main',['$scope','showCtrl','dataService','FileUploader','pageResult'
        ,function($scope,showCtrl,dataService,FileUploader,pageResult){
            /************************数据模型****************************/
            //设置用户的权限分配
            $scope.userPowers = [{name:"普通用户",value:"1"},{name:"名人",value:"2"}]
            //注册或者添加的中间变量
            $scope.pojo_custom = {};
            //保存用户数据数组
            $scope.array_custom = [];
            //查询Pojo
            $scope.search_custom = {name:""};
            /*********************注册show service**************************/
            $scope.show = showCtrl;
            $scope.show.$regist('cuslist',['cuslist'],true);
            $scope.show.$regist('cusadd',['cusadd']);
            /***********************分类列表页面************************/

            //初始获取所有用户信息
            function getAllCus(search){
             dataService.getAllCustomData(search)
                .success(function(data){
                        if(data.result){
                            $scope.array_custom = pageResult.$init(data.result,30);
                        }
                }).error(function(data){
                        console.log(data);
                })
            }
            getAllCus();

            //查询方法
            $scope.search = function(){
                getAllCus($scope.search_custom);
            }

            //删除方法
            $scope.removeCustom = function(cus){
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

            //进入添加页面
            $scope.changeIntoEdit = function(custom){
                if(!custom){
                    $scope.pojo_custom = {
                             title:String,//产品名称
                            price:Number,//价格
                            imgUrl:String,//封面url
                            imgBigUrl:String,//大图
                            introduce:String,//简介
                            guige:String,//规格
                            detailimgarr:String,//详情页banner URL 集合，逗号隔开
                            bannerurl:String,//
                            converturl:String,//
                            taobaoUrl:String,//淘宝商品url
                            creatTime:{type:Date,default:Date.now},//创建时间
                            type:[],//创品类型
                            kucun:Number,//库存
                            isDelete:Number,//是否下架
                            topno:Number,//在首页的顺序
                            bannerno:Number,//模块Banner展示
                            sortno:Number,//排序
                            attentionno:Number,//关注量
                    };
                $scope.pojo_custom = _.mapObject($scope.pojo_custom, function(val, key) {
                        if(val == Number){
                            return _.random(0,1000);
                        }else if(val == String){
                            return key + "str"+_.random(0,1000);
                        }else if(val == Array || val == []){
                            return "a b c"+" "+_.random(0,1000);
                        }
                });
                $scope.pojo_custom._userId = "56d6574c841d3fa413325f2e";
                $scope.pojo_custom.type = "a b c";
                $scope.pojo_custom.creatTime = new Date();
            }else{
                    $scope.pojo_custom = custom;
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
                var array = $scope.pojo_custom.type;
                if(_.isString(array))
                $scope.pojo_custom.type = array.split(' ');
                //保存
                if(!$scope.pojo_custom._id){
                    dataService.saveCustomer($scope.pojo_custom)
                    .success(function(data){
                        if(!data.err){
                            $scope.array_custom.$push(data.result);
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
    }])

