/**
 * @desc 测试框架配置文件
 * */
var main = {
    maxTimeout:5*1000,
    dataBase:{
        "open":true,
        "url":"mongodb://localhost/zwzhetest"
    },
    testTarget:[
        "../test/customTest",
        "../test/ariticleTest"
    ]
}
module.exports = main;

//加载测试文件
(function(){
    main.testTarget.forEach(function(ele){
        require(ele);
    })
})();


