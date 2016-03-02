/**
 * @desc 前端分页插件  后续会增加和后端互通实现 前段+后端分页
 * @author yq
 * @date 2016/3/2
 */

/*
* @API
* 1. $init(数组对象,分页大小);
* 2. $next 下一页
* 3. $last 上一页
* 4. $showPage(页数) 指定一页
* 5. $search({查询条件}) //只匹配第一个且只允许匹配一个条件
* 6. $push 添加一个元素
* 7. $remove 删除一个元素
*
* @param
* 1. $toLast {Boolean} 上一页
* 2. $toNext {Boolean} 下一页
* 3. $totalPage {Number} 总个数
*
* **/
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


angular.module("service.pageResult",[])
.service("pageResult",[
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
			removeArray(this._array,pojo);
			this.$init(this._array,this.$pageSize).$showPage(this.$curPage);
		}
}]);