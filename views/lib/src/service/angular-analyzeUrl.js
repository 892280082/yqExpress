/**
*@work 解析URL地址
*@方法： $parseUrl(url) url:url地址
*@作用: 深度解析url地址
*@返回类型
 { href: 'https://www.j-5.com/abc/def.htm#go',
   protocol: 'https:',
   host: 'www.j-5.com',
   port: '',
   pathname: '/abc/def.htm',
   search: '',
   hash: '#go' 
 }
*@方法 $strict(url)  url:url地址
*@作用 判断是否是url地址
*/
angular.module('service.analyzeUrl',[])
.service("analyzeUrl",[function(){
    this._strict = /http(s)?:/;
	this._r = {
        protocol: /([^\/]+:)\/\/(.*)/i,
        host: /(^[^\:\/]+)((?:\/|:|$)?.*)/,
        port: /\:?([^\/]*)(\/?.*)/,
        pathname: /([^\?#]+)(\??[^#]*)(#?.*)/
    },
    this.$parseUrl = function(url){
        if(!url) throw "analyzeUrl Error:url is undefiend!"
    	var tmp, res = {};
        res["href"] = url;
        for (p in this._r) {
            tmp = this._r[p].exec(url);
            res[p] = tmp[1];
            url = tmp[2];
            if (url === "") {
                url = "/";
            }
            if (p === "pathname") {
                res["pathname"] = tmp[1];
                res["search"] = tmp[2];
                res["hash"] = tmp[3];
            }
        }
        return res;
    },
    this.$strict = function(url){
        if(!url) return false;
        return this._strict.test(url);
    }
}]);