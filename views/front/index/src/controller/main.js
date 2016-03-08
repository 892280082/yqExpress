'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.main",[
                                        "ng.ueditor"
    ]).controller('main',['$scope','showCtrl','dataService','FileUploader','pageResult','$window'
        ,function($scope,showCtrl,dataService,FileUploader,pageResult,$window){
            /************************数据模型****************************/
            //设置用户的权限分配
            $scope.userPowers = [{name:"普通用户",usertype:1},{name:"名人",usertype:2}]
            //注册或者添加的中间变量
            $scope.pojo_custom = {};
            //保存用户数据数组
            $scope.array_custom = [];
            //查询Pojo
            $scope.search_custom = {"$$_title":"",usertype:""};
            /*********************注册show service**************************/
            $scope.show = showCtrl;
            $scope.show.$regist('cuslist',['cuslist'],true);
            $scope.show.$regist('cusadd',['cusadd']);
            /***********************分类列表页面************************/

            //初始获取所有用户信息
            pageResult.$loadInit({
                                url:"/back/cusGetAllData",
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
                var tFlag = $window.confirm("真的要添加吗");
                if(!tFlag)
                    return false;
                dataService.removeCustomer(cus._id)
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
                //处理select绑定问题
                if(!custom){
                    $scope.pojo_custom = {
                            name:"name",//用户姓名
                            job:"job",//用户职业
                            password:"password",//密码
                            introduce:String,//用户介绍
                            email:String,//邮件
                            postAddress:String,//邮编
                            realName:String,//真实姓名
                            provice:String,//省份
                            city:String,//城市
                            detailAddress:String,//详细地址
                            phoneNumber:String,//联系方式
                            ability:String,//能力标签
                            creatTime:{type:Date,default:Date.now},//添加时间
                            bannerurl:String,//
                            topno:Number,//首页baner顺序
                            imgurl:String,//图像
                            usertype:{type:Number,default:0},//用户身份 0->普通用户 1->管理员 2->人物
                            focusno:Number,//人物聚焦
                            bannerno:Number,//模块Banner展示
                            sex:{type:Number,default:0},//性别 0男1女
                            bigimgurl:String,//大图
                            coverimgurl:String,//封面url
                            birthday:{type:Date,default:null},//生日
                            educational:String,//学历
                            qq:String,//QQ
                            weibo:String,//微
                    };
                $scope.pojo_custom = _.mapObject($scope.pojo_custom, function(val, key) {
                        return key + _.random(0,1000);
                });
                $scope.pojo_custom.sex = 1;
                $scope.pojo_custom.email = "223423@sadf";
                $scope.pojo_custom.usertype ="1";
                $scope.pojo_custom.birthday = "2014-5-8";
                $scope.pojo_custom.phoneNumber =15678954584;
                $scope.pojo_custom.topno =234234;
                $scope.pojo_custom.bannerno =234;
                $scope.pojo_custom.focusno =234;
                $scope.pojo_custom.creatTime = new Date();
            }else{
                    console.log(custom);
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
                //保存
                if(!$scope.pojo_custom._id){
                    dataService.saveCustomer($scope.pojo_custom)
                    .success(function(data){
                        if(!data.err){
                            $scope.array_custom.$add(data.result);
                            $scope.show.$set('cuslist');
                        }else{
                            alert(data.result);
                        }
                    }).error(function(data){
                         alert("保存错误");
                    })
                }else{
                    //更新
                    dataService.updateCustomer($scope.pojo_custom)
                        .success(function(data){
                            if(!data.err){
                                $scope.show.$set('cuslist');
                            }else{
                                alert("更新错误");
                            }
                        }).error(function(data){
                            alert("更新错误");
                        })
                }
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
                $scope.pojo_custom.imgurl = response.path;
            };
            //配置封面上传
            var uploaderCoverimgurl = $scope.uploaderCoverimgurl = new FileUploader({
                url: '/upload',
                alias:'fileName'
            });
            uploaderCoverimgurl.onAfterAddingFile = function(item) {
                item.upload();
            };
            uploaderCoverimgurl.onCompleteItem = function(fileItem, response, status, headers) {
                $scope.pojo_custom.coverimgurl = response.path;
            };
            //配置大图上传
            var uploader_bigimgurl = $scope.uploader_bigimgurl = new FileUploader({
                url: '/upload',
                alias:'fileName'
            });
            uploader_bigimgurl.onAfterAddingFile = function(item) {
                item.upload();
            };
            uploader_bigimgurl.onCompleteItem = function(fileItem, response, status, headers) {
                $scope.pojo_custom.bigimgurl = response.path;
            };
    }])

