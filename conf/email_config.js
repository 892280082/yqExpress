/***
 * @desc 邮箱参数配置
 * @auther yq
 * @date 2016/2/24
 */
module.exports = {
    //邮箱地址
    host:"smtp.exmail.qq.com",
    //邮箱端口
    port:465,
    //是否开启ssl
    secure:true,
    //账号
    auth:{
        user:"contact@zwzhe.com",
        pass:"Passw0rd!"
    },
    //发送前缀
    prefix:"雅集"
}
