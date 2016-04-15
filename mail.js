var TopClient = require('./util/ali_dayu/topClient').TopClient;
var client = new TopClient({
    'appkey': '23346796',
    'appsecret': '12ca44482f2116044363aef32f27751a',
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});
 
client.execute('alibaba.aliqin.fc.sms.num.send', {
    'extend':'123456',
    'sms_type':'normal',
    'sms_free_sign_name':'雅集文化传媒',
    'sms_param':{code:"1234",product:"造物者"},
    'rec_num':'18656139736',
    'sms_template_code':'SMS_7480737'
}, function(error, response) {
    if (!error) console.log(response);
    else console.log(error);
});