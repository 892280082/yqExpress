/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.art_detail_control",[
                                        "ng.ueditor"
    ]).controller('art_detail_control',['$scope','showCtrl','FileUploader','pageResult','$window','art_detail_server'
        ,function($scope,showCtrl,FileUploader,pageResult,$window,art_detail_server) {
            /************************数据模型****************************/
                //文章ID
            $scope.ArticleId = GLOBAL_ARTILCE_ID;
            //文章喜欢次数
            $scope.AticleParseCount = GLOBAL_ARTILCE_PARSECOUNT;
            //文章评论次数
            $scope.ArticleCommentCount = GLOBAL_ARTILCE_COMMENTCOUNT;
            //评论对象
            $scope.commentPojo = {
                "_articleId": $scope.ArticleId,
                "_userId": "56e653f5655e29e417a13b6e",
                "userName": 'name20723',
                "headUrl": "",
                "content": "",
            }
            //评论焦点
            $scope.writing = false;
            //评论数组
            $scope.array_comments = [];
            //回复对象pojo
            $scope.tempReplayPojo = {};
            /*********************注册show service**************************/
            $scope.show = showCtrl;
            $scope.show.$regist('cuslist', ['cuslist'], true);
            $scope.show.$regist('cusadd', ['cusadd']);
            /***********************分类列表页面************************/
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

            //评论该文章
            $scope.subComment = function () {
                art_detail_server.pushComment($scope.commentPojo)
                    .success(function (data) {
                        if (!data.err) {
                            $scope.commentPojo.content = "";
                            $scope.ArticleCommentCount++;
                            $scope.array_comments.$add(data.result);
                        }
                    })
            }

            //赞该文章
            $scope.parseArticle = function(){
                art_detail_server.increateParse($scope.ArticleId)
                    .success(function(data){
                        if(!data.err){
                            $scope.AticleParseCount++;
                        }
                    })
            }

            //回复评论
            $scope.replay = function(comment){

            }

            //查询方法
            $scope.search = function(){
                $scope.array_custom.$search($scope.search_custom);
            }


        }])

