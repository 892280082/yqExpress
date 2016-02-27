var debug  = require("./debug")("testDebug",1000*6);

require("./testDebug2");
debug.set("demaxiyaaa","用来测试的框架");

setTimeout(function(){
    debug.done("demaxiyaaa","还是有些bug要改的");
},8000)

debug.set("demaxiya123","用来测试的框架").setTime(3000);
setTimeout(function(){
    debug.done("demaxiya123");
},9000)


debug.set("demaxiyaff","测试个锤子");

setTimeout(function(){
    debug.done("demaxiyaff");
},2000)