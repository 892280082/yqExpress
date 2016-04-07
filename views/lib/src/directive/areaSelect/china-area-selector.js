angular.module('china-area-selector', ['__chinaAreaSelectorTemplates__'])
    .service('chinaAreaSelectService', ['$http', function ($http) {
        this.getChinaAreaSelectData = function(callback){
            $http({
                method:'GET',
                cache: true,
                url: '/lib/src/directive/areaSelect/areaData.json',
                dataType: 'json'
            }).success(function(data, status) {
                callback(data);
            }).error(function(data){
                console.log('/lib/src/directive/areaSelect/areaData.json->404 路径获取失败');
            })
        };
    }])
    .directive('chinaAreaSelectorWithWrapper', ['$cacheFactory','chinaAreaSelectService','$timeout'
        , function ($cacheFactory,chinaAreaSelectService,$timeout) {
        return {
            restrict: 'E',
            templateUrl: 'china-area-selector-with-wrapper.html',
            replcae: true,
            scope: {
                region: '='
            },
            link: function (scope, element) {

                var selectData = [];
                var $city = element.children().eq(1);
                var $area = element.children().eq(2);
                //var chinaAreaSelectData = function(){
                //    return $cacheFactory('chinaAreaSelectData');
                //}();
                //var getChinaAreaSelectData = chinaAreaSelectData.get('data');
                scope.provinces = [];
                //if(getChinaAreaSelectData){
                //    scope.provinces = getChinaAreaSelectData;
                //}else{
                    chinaAreaSelectService.getChinaAreaSelectData(function(data){
                        scope.provinces = data.model[0].provinces;
                        selectData = data.model[0];

                        scope.$watch('region', showRegion, true);
                    })
                //}

                var getCities = function (province) {
                    return (selectData[province] || {}).citys || [];
                };

                var getAreas = function (province, city) {
                    var cityObj = (selectData[province] || {})[city];
                    return (cityObj || {}).areas || [];
                };

                var indexOf = function (arr, ele) {
                    for (var i in arr)
                        if (arr[i] === ele)
                            return i;
                    return -1;
                };

                var getAdjustiveRegion = function (paramRegion) {
                    var region = angular.copy(paramRegion || {});


                    if (indexOf(scope.provinces, region.province) === -1) {
                        region.province = region.city = region.area = '';
                        return region;
                    }
                    var cities = getCities(region.province);
                    if (indexOf(cities, region.city) === -1) {
                        region.city = region.area = '';
                        return region;
                    }
                    var areas = getAreas(region.province, region.city);
                    if (indexOf(areas, region.area) === -1) {
                        region.area = '';
                        return region;
                    }
                    return region;
                };

                var showRegion = function (region) {
                    scope.region = getAdjustiveRegion(region);
                    // console.log("region=" + JSON.stringify(region) + " scope.region=" + JSON.stringify(scope.region));

                    scope.citys = getCities(scope.region.province);
                    scope.areas = getAreas(scope.region.province, scope.region.city);


                    setTimeout(function(){
                        var cityIndex = indexOf(scope.citys, scope.region.city);
                        $city.val(cityIndex > -1 ? cityIndex : '');

                        var areaIndex = indexOf(scope.areas, scope.region.area);
                        $area.val(areaIndex > -1 ? areaIndex : '');
                    },0)

                };


            }
        };
    }]);


