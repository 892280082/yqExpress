var express = require('express');
var router = express.Router();

router.get('/do',function(req,res){
    res.send("i know!!");
});

module.exports = router;