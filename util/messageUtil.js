/**
 * @desc 封装大鱼发送验证码的API接口
 * @author yq
 * @date: 2016/4/16
 *
 * @API
 * 1.sendMsg            短信验证码发送接口
 * 2.sendRegistMsg      注册短信发送验证码
 * 3.sendChangePassword 更改密码发送短信验证码
 * 4.sendChangeSelfInfo 更改个人信息发送验证码
 * 5.sendJoinActiveMsg  参加活动发送验证码
 *
 */


var TopClient = require('./ali_dayu/topClient').TopClient;
var msgConfig = require('../conf/msg_config');

var client = new TopClient({
    'appkey': msgConfig.apiKey,
    'appsecret': msgConfig.appsecret,
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});

/**
 * @desc 基础短信发送方法 | 已经打印错误信息
 * @param property {{
        random:String|Number,
        tel:String|Number,
        template:String,
        param:Object?,
        sign_name:String?,
        appName:String?,
    }} -参数要求
 * @param callback {Function} -call(err,info)
 */
function baseRandomSendInfo(property,callback){

    var random = property.random;
    if(!random)
        return callback('验证码必须设置');
    var tel = property.tel;
    if(!tel)
        return callback('目标手机必须设置');
    var template = property.template;
    if(!template)
        return callback('短信模板必须设置');

    var sign_name = property.sign_name || msgConfig.sign_name;
    var appName = property.appName || msgConfig.appName;
    var param = property.param || {};

    var sms_param = {code:''+random,product:appName};
    for(var p in param){
        sms_param[p] = param[p];
    }

    client.execute('alibaba.aliqin.fc.sms.num.send', {
        'sms_type':'normal',
        'sms_free_sign_name':sign_name,
        'sms_param':sms_param,
        'rec_num':''+tel,
        'sms_template_code':template
    }, function(error, response) {
        if (!error)
            console.log(error);
        return callback(error,response);
    });
}


/**
 * @desc 短信验证码发送接口
 * @param type {Number} 发送模板类型
 * @param tel {Number|String} -目标手机号码，多个用英文逗号隔开
 * @param random {Number} -验证码
 * @param param {Object | Function} -模板内的参数
 * @param callback {Function ?} -call(err,info)
 */
exports.sendMsg = function(templateType,tel,random,param,callback){
    if(arguments.length === 4){
        callback = param;
        param = {};
    }

    var template;
    switch (templateType){
        case 1: template = msgConfig.regist_template;break;
        case 2: template = msgConfig.change_password_template;break;
        case 3: template = msgConfig.change_seff_info_template;break;
        case 4: template = msgConfig.join_active_template;break;
    }

    baseRandomSendInfo({
        tel:tel,
        random:random,
        template:template,
        param:param,
    },function(err,info){
        callback(err,info);
    });
};

/**
 * @desc 注册短信发送该方法
 * @param tel {String|Number} -手机号
 * @param random {String|Number} -验证码
 * @param callback {Function} -回调函数
 */
exports.sendRegistMsg = function(tel,random,callback){
    exports.sendMsg(1,tel,random,callback);
};

/**
 * @desc 更改密码发送短信方法
 * @param tel {String|Number} -手机号
 * @param random {String|Number} -验证码
 * @param callback {Function} -回调函数
 */
exports.sendChangePassword = function(tel,random,callback){
    exports.sendMsg(2,tel,random,callback);
};

/**
 * @desc 更改个人信息验证码
 * @param tel {String|Number} -手机号
 * @param random {String|Number} -验证码
 * @param callback {Function} -回调函数
 */
exports.sendChangeSelfInfo = function(tel,random,callback){
    exports.sendMsg(3,tel,random,callback);
};

/**
 * @desc 参加活动发送短信方法
 * @param activeName {String} -活动名称
 * @param tel {String|Number} -手机号
 * @param random {String|Number} -验证码
 * @param callback {Function} -回调函数
 */
exports.sendJoinActiveMsg = function(activeName,tel,random,callback){
    exports.sendMsg(4,tel,random,{item:activeName},callback);
};

/**
 * @desc 测试短信人员手机号
 * 15855512649 李贵军
 * 15156822844 潘雅
 * 18656139736 叶
 * */


