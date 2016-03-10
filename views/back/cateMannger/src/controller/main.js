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

            dataService.getConfig()
                .success(function(data){
                    if(data.err){
                        console.log(data.err);
                        alert("获取网站配置参数数据错误");
                    }else{
                        $scope.webConfig = data.result || {banners:[]};
                    }
                }).error(function(data){
                    alert("获取错误");
                })


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

