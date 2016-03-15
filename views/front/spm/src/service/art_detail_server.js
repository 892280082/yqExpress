/**
 *@desc 提供用户数据处理接口
 *@auther yq
 */
angular.module('service.art_detail_server',[]).service("art_detail_server",["$http"
    ,function($http){
        //获取所有数据，利用前台分页
        this.pushComment = function(pushPojo){
            return $http.post('/front/pushArticleComment',{"pushPojo":pushPojo});
        };
        //获取所有数据，利用前台分页
        this.increateParse = function(_id){
            return $http.post('/front/increateArtilce',{"_id":_id});
        };


    }]);