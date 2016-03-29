/**
 *@desc 提供用户数据处理接口
 *@auther yq
 */
angular.module('service.active_server',[]).service("active_server",["$http"
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
         * @desc 通过ID获得活动信息
         * @param id {String} 活动ID
         * */
        this.getActiveBaseById = function(id){
            return $http.post('/front/getActiveBaseById',{"_id":id});
        }

        /**
         * @desc 提交作品信息
         * @param pojo {Object} 作品信息
         * */
        this.subUserWork = function(pojo){
            return $http.post('/front/subUserWork',{"pushPojo":pojo});
        }

        this.getWorkByActId = function(_id,calback){
            $http.post('/front/getWorkByActId',{"_id":_id})
                .success(function(data){
                    calback(data.err,data.result);
                }).error(function(){
                    alert("/front/valiSubWorkForAct->链接失败");
                })
        }

    }]);