/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.active_detail_control",[
                                        "ng.ueditor"
    ]).controller('active_detail_control',['$scope','showCtrl','FileUploader','pageResult','user_service','active_server'
        ,function($scope,showCtrl,FileUploader,pageResult,user_service,active_server) {

            /***************************控制*****************************/
            //获取作品集合
            pageResult.$loadInit({
                url:"/front/getAllWorks",
                pageSize:8,
                query:{actId:GLOBAL_ACTIVE_POJO._id},
            },function(err,result){
                console.log(err,result);
                $scope.works = result;
            })

            //展示作品
            $scope.showLayerJson = function(work){
                var json = active_server.converWorkToLayerJson(work.fileUrls);
                layer.photos({
                    photos: json
                });
            }

            //提交名单
            $scope.doJoinActive = function(){
                user_service.validateLoginState(function(){

                    active_server.getWorkByActId(GLOBAL_ACTIVE_POJO._id,function(err,doc){
                       if(!doc){
                           layer.open({
                               title:'确认报名信息',
                               type: 2,
                               area: ['430px', '670px'],
                               fix: false, //不固定
                               maxmin: true,
                               content: '/front/toActiveSubForm/'+GLOBAL_ACTIVE_POJO._id
                           });
                       }else{
                           layer.confirm('此次活动您已提交作品,是否前往个人中心查看作品?',
                               {
                                   title:'提示',
                                   btn: ['是','否'] //按钮
                               }, function(){
                                   window.location.href = "/front/toUserCenter";
                               }, function(){
                                   
                               });
                       }
                    })
                })
            }

        }])

