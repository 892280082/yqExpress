var express = require('express');
var router = express.Router();

router.get('/login',function(req,res){
	res.render("back/login/login");
})

router.get('/main',function(req,res){
	res.render("back/main/index");
})



module.exports = router;