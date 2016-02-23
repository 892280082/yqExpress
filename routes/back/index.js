var express = require('express');
var router = express.Router();

router.get('/hello',function(req,res){
	res.send("hello world!");
})


module.exports = router;