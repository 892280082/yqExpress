/**
 *@desc 提供用户数据处理接口
 *@auther yq
 */
var _ = require("underscore");
angular.module('service.message_server',[]).service("message_server",["$http"
    ,function($http){
        /**
         * @desc 保存作品
         * @param _id 作品ID
         * @param callback
         */
        this.saveMessage = function(message,callback){
            $http.post('/front/sendMessage/',{"savePojo":message})
                .success(function(data){
                    callback(data.err,data.result);
                }).error(function(){
                    alert("/front/sendMessage->链接失败");
                })
        }

        ///**
        // * @param userId  用户ID
        // * @param cate 分类
        // * @returns
        // */
        //this.getBaseMessage = function(basePojo,cate,catePojo){
        //    return basePojo[cate] = catePojo;
        //}

    }]);