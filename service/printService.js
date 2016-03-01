var Product = require('../models/demo/product.js');
var Photo = require('../models/demo/photo.js');
var Article = require('../models/demo/article.js');
var Connect = require('../models/demo/connect.js');
var then = require('thenjs');

var service = {};
//测试方法
service.getAuther = function(cb){
    cb({"auther":'yq'});
}


module.exports = service;