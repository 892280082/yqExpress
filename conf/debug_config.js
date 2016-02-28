/**
 * @desc 测试框架配置文件
 * */

var main = {
    maxTimeout:30*1000,
    dataBase:{
        "open":true,
        "url":"mongodb://localhost/zwzhetest"
    },
    testTarget:[
        "../test/customTest",
    ]
}
module.exports = main;

//加载测试文件
(function(){
    main.testTarget.forEach(function(ele){
        require(ele);
    })
})();


