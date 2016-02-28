"use strict;"
var debug = require("debug"),
    _ = require("underscore"),
    debugConfig = require("../conf/debug_config"),
    mongoose = require("mongoose");

//连接数据库
if(debugConfig.dataBase.open)
{
    var mongooseDb = mongoose.connect(debugConfig.dataBase.url);
    mongooseDb.connection.on('open', function (err) {
        err && console.log(err);
        !err ? console.log("测试数据库连接成功")
             : console.log("测试数据库连接失败");
    })
}


/**
 * @desc  输出测试结果报表
 * @param allMethod {Array} - 所有的任务数组
 * @param successTaskArray {Array} - 成功任务数组
 * @param errTaskArray {Array} - 错误数组
 * @param timeoutTaskArray {Array} -超时数组
 */
function resultInfo(allMethod,successTaskArray,errTaskArray,timeoutTaskArray){
    if(errTaskArray.length)
    console.log("##########################错误方法#########################");
    _.each(errTaskArray,function(ele){
        console.log("------------文件名------"+ele.fileName+"-----------------------");
        console.log("报错方法:"+ele.methName);
        console.log("方法描述:"+ele.description);
        console.log("错误描述:"+ele.err);
    });

    if(timeoutTaskArray.length)
        console.log("######################超时方法##########################");
    _.each(timeoutTaskArray,function(ele){
        console.log("------------文件名------"+ele.fileName+"-----------------------");
        console.log("报错方法:"+ele.methName);
        console.log("方法描述:"+ele.description);
    });

    console.log("--------------------------测试结束------------------------------");
    console.log("测试总数: "+allMethod.length);
    console.log("成功: "+successTaskArray.length);
    console.log("失败: "+errTaskArray.length);
    console.log("超时: "+timeoutTaskArray.length);
    console.log("测试通过率:"+  ~~((successTaskArray.length/allMethod.length)*100)+"%" );
}

/**
 * @desc 输出方法的运行结果
 * @param method {Object} - 方法对象
 */
function methodResultInfo(method){
    if(method.errflag === 'false'){
        console.log(method.fileName+"--------->  "+method.methName+"  ---------->"+"   执行成功");
        console.log("方法用途:"+method.description);
    }else if(method.errflag === 'err' ){
        console.log(method.fileName+"--------->  "+method.methName+"  ---------->"+"   执行失败");
        console.log("方法用途:"+method.description);
        console.log("失败原因:"+method.err);
    }
}

//任务对象MAP key是文件名 value 是文件下的任务数组
var TaskQue = {};

//任务参数
var taskParam = {
    //最大延迟时间
    _maxTimeout: debugConfig.maxTimeout || 20*1000,
    getAllTask:function(){
        return _.chain(TaskQue).values().map(function(ele){
            return _.values(ele.methods);
        }).flatten().value();
    },
    getOverFlag:function(){
         return  !_.chain(TaskQue).values().find(function(ele){
            return ele._overFlag === false;
        }).value();
    },
    finshTask:function(){
        _.chain(TaskQue).values().each(function(ele){
            ele._overFlag = true;
        });
        _.each(this.getAllTask(),function(ele){
            ele.errflag = ele.errflag || 'timeout';
        })
    }
}

var initTask = _.once(function(s){
    s = s || taskParam._maxTimeout;
    _.delay(function(){
        taskParam.finshTask();
        watchPool();
    },s);
})

/**
 * @desc 任务MAP的脏检查
 */
function watchPool(){
    if(taskParam.getOverFlag()){
       var allMethod =  taskParam.getAllTask();
        var groupMethod = _.groupBy(allMethod,function(ele){
           return ele.errflag;
        });
        var allMethCount = allMethod.length,
            successTaskArray = groupMethod['false'] || [],
            errTaskArray =  groupMethod['err'] || [];
        var timeoutTaskArray = groupMethod['timeout'] || [];
        resultInfo(allMethod,successTaskArray,errTaskArray,timeoutTaskArray);
        process.exit(1);
    }
}

/**
 * @desc 文件对象
 * @param fileName {String} - 文件名
 * @constructor
 */
function DebugPojo(fileName){
    this.fileName = fileName;
    this.methods = {};
    this._rightMeths = [];
    this._falseMeths = [];
    this._overCount = 0;
    this._overFlag = false;
    this._currentMethpojo = null;
    /**
     * @desc 设置最大超时时间
     * @param s {Number} - 毫秒
     */
    this.setTime = function(s){
        this._currentMethpojo.timeOutFlag = true;
        this._currentMethpojo.maxTimeout = s;
    };
    this.set = function(methName,desc){
        var currentTime = new Date();
        var methPojo = {
            "fileName":this.fileName,
            "methName":methName,
            "description":desc,
            "errflag":null,
            "err":null,
            "maxTimeout":null,
            "createTime":currentTime,
            "timeOutFlag":false
    }
        this._currentMethpojo = this.methods[methName] = methPojo;
        return this;
    };
    this.done = function(methodName,err){
        var _currentTime = new Date();
        var meth = this.methods[methodName];
        if(!meth){
            console.log(this.fileName+":[ERROR] 沒有设置该方法  "+methodName);
            return this;
        }
        //判断结果是否错误
        if(err){
            meth.errflag = 'err';
            meth.err = err;
            this._falseMeths.push(this);
        }else{
            //判断完成时间是否超时
            if(meth.timeOutFlag &&
                _currentTime - meth.createTime > meth.maxTimeout){
                meth.errflag = 'timeout';
            }else {
                meth.errflag = 'false';
                this._rightMeths.push(this);
            }
        }
        methodResultInfo(meth);
        _.defer(function(){
            if(++this._overCount == _.values(this.methods).length)
                this._overFlag = true;
            watchPool();
        }.bind(this))
    }
}

/**
 * @desc 对外方法
 * @param fileName {String} -m 文件名
 * @param globalTimeout {Number?｝ -m 全局最大超时时间
 * @returns {DebugPojo}
 */
module.exports = function(fileName,globalTimeout){
    initTask(globalTimeout);
    var debugPojo = new DebugPojo(fileName);
    TaskQue[fileName] = debugPojo;
    return debugPojo;
}
