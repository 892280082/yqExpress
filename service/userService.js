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
 * 1.validateUserInfo -验证用户信息是否可以注册  -call(err)
 * */


/**
 * @param infos {{ name:String?,email:String?,phoneNumber:String?,qq:String?,weibo:String? }} -提交信息
 * @param callback {Function} -回调函数
 */
exports.validateUserInfo = function(infos,callback){
    then(function(next){
        if(!infos.name){
            next();
        }else{
            Custom.findOne({"name":infos.name},function(err,doc){
                if(err || doc){
                    next('该昵称已存在');
                }else{
                    next();
                }
            })
        }
    }).then(function(next){
        if(!infos.eamil){
            next();
        }else{
            Custom.findOne({"eamil":infos.eamil},function(err,doc){
                if(err || doc){
                    next('该邮箱已存在');
                }else{
                    next();
                }
            })
        }
    }).then(function(next){
        if(!infos.phoneNumber){
            next();
        }else{
            Custom.findOne({"phoneNumber":infos.phoneNumber},function(err,doc){
                if(err || doc){
                    next('该手机号已存在');
                }else{
                    next();
                }
            })
        }
    }).then(function(next){
            if(!infos.qq){
                next();
            }else{
                Custom.findOne({"qq":infos.qq},function(err,doc){
                    if(err || doc){
                        next('该QQ已存在');
                    }else{
                        next();
                    }
                })
            }
    }).then(function(next){
        if(!infos.weibo){
            next();
            return callback();
        }else{
            Custom.findOne({"weibo":infos.weibo},function(err,doc){
                if(err || doc){
                    next('该微博已存在');
                }else{
                    return callback();
                }
            })
        }
    }).fail(function(next,err){
        console.log("userService---->validateUserInfo:",err);
        return  callback(err);
    })

}
