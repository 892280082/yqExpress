var WebConfig = require("../models/WebConfig");
var Custom = require("../models/Custom");
var Article = require("../models/Article");
var Active = require("../models/Active");
var Work = require("../models/Work");
var Product = require("../models/Product");
var _ = require("underscore");
var mongooseUtil = require("../util/mongooseUtil");
var then = require("thenjs");

/**
 * @desc 前台service
 * @author yq
 * @date 2016/3/14
 * @api
 * */

exports.getAllWorkInfo = function(works,callback){
    var arrayFlag = true;
    if(!_.isArray(works)){
        works = [works];
        arrayFlag = !arrayFlag;
    }
    then.each(works,function(next,ele){
        Custom.findOne({"_id":ele.userId},function(err,doc){
            ele.$user = doc;
            next(err);
        })
    }).each(function(next,ele){
        Active.findOne({"_id":ele.actId},function(err,doc){
            ele.$active = doc;
            next(err);
        })
    }).then(function(){
        if(arrayFlag){
            return callback(null,works);
        }else{
            return callback(null,works[0]);
        }
    }).fail(function(next,err){
        console.log("activeService->getAllWorkInfo",err);
        callback(err);
    })

}
