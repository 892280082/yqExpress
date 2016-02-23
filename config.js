module.exports = {
	/***
	 * @desc 配置app运行参数,debug模式下会打印配置信息
	 */
	main:{
		model:true,//true开发模式,false生产模式
		port:3000,//app端口
		debug:false,//是否开启debug模式
		uploadDir:'/upload'//配置文件上传目录,可设置相对和绝对目录
	},
	/**
	*@desc 配置mongodb数据库
	*/
	mongodb:{
		db:'yestart',//数据库名称
		host:'localhost',//数据库地址
		port:27017,//端口
		cookieSecret:'yestart'//session加密
	},
	/**
	 * @desc 配置渲染模板
	 */
	view:{
		engine:'ejs',//使用的模板引擎
		relativePath:'views',//视图模板的相对项目根目录路径
		extName:'ejs',//视图文件的后缀名,开发时路径中不能出现.ejs否则将报404错误
		notFoundPage:'404.html',//配置404页面 根据relativePath路径判断
		errPage:'500.html'//错误页面
	},
	/**
	 * @desc 配置路由，路径是基于routes
	 * key - namespace
	 * value - 路由文件在routers目录下的地址
	 * 为了防止冲突,一个namespace对应一个路由文件
	 */
	router:{
		print:"print/index",//前台路由
		back:"back/index",//后台路由
		test:"test"//测试路由
	}
}