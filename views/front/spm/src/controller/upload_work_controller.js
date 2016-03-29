/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
var _ = require("underscore");
angular.module("controller.upload_work_controller",[])
    .controller('upload_work_controller',['$scope','FileUploader','$window','$timeout','active_server'
        ,function($scope,FileUploader,$window,$timeout,active_server){
            /******************数据模型************************/
            $scope.active = {}; //活动模型

            $scope.work = { //作品模型
                fileUrls:[]
            }

            /******************加载数据*********************/
            active_server.getActiveBaseById(ACTIVE_POJO._id)
                .success(function(data){
                    if(!data.err){
                        $scope.active = data.result;
                        $scope.work.cate1 =$scope.active.workCate[0];
                        $scope.work.cate2 = $scope.work.cate1.subCate[0];
                        $scope.work.actId = $scope.active._id;
                        $scope.work.activeName = $scope.active.title;
                        $scope.work.userId = ACTIVE_POJO._userId;
                        $scope.work.userName = ACTIVE_POJO._userName;

                    }else{
                        layer.alert('活动数据获取失败', {
                            icon: 2,
                            skin: 'layer-ext-moon'
                        })
                    }
                }).error(function(data){
                    layer.alert('活动数据获取失败', {
                        icon: 2,
                        skin: 'layer-ext-moon'
                    })
                })


            /*******************控制器**************************/
            $scope.bannerMove = function(currentIndex,flag){ //移动图片
                var oriPojo = $scope.work.fileUrls[currentIndex];
                var targetPojo = $scope.work.fileUrls[currentIndex+flag];
                $scope.work.fileUrls[currentIndex] = targetPojo;
                $scope.work.fileUrls[currentIndex + flag] = oriPojo;
            }

            $scope.fileControType = function(){ //上传控件限制显示类型
                if(!$scope.active.demand)
                    return "";
                return _.chain($scope.active.demand.fileType.split(" ")).reduce(function(mem,ele){
                    return mem+" ."+ele+",";
                },"").value();
            }

            $scope.subWork = function(){ //提交作品信息
                if(!$scope.work.fileUrls || $scope.work.fileUrls.length<=0){
                    layer.alert('请上传作品',{
                        icon: 0,
                        skin: 'layer-ext-moon'
                    });
                    return false;
                }

                if(!$scope.work.introduce || $scope.work.introduce.length<=0){
                    layer.alert('请填写设计说明',{
                        icon: 0,
                        skin: 'layer-ext-moon'
                    });
                    return false;
                }

                active_server.subUserWork($scope.work)
                    .success(function(data){
                        if(!data.err){
                            layer.confirm('作品上传成功,是否前往个人中心查看作品?',
                            {
                                title:'提示',
                                btn: ['是','否'] //按钮
                            }, function(){
                                window.location.href = "/front/toUserCenter";
                            }, function(){
                                window.location.href = "/front/toActivetail/"+ACTIVE_POJO._id;
                            });

                            setTimeout(function(){
                                window.location.href = "/front/toActivetail/"+ACTIVE_POJO._id;
                            },5*1000)
                        }else{
                            layer.alert('作品提交成功,请联系管理员',{
                                icon: 2,
                                skin: 'layer-ext-moon'
                            });
                        }
                    }).error(function(data){
                        alert("提交作品链接错误");
                    })
            }

            $scope.$watch(function(){//观察描述
                return $scope.work.introduce;
            },function(){
                if($scope.work.introduce.length > 200){
                    $scope.work.introduce = $scope.work.introduce.substring(0,200)
                }
            })

            /*******************上传配置**************************/
            var uploader = $scope.uploader = new FileUploader({
                url: '/upload',
                alias:'fileName'
            });

            // FILTERS
            uploader.filters.push({
                name: 'queueLimit',
                fn: function(item /*{File|FileLikeObject}*/, options) {

                    var ext = _.last(item.name.split("."));
                    if(!_.contains($scope.active.demand.fileType.split(" "),ext)){
                        layer.alert('图片格式必须为'+$scope.active.demand.fileType,{
                            icon: 0,
                            skin: 'layer-ext-moon'
                        });
                        return false;
                    }

                    if(item.size > $scope.active.demand.fileSize*1000*1000){
                        layer.alert('图片大小不得超过'+$scope.active.demand.fileSize*1000 +'KB',{
                            icon: 0,
                            skin: 'layer-ext-moon'
                        });
                        return false;
                    }


                    if(this.queue.length+1 + $scope.work.fileUrls.length > $scope.active.demand.fileMax){
                        layer.alert('最多上传'+$scope.active.demand.fileMax+'张作品',{
                            icon: 0,
                            skin: 'layer-ext-moon'
                        });
                        return false;
                    }
                    return true;
                }
            })

            //单个文件上传成功后
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                $scope.work.fileUrls.push({
                    url:response.path,
                    name:fileItem._file.name,
                })
                fileItem.remove();
            };


            //加载上传文件
            uploader.onAfterAddingAll = function(addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
                _.each(addedFileItems,function(ele){
                    ele.upload();
                })
            };

        }])

