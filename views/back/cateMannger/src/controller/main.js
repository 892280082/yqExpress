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
            /***********************分类列表页面************************/

            $scope.show = showCtrl;
            $scope.show.$regist('cuscate',['cuscate'],true);
            $scope.show.$regist('cuskey',['cuskey']);

            dataService.getConfig()
                .success(function(data){
                    if(data.err){
                        console.log(data.err);
                        alert("获取网站配置参数数据错误");
                    }else{
                        $scope.webConfig = data.result || {};
                        $scope.webConfig.articleCates = $scope.webConfig.articleCates || [];
                        $scope.webConfig.activeCates = $scope.webConfig.activeCates || [];
                        $scope.webConfig.productCates = $scope.webConfig.productCates || [];
                        $scope.webConfig.customerCates = $scope.webConfig.customerCates || [];
                    }
                }).error(function(data){
                    alert("获取错误");
                })

            //文章分类
            $scope.tempPojo = {
                articleCate:'',
                activeCate:'',
                thirdProductCate:'',
                subProductCate:'',
                customerCate:''
            }

            $scope.thirdProductCate={};

            $scope.tempEditArray = [];

            //添加一级分类
            var addLowCate = function(catePojo,cateName){
                //找出最高的cateId
                var maxCateId = _.reduce(catePojo,function(mem,ele){
                                        if(mem<ele.cateId)
                                            mem = ele.cateId;
                                        return mem;
                                },0);
                if(!maxCateId)
                    maxCateId = 0;
                maxCateId++;
                var findCateName = _.find(catePojo,function(ele){
                    return ele.cateName === cateName;
                })
                if(findCateName){
                    alert("不允许重复分类名");
                    return false;
                }
                catePojo.push({cateId:maxCateId,cateName:cateName})
            }

            //添加二级分类
            var addThirdCate = function(catePojo,cateName){
                var maxCateId = _.reduce(catePojo,function(mem,ele){
                                    if(mem<ele.cateId)
                                        mem = ele.cateId;
                                    return mem;
                                 },1000);
                if(!maxCateId)
                    maxCateId = 1000;
                maxCateId++;
                var findCateName = _.find(catePojo,function(ele){
                    return ele.cateName === cateName;
                })
                if(findCateName){
                    alert("不允许重复分类名");
                    return false;
                }
                catePojo.push({cateId:maxCateId,cateName:cateName,subCate:[]})
            }

            //删除一级分类
            var removeLowCate = function(catePojo,removePojo){
                console.log("removeLowCate",catePojo,removePojo);
                catePojo.remove(removePojo);
            }

            //添加人物分类
            $scope.addCustomerCate = function(){
                // console.log($scope.webConfig.customerCates,$scope.tempPojo.customerCate);
                addLowCate($scope.webConfig.customerCates,$scope.tempPojo.customerCate);
                $scope.tempPojo.customerCate="";
            }

            //删除人物分类
            $scope.customerCate= {};
            $scope.removeCustomerCate = function(removePojo){
                var confirmFlag = $window.confirm("确定要删除吗,该操作不可恢复");
                if(!confirmFlag)
                    return false;
                removeLowCate($scope.webConfig.customerCates,removePojo);
            }

            //添加文章分类
            $scope.addArticleCate = function(){
                addLowCate($scope.webConfig.articleCates,$scope.tempPojo.articleCate);
                $scope.tempPojo.articleCate="";
            }

            //删除文章
            $scope.removeArticleCate = function(removePojo){
                var confirmFlag = $window.confirm("确定要删除吗,该操作不可恢复");
                if(!confirmFlag)
                    return false;
                $scope.webConfig.articleCates.remove(removePojo);
            }

            //添加活动分类
            $scope.addActiveCate = function(){
                addLowCate($scope.webConfig.activeCates,$scope.tempPojo.activeCate);
                $scope.tempPojo.activeCate="";
            }

            //删除活动分类
            $scope.removeActiveCate = function(removePojo){
                var confirmFlag = $window.confirm("确定要删除吗,该操作不可恢复");
                if(!confirmFlag)
                    return false;
                $scope.webConfig.activeCates.remove(removePojo);
            }

            //添加产品二级分类
            $scope.addThirdProductCate = function(){
                addThirdCate($scope.webConfig.productCates,$scope.tempPojo.thirdProductCate);
                $scope.tempPojo.thirdProductCate = "";
            }


            //删除产品二级分类
            $scope.removeThirdProductCate = function(removePojo){
                var confirmFlag = $window.confirm("确定要删除吗,该操作不可恢复");
                if(!confirmFlag)
                    return false;
                $scope.webConfig.productCates.remove(removePojo);
            }


            //添加产品二级子分类
            $scope.addSubProductCate = function(parent){
                addThirdCate(parent.subCate,$scope.tempPojo.subProductCate);
                $scope.tempPojo.subProductCate = "";
            }


            //删除产品二级子分类
            $scope.removeSubProductCate = function(parent,child){
                var confirmFlag = $window.confirm("确定要删除吗,该操作不可恢复");
                if(!confirmFlag)
                    return false;
                removeLowCate(parent.subCate,child);
            }

            //深度更新
            $scope.deepEdit = function(array){
                $scope.tempEditArray = array;
                
            }
            /***********************添加或编辑用户页面*****************************/
            //保存或者更新方法
            $scope.saveOrUpdate = function(){
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

    }])

