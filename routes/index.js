var express = require('express');
var  router = express.Router();
var indexService = require("../service/indexService");

//首页
router.get("/",function(req,res){
    indexService.getIndexData(function(err,data){
        res.render("front/page/index",{show:data});
    });
});

module.exports = router;