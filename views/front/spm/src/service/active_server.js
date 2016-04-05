/**
 *@desc 提供用户数据处理接口
 *@auther yq
 */
var _ = require("underscore");
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
         * @desc 通过ID获得活动信息
         * @param id {String} 活动ID
         * */
        this.getActiveBaseByIdVa = function(id,callback){
            $http.post('/front/getActiveBaseById',{"_id":id})
                .success(function(data){
                    return callback(data.err,data.result);
                }).error(function(data){
                    alert("active_server->getActiveBaseByIdVa:连接出错");
                })
        }


        /**
         * @desc 提交作品信息
         * @param pojo {Object} 作品信息
         * */
        this.subUserWork = function(pojo){
            return $http.post('/front/subUserWork',{"pushPojo":pojo});
        }

        /**
         * @param _id {String} -活动ID
         * @param calback
         * @desc 判断session用户是否参与了当前活动
         */
        this.getWorkByActId = function(_id,calback){
            $http.post('/front/getWorkByActId',{"_id":_id})
                .success(function(data){
                    calback(data.err,data.result);
                }).error(function(){
                    alert("/front/valiSubWorkForAct->链接失败");
                })
        }

        /**
         * @desc 获取指定用户的作品集合
         * @param _id {String} -用户ID
         * @param calback
         */
        this.getWorkByUserId = function(_id,calback){
            $http.post('/front/getWorkByUserId',{"_id":_id})
                .success(function(data){
                    calback(data.err,data.result);
                }).error(function(){
                    alert("/front/getWorkByUserId->链接失败");
                })
        }

        /***
         * @desc 获取指定活动的作品集合
         * @param _id {String} -活动ID
         * @param calback
         */
        this.getWorkByUserId = function(_id,calback){
            $http.post('/front/getCurActWorks',{"_id":_id})
                .success(function(data){
                    calback(data.err,data.result);
                }).error(function(){
                    alert("/front/getCurActWorks->链接失败");
                })
        }

        /***
         * @desc 获取指定ID的WORK对象
         * @param _id {String] 作品ID
         */
        this.getWorkById = function(_id,calback){
            $http.post('/front/getWorkById',{"_id":_id})
                .success(function(data){
                    calback(data.err,data.result);
                }).error(function(){
                    alert("/front/getCurActWorks->链接失败");
                })
        }

        /**
         * @desc 增加作品查看次数
         * @param _id 作品ID
         * @param callback
         */
        this.addWorkCheckCount = function(_id,callback){
            $http.post('/front/addWorkCheckCount/'+_id,{})
                .success(function(data){
                    callback(data.err,data.result);
                }).error(function(){
                    alert("/front/addWorkCheckCount->链接失败");
                })
        }



    }]);