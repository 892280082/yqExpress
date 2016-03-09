/**
* @desc ejs 扩展中间件
* @author yq
* @date 2016/3/9
*/
var moment = require("moment");
var _ = require("underscore");

var ejsExtend = function(req,res,next){
	res.locals._ = _;
	res.locals.$moment = moment;
	next();
}

module.exports = ejsExtend;