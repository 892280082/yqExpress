'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    var $ = require("jquery");
    angular.module("controller.main",["ng.ueditor"]).
    controller('main',['$scope','showCtrl','dataService','FileUploader','pageResult',"userPageResult","$window"
        ,function($scope,showCtrl,dataService,FileUploader,pageResult,userPageResult,$window){
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

            $scope._ = _;

            /*********************注册show service**************************/
            $scope.show = showCtrl;
            $scope.show.$regist('cuslist',['cuslist'],true);
            $scope.show.$regist('cusadd',['cusadd']);
            /***********************分类列表页面************************/

            /************************查询用户*****************************/
            //初始获取所有用户信息
            pageResult.$loadInit({
                                url:"/back/artGetAllData",
                                pageSize:15,
                                query:{},
            },function(err,result){
                $scope.array_custom = result;
            })

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

                //查询方法
            $scope.search = function(){
                $scope.array_custom.$search($scope.search_custom);
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

            /************************查询用户*****************************/

            //进入添加页面
            $scope.changeIntoEdit = function(custom){
                if(!custom){
                    $scope.pojo_custom = {
                        _userId:String,//用户Id
                        authorName:String,//作者
                        title:String,//文章标题
                        introduce:String,//简介
                        content:String,//文章内容
                        status:Number,// 作品 0-未通过 1-待审核 2-草稿 3-审核通过
                        reason:String,//审核未通过原因
                        topno:Number,//展示在首页的顺序
                        bannerFlag:Boolean,//是否开启banner展示
                        bannerurl:String,//列表的banner
                        imgUrl:String,//首页列表图
                        from:String,//来源
                        /** 集合*/
                        type:[],//文章类型
                        keyword:[],//关键字
                        checkcounts:Number,//查看次数
                        collections:[],//收藏次数 添加用户id
                        comments:[],//评论数组,储存评论_id
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
                $scope.pojo_custom.bannerFlag = false;
                $scope.pojo_custom.keyword = " keyword a b c g";
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

            //抽取图片
            $scope.contentPicIndex = { count:1 }
            $scope.getContentPicUrl = function(flag){
                var picIndex = $scope.contentPicIndex.count - 1;
                if(flag){//true 则设置封面为抽取的图片
                    if($scope.pojo_custom.imgUrl){
                        $scope.pojo_custom.contentPicUrl = $scope.pojo_custom.imgUrl;
                    }else{
                        alert("请先选取封面");
                    }
                    return false;
y                }
                var htmlStr = $scope.pojo_custom.content;
                if(htmlStr ===''){
                    alert("请先输入文章内容");
                    return false;
                }
                var imgUrl = $(htmlStr).find('img').eq(picIndex).attr("src");
                if(!imgUrl){
                    alert("未在内容中检索到图片");
                    return false;
                }else{
                    $scope.pojo_custom.contentPicUrl = imgUrl;
                }
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
                            console.log(data.result);
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

            /****************************查询用户**********************************/
            //用户pojo
            $scope.array_user = [];
            $scope.search_user = {"$$_name":"","usertype":""};
            $scope.userPowers = [{name:"普通用户",usertype:1},{name:"名人",usertype:2}];

            //打开查询用户界面
            $scope.chooseUser = function(){
                //初始获取所有用户信息
                 $(".manChooseUser").fadeIn();
            }

            $scope.manngerKey = function(){
                $(".ttty").fadeIn();
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
                $scope.pojo_custom.authorName = cus.name;
                $scope.pojo_custom._userId = cus._id;
                $(".pop_bg").fadeOut();
            }

            /**************************************************************************/
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
                $scope.pojo_custom.imgUrl = response.path;
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

