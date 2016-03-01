"use strict;"
angular.module("loadDate",[]).directive("datePicker",function(){
    return {
        restrict:"A",
        link:function(scope, element, attr){
            element.bind("click", function () {
                window.WdatePicker({
                    "onpicked": function () {
                        scope.$apply(scope.date = this.value);
                    }
                });
            });
        }
    };
});
//<input class="Wdate" type="text" ng-model="date" value="" date-picker/>使用方法