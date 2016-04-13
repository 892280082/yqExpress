'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.user_center_collect",["ng.ueditor"]).
    controller('user_center_collect',['$scope','user_service','FileUploader','pageResult',"$window","pageArray","art_detail_server"
        ,function($scope,user_service,FileUploader,pageResult,$window,pageArray,art_detail_server){
            /*****************************数据Model************************************/

            $scope.collectArray = [];

            user_service.getUserAllCollect(function(err,docs){
                $scope.collectArray = $scope.collectArray.concat(docs.collecArticles).concat(docs.collectActives);


                $scope.collectArray = _.chain($scope.collectArray).each(function(ele){
                                            ele.isActive = !!ele.demand;
                                        }).sortBy(function(ele){
                                            return new Date(ele.creatTime);
                                        }).value().reverse();

                $scope.page = pageArray.$init($scope.collectArray,5);
            })

            //取消收藏
            $scope.cancelCollect = function(collect){


                if(collect.isActive){
                    user_service.cancelUserCollectActive(collect._id,function(err,info){
                        if(!err){
                            $scope.page.$remove(collect);
                            layer.msg('取消收藏成功');
                            $("#doCollect").text((+$("#doCollect").text())-1);

                        }
                    })
                }else{
                    art_detail_server.cancelcollecCurArt(collect._id)
                        .success(function(data){
                            if(!data.err){
                                $scope.page.$remove(collect);
                                layer.msg('取消收藏成功');
                                $("#doCollect").text((+$("#doCollect").text())-1);
                            }
                         })
                    }
            }


        }]).service("pageArray",[
            function(){
                this._array = [];//缓存接受的数组
                this.$array = [];
                this.$pageSize = 0;
                this.$pageCount = 0;
                this.$curPage = 1;
                this.$totalPage = 0;
                this.$toLast = false;
                this.$toNext = false;
                this._juageCurpage = function(curPage){
                    if(curPage < 1 || curPage > this.$pageCount){
                        throw "pageResult mehod _juageCurpage error: 页数不对";
                        return false;
                    }
                    if(curPage == 1){
                        this.$toLast = false;
                        if(curPage < this.$pageCount)
                            this.$toNext = true;
                    }
                    if(curPage == this.$pageCount){
                        this.$toNext = false;
                        if(curPage > 1)
                            this.$toLast = true;
                    }
                    return true;
                };
                this._getArrayByCur = function(curPage){
                    var tempArray = [];
                    var point = (curPage-1)*this.$pageSize;
                    for(var i=0;i<this.$pageSize;i++){
                        if(point<this._array.length){
                            tempArray.push(this._array[point++])
                        }else{
                            break;
                        }
                    }
                    return tempArray;
                };
                this.$init = function(array,pageSize){
                    if(array.length == 0 || !array){
                        this.$array = [];
                        this.$pageSize = 0;
                        this.$totalPage = 0;
                        this.$pageCount = 0;
                        this.$curPage = 0;
                        return this;
                    }
                    this._array = array;
                    this.$pageSize = pageSize;
                    this.$totalPage = array.length;
                    this.$pageCount = array.length/pageSize;
                    if(array.length%pageSize){
                        this.$pageCount += 1;
                    }
                    this.$pageCount = parseInt(this.$pageCount);
                    this.$showPage(1);
                    return this;
                };
                this.$next = function(){
                    var tempCurPage = this.$curPage+1;
                    if(this._juageCurpage(tempCurPage)){
                        this.$array = this._getArrayByCur(tempCurPage);
                        this.$curPage = tempCurPage;
                    }
                };
                this.$last = function(curPage){
                    var tempCurPage = this.$curPage-1;
                    if(this._juageCurpage(tempCurPage)){
                        this.$array = this._getArrayByCur(tempCurPage);
                        this.$curPage = tempCurPage;
                    }
                };
                this.$showPage = function(curPage){
                    if(this._juageCurpage(curPage)){
                        this.$array = this._getArrayByCur(curPage);
                        this.$curPage = curPage;
                    }
                };
                this.$search = function(searchPojo){
                    var key,value;
                    for( var p in searchPojo ){
                        key = p;
                        value = searchPojo[p];
                    }
                    var tempArray = this._array;
                    var _curPage = 1;
                    for(var i=0,ii=tempArray.length;i<ii;i++){
                        if(i%this.$pageSize==0 && i != 0){
                            _curPage++;
                        }
                        if(tempArray[i][key] == value){
                            this.$showPage(_curPage);
                        }
                    }
                };
                this.$push = function(pojo){
                    this._array.splice(0, 0,pojo);
                    this.$init(this._array,this.$pageSize);
                };
                this.$remove = function(pojo){
                    this._array.remove(pojo);
                    this.$init(this._array,this.$pageSize).$showPage(this.$curPage);
                }
            }]);

