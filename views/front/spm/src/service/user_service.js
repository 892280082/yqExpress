/**
 *@desc 提供用户数据处理接口
 *@auther yq
 */
angular.module('service.user_service',[]).service("user_service",["$http"
    ,function($http){
    		//获取所有数据，利用前台分页
            this.getAllCustomData = function(searchPojo){
                return $http.post('/back/cusGetAllData',{"searchPojo":searchPojo});
            };
            //提交数据
            this.saveCustomer = function(customer){
            	return $http.post('/back/cusSaveCustom',{"pojo":customer});
            };
            //用户提交邮箱注册接口
            this.subEmailRegist = function(pojo){
                return $http.post('/regist/emailRegist',{"pojo":pojo});
            };
            //用户提交手机注册接口
            this.subTelRegist = function(pojo){
                return $http.post('/regist/telRegist',{"pojo":pojo});
            };
            //用户提交登录信息
            this.subLoginInfo = function(pojo){
                return $http.post('/regist/doValiLogin',{"pojo":pojo});
            }

            /**
             * @desc 用户关注接口
             * @desc _id {String} 对方ID
             */
            this.attentionUser = function(_id){
                return $http.post('/front/attentionUser',{"_id":_id});
            };

            /**
             * @desc 用户取消关注接口
             * @desc _id {String} 对方ID
             */
            this.cencalAttentionUser = function(_id){
                return $http.post('/front/cancelUserAtten',{"_id":_id});
            };

            /**
             * @desc 获取用户关注状态
             * @desc _id {String} -对方ID
             * */
            this.getAttentionState = function(_id){
                return $http.post('/front/getAttentionState',{"_id":_id});
            };

            /**
             * @desc 获取作者状态
             * @param _id {String} -作者ID
             */
            this.getCustomById = function(_id){
                return $http.post('/front/getUserById',{"_id":_id});
            }

            /**
             * @desc 获取用户的登陆状态
             *
             */
            this._user_login_state = 'init';
            this.validateLoginState = function(callback){
                var _this = this;
                if(this._user_login_state === 'init') {
                    $http.post('/front/getLoginStatu')
                        .success(function (data) {
                            _this._user_login_state = data.result ? 'login' : 'noLogin';
                            _this.validateLoginState(callback);
                        }).error(function (data) {
                            _this._user_login_state = false;
                        })
                }else if(_this._user_login_state === 'noLogin'){

                    layer.confirm('此功能需要会员权限', {
                        btn: ['登陆','取消'] //按钮
                    }, function(){
                        var index = layer.open({
                            type:2,
                            content: '/regist/login',
                            maxmin: true
                        });
                        layer.full(index);
                    }, function(){

                    });

                }else if(_this._user_login_state === 'login'){
                    return callback();
                }
            }

    }]);