var _ = require("underscore");
var then = require("thenjs");
var $ = require("jquery");

$(function(){
    alert("i'm jquery!111!");
})

var t = [1,2,3,4];
console.log(_.map(t,function(ele){
    return ele*21;
}));

then(function(der){
    _.delay(function(){
        console.log("ok");
        der(null,"完成11");
    },3000)
}).then(function(defer,result){
    _.delay(function(){
        console.log(result);
    },3000)
})

console.log("aaa123");