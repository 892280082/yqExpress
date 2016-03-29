/**
 *@desc 提供用户数据处理接口
 *@auther yq
 */
angular.module('service.dataService',[]).service("dataService",["$http"
    ,function($http){
    		//获取所有数据，利用前台分页
            this.getAllCustomData = function(searchPojo){
                return $http.post('/back/proGetAllData',{"searchPojo":searchPojo});
            };
            //保存数据
            this.saveCustomer = function(customer){
            	return $http.post('/back/proSaveSingle',{"pojo":customer});
            };
            //删除数据
            this.removeCustomer = function(_id,_userId){
                return $http.post('/back/proRemoveSingle',{"_id":_id,"_userId":_userId});
            };
            //更新方法
            this.updateCustomer = function(cus){
                return $http.post('/back/proUpdateSingle',{"updatePojo":cus});
            };
            //获取用户信息接口
            this.getAllUserData = function(searchPojo){
                return $http.post('/back/cusGetAllData',{"searchPojo":searchPojo});
            };
            //获取分类数据
            this.getConfig = function(){
                return $http.post('/back/getWebConfig',{});
            };
            //更新作品信息
            this.updateWork = function(pojo,callback){
                 $http.post('/back/updateWorkById',{"pojo":pojo})
                    .success(function(data){
                        callback(data.err,data.result);
                    }).error(function(){
                        alert("/back/updateWorkById"+"连接错误");
                    })
            }
    }]);