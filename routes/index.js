var express = require('express');
var  router = express.Router();
var indexService = require("../service/indexService");
var appConfig = require("../conf/app_config");
var path = require('path');
var fs = require('fs');
var iconv = require('iconv');

//首页
router.get("/",function(req,res){
    indexService.getIndexData(function(err,data){
        res.render("front/page/index",{show:data});
    });
});

//下载文件
router.get("/downFileName",function(req,res){
    var fileUrl = req.query.fileurl;
    var filename = req.query.filename;
    var directURl = path.join(appConfig.main.uploadDir,fileUrl.replace("download", ""));

    var userAgent = (req.headers['user-agent']||'').toLowerCase();

    if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
        res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
    } else if(userAgent.indexOf('firefox') >= 0) {
        res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename)+'"');
    } else {
        /* safari等其他非主流浏览器只能自求多福了 */
        res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(filename).toString('binary'));
    }
    res.setHeader('Content-type', path.extname(filename));

    var filestream = fs.createReadStream(directURl);
    filestream.on('data', function(chunk) {
        res.write(chunk);
    });
    filestream.on('end', function() {
        res.end();
    });
});


module.exports = router;