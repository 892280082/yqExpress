/**
 *@desc 提供用户数据处理接口
 *@auther yq
 */
angular.module('service.pro_list_server',[]).service("pro_list_server",["$http"
    ,function($http){
    		//获取所有数据，利用前台分页
            this.getAllCustomData = function(searchPojo){
                return $http.post('/back/cusGetAllData',{"searchPojo":searchPojo});
            };
            //提交数据
            this.saveCustomer = function(customer){
            	return $http.post('/back/cusSaveCustom',{"pojo":customer});
            };
            //删除数据
            this.removeCustomer = function(_id){
                return $http.post('/back/cusRemoveCustom/'+_id,{});
            };
            //更新方法
            this.updateCustomer = function(cus){
                return $http.post('/back/updateCustorm',{"updatePojo":cus});
            };

    }]);