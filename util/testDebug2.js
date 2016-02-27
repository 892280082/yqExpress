var debug  = require("./debug")("testDebug2");

debug.set("qqqqqq","用来测试的框架").setTime(2000);
setTimeout(function(){
    debug.done("qqqqqq");
},3000)

debug.set("wwwwwwww","用来测试的框架");
setTimeout(function(){
    debug.done("wwwwwwww","错了额");
},1000)


debug.set("eeeeee","测试个锤子");
setTimeout(function(){
    debug.done("eeeeee");
},2000)