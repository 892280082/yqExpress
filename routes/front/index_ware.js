var ware = {};

ware.all = function(req,res,next){
    console.log("nameSpace拦截器:该用户为运维人员");
    next();
}

ware.isAdmin = function(req,res,next){
    console.log("管理员拦截器:该用户为管理员，请求路径:"+req.path);
    next();
}

ware.isLogin = function(req,res,next){
    if(req){
        console.log('登陆拦截器:该用户已登陆123');
        next();
    }
}

module.exports = ware;
