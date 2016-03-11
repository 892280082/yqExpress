'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    var $ = require("jquery");
    angular.module("controller.main",["ng.ueditor"]).
    controller('main',['$scope','showCtrl','dataService','FileUploader','pageResult','userPageResult',"$window"
        ,function($scope,showCtrl,dataService,FileUploader,pageResult,userPageResult,$window){
            /************************数据模型****************************/
            //注册或者添加的中间变量
            $scope.pojo_custom = {};
            //保存用户数据数组
            $scope.array_custom = [];
            //查询Pojo
            $scope.search_custom = {"$$_name":""};

            /*********************注册show service**************************/
            $scope.show = showCtrl;
            $scope.show.$regist('cuslist',['cuslist'],true);
            $scope.show.$regist('cusadd',['cusadd']);
            /***********************分类列表页面************************/

            //初始获取所有创品信息
            pageResult.$loadInit({
                                url:"/back/proGetAllData",
                                pageSize:14,
                                query:{},
            },function(err,result){
                $scope.array_custom = result;
            })

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


            /****************************查询用户**********************************/
            //用户pojo
            $scope.array_user = [];
            $scope.search_user = {"$$_name":"","usertype":""};
            $scope.userPowers = [{name:"普通用户",usertype:1},{name:"名人",usertype:2}];

            //打开查询用户界面
            $scope.chooseUser = function(){
                //初始获取所有用户信息
                 $(".pop_bg").fadeIn();
            }

            userPageResult.$loadInit({
                                url:"/back/cusGetAllData",
                                pageSize:12,
                                query:{},
            },function(err,result){
                $scope.array_user = result;
            })
            //查询方法
            $scope.searchUser = function(){
                $scope.array_user.$search($scope.search_user);
            }

            $scope.doChooseUser = function(cus){
                $scope.pojo_custom._userName = cus.name;
                $scope.pojo_custom._userId = cus._id;
                $(".pop_bg").fadeOut();
            }

            /**************************************************************************/

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
                            status:Boolean
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
                 $scope.pojo_custom.status = _.random(1,100)%2 == 0;
                $scope.pojo_custom.type = "a b c";
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

