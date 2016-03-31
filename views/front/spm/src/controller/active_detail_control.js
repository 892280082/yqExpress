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
            /***************************model*****************************/
            $scope._ = _;

            $scope.userId = GLOBAL_ACTIVE_POJO._userId;

            /***************************控制*****************************/
            //获取作品集合
            pageResult.$loadInit({
                url:"/front/getAllWorks",
                pageSize:8,
                query:{actId:GLOBAL_ACTIVE_POJO._id},
            },function(err,result){
                $scope.works = result;
            })


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

            //投票
            $scope.voteWork = function(work){
                user_service.validateLoginState(function(){

                    layer.confirm('一个作品您只能投票一次哦', {
                        btn: ['投票','取消'] //按钮
                    }, function(){
                        user_service.userVoteWork(work._id,function(err,info){
                            err && console.log(err);
                            work.votes.push($scope.userId);
                        })
                        layer.msg('投票成功', {icon: 1});
                    }, function(){

                    });
                })

            }

            //作品添加查看次数
            $scope.addWorkCheck = function(work){
                if(work.checkFlag)
                    return false;
                active_server.addWorkCheckCount(work._id,function(err,info){
                    err && console.log(err);
                    work.checkFlag = true;
                    work.checkcounts++;
                })
            }

        }])

