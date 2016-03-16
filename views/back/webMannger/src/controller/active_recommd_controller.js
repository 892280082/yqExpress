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
        /*********************注册show service**************************/
        $scope.show = showCtrl;
        $scope.show.$regist('cusadd',['cusadd'],true);

        $scope.cateSelect = [{type:4,name:'活动',url:'/back/toActivePage'}]

        $scope.getSonpageResult = {};//子页面获取的对象

        $scope.webConfig = null;

        $scope.chooseResult = 0;

        //banner数组的长度
        $scope.bannerIndex = 0;
        //banner数组的类型
        $scope.bannerType = 0;
        //控制对象
        /***********************分类列表页面************************/
        $scope.insertBannerArray = function(){
            var insertPojo = {};
            var pojo = $scope.getSonpageResult;
            var type = $scope.bannerType;
            var index =  $scope.bannerIndex;
            var typePojo  = _.find($scope.cateSelect,function(ele){
                return ele.type == type;
            });
            if(!typePojo)
                return false;
            insertPojo.type = typePojo.name;
            insertPojo.pojo = pojo;
            if(type === 1){
                insertPojo.title = pojo.name;
                insertPojo.url = "/front/toCusDetail/"+pojo._id;
                insertPojo.picUrl = pojo.bannerurl;
            }else if(type === 2){
                insertPojo.title = pojo.title;
                insertPojo.picUrl = pojo.bannerurl;
            }else if(type === 3){
                insertPojo.title = pojo.title;
                insertPojo.url = "/front/toArtDetail/"+pojo._id;
                insertPojo.picUrl = pojo.bannerurl;
            }else if(type === 4){
                insertPojo.title = pojo.title;
                insertPojo.url = "/front/toActivetail/"+pojo._id;
                insertPojo.picUrl = pojo.bannerUrl;
            }
            if(!insertPojo.picUrl){
                alert("该对象没有设置banner图");
                return false;
            }
            $scope.webConfig.actives[index]=insertPojo;
            $scope.$apply();
        }

        $scope.toChange = function(arrayIndex,type){
            $scope.bannerIndex = arrayIndex;
            $scope.bannerType = type;
            var typePojo  = _.find($scope.cateSelect,function(ele){
                return ele.type == $scope.bannerType;
            });
            var index = layer.open({
                type: 2,
                area: ['700px', '530px'],
                fix: false, //不固定
                maxmin: true,
                content: typePojo.url
            });
            layer.full(index);
        }

        var temp = null;
        setInterval(function(){
            if(temp != __self_global){
                temp = __self_global;
                $scope.getSonpageResult = __self_global;
                $scope.insertBannerArray();
            }
        },1000);

        dataService.getConfig()
            .success(function(data){
                if(data.err){
                    console.log(data.err);
                    alert("获取网站配置参数数据错误");
                }else{
                    $scope.webConfig = data.result || {actives:[]};
                }
            }).error(function(data){
                alert("获取错误");
            })


        $scope.addBanner = function(){
            $scope.webConfig.actives.push({});
        }

        $scope.removeBanner = function(pojo){
            var tFlag = $window.confirm("真的要删除吗");
            if(!tFlag)
                return false;
            $scope.webConfig.actives.remove(pojo);
        }

        $scope.bannerMove = function(currentIndex,flag){
            var oriPojo = $scope.webConfig.actives[currentIndex];
            var targetPojo = $scope.webConfig.actives[currentIndex+flag];
            $scope.webConfig.actives[currentIndex] = targetPojo;
            $scope.webConfig.actives[currentIndex + flag] = oriPojo;
        }

        /***********************添加或编辑用户页面*****************************/

            //保存或者更新方法
        $scope.saveOrUpdate = function(){
            dataService.removeCache()
                .success(function(data){
                    if(data.err)
                        alert("清除缓存失败");
                }).error(function(){
                    alert("清除缓存失败");
                })
            //保存
            if(!$scope.webConfig._id){
                dataService.saveCustomer($scope.webConfig)
                    .success(function(data){
                        if(!data.err){
                            alert("保存成功!");
                            $scope.webConfig = data.result;
                        }else{
                            alert(data.result);
                        }
                    }).error(function(data){
                        alert("保存错误");
                    })
            }else{
                //更新
                dataService.updateCustomer($scope.webConfig)
                    .success(function(data){
                        if(!data.err){
                            alert("更新成功");
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


    }])

