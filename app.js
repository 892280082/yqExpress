/**
 * @desc app实例配置
 * @auther yq
 * @date 2016/2/22
 */
var express = require('express'),
	path = require('path'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	ejs = require('ejs'),
	config = require('./conf/app_config'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	mongoose = require('mongoose'),
	router = require('./routes/middleWare'),
	ejsExtend = require('./util/ejsExtend'),
	app = express();


//加载配置文件
app.set("app_config",config);

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
	if(pathReg.test(req.path.split("?")[0])){
		res.redirect('/404.html');
	}
	next();
})
app.use(express.static(viewConfig.relativePath));




//判断操作系统
var system = process.platform;
if(config.main.debug)
	console.log('当前系统:',system);
if(system.indexOf('win32') >-1 || system.indexOf('win64') >-1) {
	app.set('isWindow',true);
}else{
	app.set('isLinux',true);
}

	/**
 * @desc 配置文件上传路径
 */
function getResovlePath(){
	var path;
	var system = process.platform;
	if(app.get('isWindow')){ //判断是window系统
		path = config.main.winUploadDir;
	}else{ //如果是Linux或者mac
		path =  config.main.uploadDir;
		if (path.indexOf('/') != 0)
			path = path.join(__dirname, path);
	}
	config.main.debug && console.log("文件上传地址:"+path);
	return path;
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
if(config.mongodb.open) {
	var mongoUrl = 'mongodb://' + config.mongodb.host + ":" +
		(config.mongodb.port || 27017) + "/" + config.mongodb.db;
	config.main.debug && console.log("数据库连接地址: " + mongoUrl);
	var  mongooseDb = mongoose.connect(mongoUrl);
	mongooseDb.connection.on('open', function (err) {
		err && console.log(err);
		if (config.main.debug && !err) {
			console.log("mongoose:数据库连接成功");
		}
	})
	mongooseDb.connection.on('error', function (err) {
		err && console.log(err);
		if (config.main.debug && err) {
			console.log("mongoose:数据库连接错误");
		}
	})
	app.use(session({ //配置mongodb为session容器
		resave: false,
		saveUninitialized: true,
		secret:config.mongodb.cookieSecret,
		key:config.mongodb.db,
		cookie:{ secure:false,maxAge:1000*60*60*24*30},
		store:new MongoStore({
			db:config.mongodb.db,
			host:config.mongodb.host,
			port:config.mongodb.port
		})
	}));
}

//配置路由
app.use(ejsExtend.extend); //配置EJS扩展
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
