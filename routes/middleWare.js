var ueditor = require("ueditor"),
    multer = require ( 'multer'),
    captchapng = require('captchapng');

module.exports = function(app){
    //配置上传multer插件
    var  upload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                var fileType = file.mimetype.split("/")[0];
                if(fileType == "image"){
                    cb(null, app.get('upload_file')+'/images');
                }else if(fileType == "video"){
                    cb(null, app.get('upload_file')+'/video');
                }else{
                     cb(null, app.get('upload_file')+'/file');
                }
            },
            filename: function (req, file, cb) {
                var fileType =  file.originalname.split(".").pop();
                var fileTemp = "" +  (new Date()).valueOf()+parseInt(Math.random()*10000)+"."+fileType;
                cb(null,fileTemp);
            }
        })
    });

    //处理验证码请求
    app.get('/yanzhenma', function (req, res) {
        var ranNumber = parseInt(Math.random()*9000+1000);
        req.session.yanzhenma = ranNumber;
        var p = new captchapng(80,30,ranNumber); // width,height,numeric captcha
        p.color(92, 189, 171, 255);  // First color: background (red, green, blue, alpha)
        p.color(255, 255, 255, 255); // Second color: paint (red, green, blue, alpha)
        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64');
        res.set('Content-Type', 'image/png');
        res.send(imgbase64);
    })

    //配置上传请求
    app.post('/upload',upload.single('fileName'),function(req,res){
        req.file.path = req.file.path.replace("upload", "download");
        var pathArray = [];
        if(app.get('isWindow')){
            pathArray = req.file.path.split("\\");
        }else{
            pathArray = req.file.path.split("/");
        }
        req.file.path = '/download/'+pathArray[pathArray.length-2]+'/'+pathArray[pathArray.length-1];
        res.json(req.file);
    });

    //处理ueditor下载请求
    app.use(app.get('upload_file')+'/images/ueditor*',function(req,res){
        res.download(req.baseUrl);
    })

    //处理通用下载请求
    app.use('/download/*',function(req,res){
       var  directURl = app.get("upload_file")+req.baseUrl.replace("download", "");
        res.download(directURl);
    })

    //加载路由文件
    var configRoute = app.get('configRoute');
    for(var p in configRoute){
        p === "/" ?
        app.use(p,require("./"+configRoute[p])):
        app.use("/" + p, require("./" + configRoute[p]));
    }

    //配置ueditor编辑器后台
    app.use("/plugin/ueditor/ueditor", ueditor("", function(req, res, next) {
        // ueditor 发起上传图片请求
        if (req.query.action === 'uploadimage') {
            var foo = req.ueditor;
            var imgname = req.ueditor.filename;
            var img_url =  app.get('upload_file') + '/images/ueditor';
            //你只要输入要保存的地址 。保存操作交给ueditor来做
            res.ue_up(img_url);
        }
        //  客户端发起图片列表请求
        else if (req.query.action === 'listimage') {
            var dir_url = app.get('upload_file') + '/images/ueditor';
            // 客户端会列出 dir_url 目录下的所有图片
            res.ue_list(dir_url);
        }
        // 客户端发起其它请求
        else {
            res.setHeader('Content-Type', 'application/json');
            res.redirect('/plugin/ueditor/nodejs/config.json');
        }
    }));

    /**
     * @desc 开发模式下报将错误信息渲染到500.html页面
     *       配置404提示页面
     **/
    app.use(function(req,res){
        res.render(app.get('404page'));
    })

    app.use(function(err, req, res,next) {
        console.error(err.stack);
        if(app.get('env') === 'development') {
            res.status(500).send(err.stack);
        }else{
            res.render(app.get('500page'));
        }
    });
};