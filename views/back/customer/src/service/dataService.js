/**
 *@desc 提供用户数据处理接口
 *@auther yq
 */
angular.module('service.dataService',[]).service("dataService",["$http"
    ,function($http){
            this.getAllCustomData = function(searchPojo){
                return $http.post('/back/cusGetAllData',{"search":searchPojo});
            }

    }]);