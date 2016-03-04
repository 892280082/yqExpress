/**
 *@desc 提供用户数据处理接口
 *@auther yq
 */
angular.module('service.dataService',[]).service("dataService",["$http"
    ,function($http){
    		//获取所有数据，利用前台分页
            this.getAllCustomData = function(searchPojo){
                return $http.post('/back/actGetAllData',{"searchPojo":searchPojo});
            };
            //保存数据
            this.saveCustomer = function(customer){
            	return $http.post('/back/actSaveSingle',{"pojo":customer});
            };
            //删除数据
            this.removeCustomer = function(_id){
                return $http.post('/back/actRemoveSingle',{"_id":_id});
            };
            //更新方法
            this.updateCustomer = function(cus){
                return $http.post('/back/actUpdateSingle',{"updatePojo":cus});
            };

    }]);