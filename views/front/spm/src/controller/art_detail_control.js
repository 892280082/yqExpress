/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.art_detail_control",[
                                        "ng.ueditor"
    ]).controller('art_detail_control',['$scope','showCtrl','FileUploader','pageResult','$window','art_detail_server','user_service'
        ,function($scope,showCtrl,FileUploader,pageResult,$window,art_detail_server,user_service) {
            /************************数据模型****************************/
            $scope._ = _;
            //文章ID
            $scope.ArticleId = GLOBAL_ARTILCE_ID;

            //需要关注的名人ID
            $scope.articleAuthor = GLOBAL_CUSTOMER;

            //文章评论次数
            $scope.ArticleCommentCount = GLOBAL_ARTILCE_COMMENTCOUNT;
            //用户
            $scope.user = GLOBAL_USER;
            //评论焦点
            $scope.writing = false;
            //评论数组
            $scope.array_comments = [];
            //回复对象pojo
            $scope.tempReplayPojo = {};
            //文章对象
            $scope.article = {};
            //用户喜欢状态
            $scope.LikeFlag = false;
            //用户收藏状态
            $scope.collecFlag = false;
            //用户关注状态
            $scope.attenFlag = false;

            /*********************注册show service**************************/
            $scope.show = showCtrl;
            $scope.show.$regist('cuslist', ['cuslist'], true);
            $scope.show.$regist('cusadd', ['cusadd']);
            /***********************分类列表页面************************/

            //获取当前文章的信息
            art_detail_server.getArticleById($scope.ArticleId)
                .success(function(data){
                    if(!data.err){
                        $scope.article = data.result;
                        $scope.LikeFlag = _.contains($scope.article.praiseCounts,$scope.user._id);
                        $scope.collecFlag = _.contains($scope.article.collections,$scope.user._id);
                    }else{
                        console.log(data.err);
                    }
                }).error(function(data){
                    console.log("获取文章信息错误");
                })


            //获取文章的评论
            pageResult.$loadInit({
                url: "/front/getArticleComments",
                pageSize: 6,
                waterfull: true,
                skip: 0,
                query: {'_articleId': $scope.ArticleId}
            }, function (err, result) {
                $scope.array_comments = result;
            })


            //喜欢该文章
            $scope.parseArticle = function(){
                user_service.validateLoginState(function(){
                    art_detail_server.increateParse($scope.ArticleId)
                        .success(function(data){
                            if(!data.err){
                                $scope.article.praiseCounts.push($scope.user._id);
                                $scope.LikeFlag = !$scope.LikeFlag;
                            }else{
                                console.log("推送错误");
                            }
                        })
                })
            }

            //取消喜欢该文章
            $scope.callParse = function(){
                art_detail_server.cancelParse($scope.ArticleId)
                    .success(function(data){
                        if(!data.err){
                            $scope.article.praiseCounts.remove($scope.user._id);
                            $scope.LikeFlag = !$scope.LikeFlag;
                        }else{
                            console.log("推送错误");
                        }
                    })
            }


            //收藏该文章
            $scope.addCollectArticle = function(){
                user_service.validateLoginState(function(){
                    art_detail_server.collecCurArticle($scope.ArticleId)
                        .success(function(data){
                            if(!data.err){
                                $scope.article.collections.push($scope.user._id);
                                $scope.collecFlag = !$scope.collecFlag;
                            }else{
                                console.log("推送错误");
                            }
                        })
                })
            }

            //取消收藏该文章
            $scope.cancelCollectArticle = function(){
                art_detail_server.cancelcollecCurArt($scope.ArticleId)
                    .success(function(data){
                        if(!data.err){
                            $scope.article.collections.remove($scope.user._id);
                            $scope.collecFlag = !$scope.collecFlag;
                        }else{
                            console.log("推送错误");
                        }
                    })
            }


            //评论对象
            $scope.commentPojo = {
                "_articleId": $scope.ArticleId,
                "_userId": $scope.user._id,
                "userName": $scope.user.name,
                "headUrl": $scope.user.headUrl,
                "content": "",
            }

            //评论该文章
            $scope.subComment = function () {
                user_service.validateLoginState(function(){
                    art_detail_server.pushComment($scope.commentPojo)
                        .success(function (data) {
                            if (!data.err) {
                                $scope.commentPojo.content = "";
                                $scope.ArticleCommentCount++;
                                $scope.array_comments.$add(data.result);
                            }
                        })
                })
            }


            //回复评论
            $scope.doCommpent = function(comment){
                comment.tips = '评论: '+comment.userName;
                comment.replayIng = true;
                comment.isComment = true;
            }

            //回复评论对象
            $scope.replayPojo = {
                    _userId:String,//回复用户外键
                    userName:String,//回复用户姓名
                    headUrl:String,//回复用户头像
                    content:"",//回复内容
                    creatTime:{type:Date,default:Date.now},//回复时间
            }

            //发送回复
            $scope.sendReply = function(comment){
                user_service.validateLoginState(function(){
                    $scope.replayPojo._userId = $scope.user._id;
                    $scope.replayPojo.userName = $scope.user.name;
                    $scope.replayPojo.headUrl = $scope.user.headUrl;
                    $scope.replayPojo.creatTime = new Date();
                    $scope.replayPojo.content = comment.replayContent;

                    if(comment.isComment) {
                        //评论
                    }else{
                        //回复
                        var targetReplay = comment.targetReplay;
                        $scope.replayPojo.toName = targetReplay.userName;
                        $scope.replayPojo.toUserId = targetReplay._userId;
                    }

                    var newPojo = _.clone($scope.replayPojo)
                    //请求服务器,发送评论
                    art_detail_server.sendReplay(comment._id, newPojo)
                        .success(function (data) {
                            if (!data.err) {
                                comment.replays.push(newPojo);
                                $scope.replayPojo = {};
                                comment.replayIng = false;
                                comment.replayContent = "";
                            } else {
                                alert("评论失败");
                            }
                        })
                })
            }

            //回复用户的回复
            $scope.toReplay = function(replay,comment){
                comment.targetReplay = replay;
                comment.isComment = false;
                comment.tips = '回复: '+replay.userName;
                comment.replayIng = true;
            }

        }])

