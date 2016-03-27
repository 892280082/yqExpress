"use strict;"
require("../service/angular_pageresult.js");
angular.module("directive_pagination",['service_pageResult'])
    .directive("yqPagination",['pageResult',function(pageResult){
        return {
            restrict:"EAC",
            scope:{
              result:"=data"
            },
            template:'<aside class="paging">'+
            '<a ng-show="result.$last"  ng-click="result.$toLast()">上一页</a>'+
            '<a>{{ result.$curPage }}/{{ result.$pageCount }}</a>'+
            '<a ng-show="result.$next"  ng-click="result.$toNext()">下一页</a>'+
            '<a>总条数:{{ result.$totalSize }}</a>'+
            '</aside>',
            link:function(scope, element, attr,ctrl){

                if(!attr.url){
                    return console.log('directive_pagination:Error must set dataUrl');
                }
                pageResult.$loadInit({
                    url:attr.url,
                    pageSize:attr.pageSize || 14,
                    query:attr.query || {},
                },function(err,result){
                    scope.result = result;
                })
            }
        };
    }]);
//<input class="Wdate" type="text" ng-model="date" value="" date-picker/>使用方法