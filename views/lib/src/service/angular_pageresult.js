/**
 * @desc 前端分页插件  后续会增加和后端互通实现 前段+后端分页
 * @author yq
 * @date 2016/3/2
 */
/**
 * @param array {Array} 数组
 * @param obj {Object} 删除对象
 */
function removeArray(array,obj){
    var flag = false;
    for(var i=0;i<array.length;i++){
        if(array[i] == obj){
            flag = !flag;
            break;
        }
    }
    if(flag)array.splice(i,1);
}

//删除数组头部个数
function ArrayRemoveHead(array,size){
    return array.splice(0,size);
}

//删除数组尾部个数
function ArrayRemovePop(array,size){
    return array.splice(array.length-size,size);
}

//合并数组 array1~array2的顺序
function concactArray(array1,array2){
    return array1.concat(array2);
}

//对象转数组
function argtoArray(pojo,size){
    var i = 0,tempArray = [];
    while(pojo[i]){
        if(i<size){
            i++;
            continue;
        }
        tempArray.push(pojo[i++]);
    }
    return tempArray;
}

//获取对象属性个数
function validatePojoIsNull(pojo){
    if(typeof pojo === 'object'){
        var i = 0;
        for(var p in pojo)
            i++;
        if(i<=0){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

//对象的拷贝
function deepCopy(source) {
    var result={};
    for (var key in source) {
        result[key] = typeof source[key]==='object'
            ? deepCopy(source[key])
            : source[key];
    }
    return result;
}

//处理query  $$_ 模糊查询
function dealQuery(query){
    var query = deepCopy(query);
    for(var p in query){
        if(!query[p] || validatePojoIsNull(query[p])){
            delete  query[p];
            continue;
        }
        if(p.indexOf("$$_") === 0){
            var tempParam = query[p];
            delete query[p];
            p = p.substring(3,p.length);
            query[p] = {$regex: tempParam ,$options: 'i'};
        }
    }
    return query;
}

//给指定对象添加属性
function pojoAddParam(pojo,paramPojo){
    for(var i=0;i<paramPojo.length;i++){
        var tempPojo = paramPojo[i];
        for(var p in tempPojo)
            pojo[p] = tempPojo[p];
    }
    return pojo;
}

angular.module("service_pageResult",[])
    .service("pageResult",["$http"
    ,function($http){
        this.$array = [];//显示的数据
        this._readCache = [];//读过数据的缓存
        this._nextCache = [];//未读数据的缓存
        this._server_url ="";
        this._server_pojo = {
            query:{},
            skip:0,
            limit:10,
            sort:null,
        };
        this.$pageSize = this._server_pojo.limit;//页面显示数据条数
        this.$totalSize = 0;//总数
        this.$curPage = 1;//当前页
        this.$pageCount = 0;//总页数
        this.$waterfull = false;
        this.$last = false;
        this.$next = false;
        this.$pass = 3;
        this.$toLast = function(){
            this._nextCache = concactArray(this.$array,this._nextCache);
            this.$array = ArrayRemovePop(this._readCache,this.$pageSize);
            this.$curPage--;
            this._update();
        };
        this.$toNext = function(){
            if(!this.$waterfull) { //普通模式
                this._readCache = concactArray(this._readCache, this.$array);
                this.$array = ArrayRemoveHead(this._nextCache, this.$pageSize);
            }else{//瀑布流
                this.$array = concactArray(this.$array,ArrayRemoveHead(this._nextCache,this.$pageSize))
            }
            this.$curPage++;
            this._update();
        };
        this._update = function(){
            var _this = this;
            //判断上一页和下一页的状态
            this.$curPage <= 1
                ? this.$last = false
                : this.$last = true;
            this.$curPage >= this.$pageCount
                ? this.$next = false
                : this.$next = true;
            //判断 this._readCache 长度大于150 则删除数组头部的pageSize单位
            //判断 this._readCache 长度小于等于pageSize 和 curPage不等于1 则请求服务器将获得的数据放入缓存头部
            //判断 this._readCache 长度大于150 则删除数组尾部的pageSize单位

            //判断 则再请求服务器 将数据放入缓存尾部
            if(this.$curPage <= this.$pageCount //当前页小于总页数
                && this._nextCache.length <= this.$pageSize //当缓存的页数不足一页时查询数据库
                && this._server_pojo.skip < this.$pageCount //判断skip小于总页数
                && this.$totalSize > this.$pageSize*this.$pass
            ){
                $http.post(this._server_url,{
                    query:this._server_pojo.query,
                    skip:this._server_pojo.skip,
                    limit:this._server_pojo.limit*this.$pass,})
                .success(function(data){
                    data.err && console.log(data.err);
                    _this._server_pojo.skip+=1;
                    _this._nextCache = concactArray(_this._nextCache,data.result.docs);
                }).error(function(data){
                    console.log('与后台请求错误');
                })
            }
        };
        this.$loadInit = function(param,callback){
            if(param.waterfull)
                this.$waterfull = param.waterfull;
            if(param.pass)
                this.$pass = param.pass;
            if(param.query)
                this._server_pojo.query = param.query;
            if(param.pageSize)
                this.$pageSize = this._server_pojo.limit = param.pageSize;
            if(param.sort)
                this._server_pojo.sort = param.sort;
            if(param.skip)
                this._server_pojo.skip = param.skip;
            this._server_url = param.url;
            var _this = this;
            $http.post(this._server_url,{
                query:this._server_pojo.query,
                skip:this._server_pojo.skip,
                limit:this._server_pojo.limit*this.$pass,
                sort:this._server_pojo.sort,
            }).success(function(data){
                    data.err && console.log(data.err);
                    _this.$dataInit(data);
                    callback(data.err,_this);
                }).error(function(data){
                    callback('与后台请求错误');
            })
        };
        this.$search = function(query,sort,antherSort){

            query ? query = dealQuery(query)
                  : query = {};

            sort = sort || this._server_pojo.sort;
            if(antherSort){
                antherSort = argtoArray(arguments,2);
                sort = pojoAddParam(sort,antherSort);
            }
            this._server_pojo.query = query;
            this._server_pojo.skip = 0;
            var _this = this;
            $http.post(this._server_url,{
                query:this._server_pojo.query,
                skip:this._server_pojo.skip,
                limit:this._server_pojo.limit*this.$pass,
                sort:sort,
            }).success(function(data){
                data.err && console.log(data.err);
                _this.$dataInit(data);
            }).error(function(data){
                callback('与后台请求错误');
            })
        };
        this.$dataInit = function(data){
            this.$curPage = 1;
            this._server_pojo.skip+=1;
            this._nextCache = data.result.docs;
            this.$array = ArrayRemoveHead(this._nextCache,this.$pageSize);

            this.$totalSize = data.result.total;
            this.$pageCount =  this.$totalSize/this.$pageSize;
            if(this.$pageCount%this.$pageSize)
                this.$pageCount = (~~this.$pageCount)+1;

            this._update();
        };
        this.$add = function(pojo){
            var _last = this.$array.pop();
            this.$array.splice(0,0,pojo);
            this._nextCache.splice(0,0,_last);
        };
        this.$remove = function(pojo){
            removeArray(this.$array,pojo);//显示数组中删除
            if(this._nextCache.length>1){
                this.$array.push(this._nextCache.splice(0,1)[0])
            }
            this.$totalSize--;
        };
    }]);

module.exports = {
    service_pageResult:"service_pageResult",
    pageResult:"pageResult"
}