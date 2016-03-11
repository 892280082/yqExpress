/**
*@name : service.showCtrl
*@Version 0.0.1
**/
angular.module('service.showCtrl',[]).service('showCtrl',[function(){
    this._currentName = "";
    this._registContent = {};
    this.$regist = function(name,array,current){
        this._registContent[name] = array;
        if(current) this.$set(name);
    };
    this.$set = function(name){
        var array = this._registContent[ this._currentName];
        if(array){
             for(var i=0;i<array.length;i++){
                 delete this[array[i]];
             }
        }
        array = this._registContent[name];
        if(!array) throw "you  dont regist the name";
        for(var i=0;i<array.length;i++){
            this[array[i]] = true;
        }
        this._currentName = name;
    };
    this.$remove = function(name){
        delete this._registContent[name];
    };
    this.$init = function(){
        this._registContent = {};
        this._currentName = "";
        return this;
    }
}])