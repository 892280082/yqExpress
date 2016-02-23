var express = require('express'),
	path = require('path'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	ejs = require('ejs'),
	config = require('./conf/config'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	mongoose = require('mongoose'),
	router = require('./routes/index'),
	app = express();

/**
 * @desc 配置开发模式和日志
 */
config.main.model ? app.set('env','development')
					: app.set('env','product');
app.use(logger('dev'));

/**
 * @desc 配置渲染模板和静态资源文件夹
 * 		 这里将views和public文件夹都进行公开,
 * 		 但是views目录下将限制视图后缀文件的访问
 */
var viewConfig = config.view;
if(viewConfig.engine == 'ejs'){
	app.engine('.html', ejs.__express);
	app.set('views', path.join(__dirname, viewConfig.relativePath));
	app.set('view engine', viewConfig.extName);
	app.set('404page',viewConfig.notFoundPage);
	app.set('500page',viewConfig.errPage);
}else{
	console.log("配置错误:目前仅支持ejs");
}
app.use(express.static('public'));
var pathReg = new RegExp("."+viewConfig.extName);
app.use(function(req,res,next){
	if(pathReg.test(req.path)){
		res.redirect('/index');
	}
	next();
})
app.use(express.static(viewConfig.relativePath));

/**
 * @desc 配置文件上传路径
 */
function getResovlePath(){
	var path = config.main.uploadDir;
	if(path.indexOf('/')!=0)
		path = path.join(__dirname,path);
	config.main.debug && console.log("文件上传地址:"+path);
}
app.set('upload_file',getResovlePath());


/**
 * @desc 配置解析request的中间件
 */
app.use(bodyParser.json());//解析json
app.use(bodyParser.urlencoded({ extended: false }));//解析resful参数
app.use(cookieParser());//解析cookie

/**
 * @desc 配置数据库和session
 */
var mongoUrl = 'mongodb://'+config.mongodb.host+":"+
		(config.mongodb.port || 27017)+"/"+config.mongodb.db;
config.main.debug && console.log("数据库连接地址: "+mongoUrl);
mongoose.connect(mongoUrl);

app.use(session({ //配置mongodb为session容器
  secret:config.mongodb.cookieSecret,
  key:config.mongodb.db,
  cookie:{ secure:false,maxAge:1000*60*60*24*30},
  store:new MongoStore({
    db:config.mongodb.db,
    host:config.mongodb.host,
    port:config.mongodb.port
  })
}));


//配置路由
app.set("configRoute",config.router);
router(app);

/**
 * @desc 启动http服务
 */
var appPort = config.main.port;
app.listen(appPort,function(err){
	if(err){
		console.log("express 启动失败:");
		console.log(err);
	}else{
		console.log("http 服务已启动，端口:"+appPort);
	}
});

//提供对外接口,给第三方插件调用
module.exports = app;
