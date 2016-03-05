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
    return array.splice(array.length-10,10);
}

//合并数组 array1~array2的顺序
function concactArray(array1,array2){
    return array1.concat(array2);
}

angular.module("service.pageResult",[])
    .service("pageResult",["$http"
    ,function($http){
        this.$array = [];//显示的数据
        this._readCache = [];//读过数据的缓存
        this._nextCache = [];//未读数据的缓存
        this._server_url ="";
        this._server_pojo = {
            query:{},
            skip:0,
            limit:10
        };
        this.$pageSize = 5;//页面显示数据条数
        this.$totalSize = 0;//总共页数
        this.$curPage = 1;//当前页
        this.$pageCount = 0;//总页数
        this.$last = false;
        this.$next = false;
        this.$toLast = function(){
            this._nextCache = concactArray(this.$array,this._nextCache);
            this.$array = ArrayRemovePop(this._readCache,this.$pageSize);
            this.$curPage--;
            this._update();
        };
        this.$toNext = function(){
            this._readCache = concactArray(this._readCache,this.$array);
            this.$array = ArrayRemoveHead(this._nextCache,this.$pageSize);
            this.$curPage++;
            this._update();
        };
        this._update = function(){
            //判断上一页和下一页的状态
            this.$curPage <= 1 ? this.$last = false
                               : this.$last = true;
            this.$curPage >= this.$pageCount ? this.$next = false
                                             : this.$next = true;

            //判断 this._readCache 长度大于150 则删除数组头部的pageSize单位

            //判断 this._readCache 长度小于等于pageSize 和 curPage不等于1 则请求服务器将获得的数据放入缓存头部

            //判断 this._readCache 长度大于150 则删除数组尾部的pageSize单位

            //判断 this._nextCache 长度小于等于pageSize 则再请求服务器 将数据放入缓存尾部


        };
        this.$loadInit = function(param,callback){
            if(param.query)
                this._server_pojo.query = param.query;
            if(param.skip)
                this._server_pojo.skip = param.skip;
            if(param.limit)
                this._server_pojo.limit = param.limit;
            this._server_url = param.url;
            var _this = this;
            $http.post(this._server_url,this._server_pojo)
                .success(function(data){
                    data.err && console.log(data.err);

                    _this._nextCache = data.result.docs;
                    _this.$array = ArrayRemoveHead(_this._nextCache,_this.$pageSize);

                    _this.$pageCount = data.result.total/_this.$pageSize;
                    if(_this.$pageCount%_this.$pageSize)
                            _this.$pageCount = (~~_this.$pageCount)+1;

                    _this._update();

                    callback(data.err,_this);
                }).error(function(data){
                    callback('与后台请求错误');
                })
        };
    }]);