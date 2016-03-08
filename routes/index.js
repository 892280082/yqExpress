var express = require('express'),
    router = express.Router();

//首页
router.get("/",function(req,res){
	res.render("front/index/index");
});

module.exports = router;