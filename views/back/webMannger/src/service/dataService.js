/**
 *@desc 提供用户数据处理接口
 *@auther yq
 */
var _ = require("underscore");
angular.module('service.dataService',[]).service("dataService",["$http"
    ,function($http){
    		//获取所有数据，利用前台分页
            this.getConfig = function(){
                return $http.post('/back/getWebConfig',{});
            };
            //更新方法
            this.updateCustomer = function(cus,key){

                _.each(cus.articles,function(ele){
                    var pojo = ele.pojo;
                    pojo.content = "";
                })

                _.each(cus.actives,function(ele){
                    var pojo = ele.pojo;
                    pojo.content = "";
                    pojo.report = "";
                })

                for(var p in cus){
                    if(p !== key && p !== '_id')
                        delete cus[p];
                }

                return $http.post('/back/webConfigUpSingle',{"updatePojo":cus});
            };
            //保存方法
            this.saveCustomer = function(customer){
                return $http.post('/back/savetWebConfig',{"pojo":customer});
            };
            //清楚缓存
            this.removeCache = function(){
                return $http.post('/back/cleanIndexCache',{});
            };
    }]);