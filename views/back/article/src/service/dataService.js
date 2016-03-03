/**
 *@desc 提供用户数据处理接口
 *@auther yq
 */
angular.module('service.dataService',[]).service("dataService",["$http"
    ,function($http){
    		//获取所有数据，利用前台分页
            this.getAllCustomData = function(searchPojo){
                return $http.post('/back/artGetAllData',{"searchPojo":searchPojo});
            };
            //保存数据
            this.saveCustomer = function(customer){
            	return $http.post('/back/artSaveSingle',{"pojo":customer});
            };
            //删除数据
            this.removeCustomer = function(_id,_userId){
                return $http.post('/back/artRemoveSingle',{"_id":_id,"_userId":_userId});
            };
            //更新方法
            this.updateCustomer = function(cus){
                return $http.post('/back/artUpdateSingle',{"updatePojo":cus});
            };

    }]);