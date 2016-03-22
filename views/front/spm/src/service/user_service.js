/**
 *@desc 提供用户数据处理接口
 *@auther yq
 */
angular.module('service.user_service',[]).service("user_service",["$http"
    ,function($http){
    		//获取所有数据，利用前台分页
            this.getAllCustomData = function(searchPojo){
                return $http.post('/back/cusGetAllData',{"searchPojo":searchPojo});
            };
            //提交数据
            this.saveCustomer = function(customer){
            	return $http.post('/back/cusSaveCustom',{"pojo":customer});
            };
            //用户提交邮箱注册接口
            this.subEmailRegist = function(pojo){
                return $http.post('/regist/emailRegist',{"pojo":pojo});
            };
            //用户提交手机注册接口
            this.subTelRegist = function(pojo){
                return $http.post('/regist/telRegist',{"pojo":pojo});
            };
            //用户提交登录信息
            this.subLoginInfo = function(pojo){
                return $http.post('/regist/doValiLogin',{"pojo":pojo});
            }

    }]);