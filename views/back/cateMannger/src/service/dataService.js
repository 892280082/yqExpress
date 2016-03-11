/**
 *@desc 提供用户数据处理接口
 *@auther yq
 */
angular.module('service.dataService',[]).service("dataService",["$http"
    ,function($http){
    		//获取分类数据
            this.getConfig = function(){
                return $http.post('/back/getWebConfig',{});
            };
            //更新方法
            this.updateCustomer = function(cus){
                return $http.post('/back/webConfigUpSingle',{"updatePojo":cus});
            };
            //保存方法
            this.saveCustomer = function(customer){
                return $http.post('/back/savetWebConfig',{"pojo":customer});
            };

    }]);