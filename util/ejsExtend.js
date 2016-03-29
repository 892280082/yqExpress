/**
* @desc ejs 扩展中间件
* @author yq
* @date 2016/3/9
*/
var moment = require("moment");
var _ = require("underscore");


moment.validateTime = function(startData,overData,infos) {
	var currentTime = new Date();
	startData = new Date(startData);
	overData = new Date(overData);
	if (currentTime < startData)
		return infos[0];
	if (currentTime >= startData && currentTime <= overData)
		return infos[1];
	else
		return infos[2];
}

exports.extend = function(req,res,next){

	res.locals._ = _;
	res.locals.$moment = moment;
	res.locals.$session = req.session;

	next();
}

