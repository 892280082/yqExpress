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
            $scope.search_custom = {"$$_title":""};
             //文章类型
            $scope.articleStatus = [{name:"未通过",value:0},
                                   {name:"待审核",value:1},
                                    {name:"草稿",value:2},
                                    {name:"审核通过",value:3}];
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

            //查询方法
            $scope.search = function(){
                $scope.array_custom.$search($scope.search_custom);
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
                        title:String,//活动名称 *
                        type:[String],//创品类型 *
                        introduce:String,//简介 *
                        content:String,//内容 *
                        bannerUrl:String,//banner图 *
                        bannerno:Number,//在Banner模块展示的顺序
                        convertUrl:String,//封面图 *
                        converno:Number,//活动推荐顺序
                        creatTime:{type:Date,default:Date.now},//创建时间 *
                        status:Number,//是否开放 *
                        checkcounts:Number,//关注量 *
                        likes:[],//喜欢
                        votes:[],//投票
                        collects:[],//收藏
                        actStartTime:Date,//活动开始结束时间
                        actOverTime:Date,
                        signStarTime:Date,//报名开始结束时间
                        signOverTime:Date,
                    };
                $scope.pojo_custom = _.mapObject($scope.pojo_custom, function(val, key) {
                        if(val == Number){
                            return _.random(0,1000);
                        }else if(val == String){
                            return key + "str"+_.random(0,1000);
                        }else if(val == Array || val == []){
                            return "a b c"+" "+_.random(0,1000);
                        }else if(val == Date){
                            return new Date();
                        }
                });
                $scope.pojo_custom.type = "a b c";
                $scope.pojo_custom.status = true;
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
                var array = $scope.pojo_custom.keyword;
                if(_.isString(array))
                    $scope.pojo_custom.keyword = array.split(' ');
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
    }])

