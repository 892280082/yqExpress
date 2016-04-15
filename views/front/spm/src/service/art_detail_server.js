/**
 *@desc 提供用户数据处理接口
 *@auther yq
 *@API
 *
 * 1.doUserCommentParise                     -用户对文章一级评论的赞
 * 2.doUserCommentReport                     -用户对文章一级评论的举报
 * 3.doReplayPraise                          -用户对二级评论的赞
 * 4.doReplayReport                          -用户对二级评论的举报
 *
 *
 *
 */
angular.module('service.art_detail_server',[]).service("art_detail_server",["$http"
    ,function($http){
        //获取所有数据，利用前台分页
        this.pushComment = function(pushPojo){
            return $http.post('/front/pushArticleComment',{"pushPojo":pushPojo});
        };

        /**
         * @desc 喜欢当前文章
         * @param _id {String} -m 文章ID
         */
        this.increateParse = function(_id){
            return $http.post('/front/increateArtilce',{"_id":_id});
        };

        /**
         * @desc 取消喜欢当前文章
         * @param _id {String} -m 文章ID
         */
        this.cancelParse = function(_id){
            return $http.post('/front/cancelLikeArt',{"_id":_id});
        };

        /**
         * @desc 收藏当前文章
         * @param _id {String} -m 文章ID
         */
        this.collecCurArticle = function(_id){
            return $http.post('/front/collecCurArticle',{"_id":_id});
        }

        /**
         * @desc 取消收藏当前文章
         * @param _id {String} -m 文章ID
         */
        this.cancelcollecCurArt = function(_id){
            return $http.post('/front/cancelcollecCurArt',{"_id":_id});
        }


        //根据文章ID获取文章信息
        this.getArticleById = function(_id){
            return $http.post('/front/getArticleById',{"_id":_id});
        };

        /**
         * @desc 发送当前文章的评论
         * @param pushPojo {Object} -m 评论
         */
        this.sendReplay = function(commentId,pushPojo){
            return $http.post('/front/pushCommentReplay',{"commentId":commentId,"pushPojo":pushPojo});
        }

        /**
         * @param _id {String} -评论id
         */
        this.doUserCommentParise = function(_id,callback){
            $http.post('/user/doUserCommParise',{_id:_id})
                .success(function(data){
                    data.err &&　console.log(data.err);
                    return callback(data.err,data.result);
                }).error(function(data){
                    alert("art_detail_server---->doUserCommParise:链接出错");
                })
        }

        /**
         * @param _id {String} -评论id
         */
        this.doUserCommentReport = function(_id,callback){
            $http.post('/user/doUserReport',{_id:_id})
                .success(function(data){
                    data.err &&　console.log(data.err);
                    return callback(data.err,data.result);
                }).error(function(data){
                    alert("art_detail_server---->doUserCommentParise:链接出错");
                })
        }

        /**
         * @param _commentId {String} 一级回复ID
         * @param _replayId {String} 二级回复ID
         */
        this.doReplayPraise = function(_commentId,_replayId,callback){
            $http.post('/user/doReplayPraise',{_replayId:_replayId,_commentId:_commentId})
                .success(function(data){
                    data.err &&　console.log(data.err);
                    return callback(data.err,data.result);
                }).error(function(data){
                    alert("art_detail_server---->doReplayPraise:链接出错");
                })
        }

        /**
         * @param _commentId {String} 一级回复ID
         * @param _replayId {String} 二级回复ID
         */
        this.doReplayReport = function(_commentId,_replayId,callback){
            $http.post('/user/doReplayReport',{_replayId:_replayId,_commentId:_commentId})
                .success(function(data){
                    data.err &&　console.log(data.err);
                    return callback(data.err,data.result);
                }).error(function(data){
                    alert("art_detail_server---->doReplayReport:链接出错");
                })
        }

    }]);