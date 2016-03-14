"use strict;"
angular.module("loadDate",[]).directive("datePicker",function(){
    return {
        restrict:"A",
        require: "ngModel",
        link:function(scope, element, attr,ctrl){
            element.bind("click", function () {
                window.WdatePicker({
                    "onpicked": function () {
                        var _this = this;
                        scope.$apply(function(){
                            ctrl.$setViewValue(_this.value);
                        });
                    }
                });
            });
        }
    };
});
//<input class="Wdate" type="text" ng-model="date" value="" date-picker/>使用方法