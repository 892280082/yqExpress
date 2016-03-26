/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
var _ = require("underscore");
angular.module("controller.upload_work_controller",[])
    .controller('upload_work_controller',['$scope','FileUploader','$window','$timeout'
    ,function($scope,FileUploader,$window,$timeout){

            var uploader = $scope.uploader = new FileUploader({
                url: '/upload',
                alias:'fileName'
            });

            // FILTERS
            uploader.filters.push({
                name: 'queueLimit',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    return this.queue.length < 10;
                }
            });

            uploader.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    console.log('customFilter',item,options);
                    return this.queue.length < 10;
                }
            });





            //步骤
            //1.导入angular-file-upload.min.js
            //2.module引入angularFileUpload
            //3.服务里注入 FileUploader

            //指令解释
            //nv-file-drop 是否启动拖拽
            //uploader 配置上传的容器
            //filters 配置拦截器可配置多个

            // uploader的属性的解释
            // @parm     @typo    @annotation
            // uploader.isHTML5 Boolean 浏览器是否支持html5
            // uploader.queue  Array 代表加载的文件上传数组
            // uploader.progress Number 队列的上传进度 1~100
            // uploader.uploadAll() Function 上传队列的方法
            // uploader.cancelAll() Function 取消队列上传的方法
            // uploader.clearQueue() Function 删除队列

            // Item的属性的解释
            // Item = uploader.queue[0]
            // Item   Object 代表需要上传的文件对象
            // Item.isSuccess  Boolean 文件是否上传成功
            // item.isCancel  Boolean 文件是否取消
            // item.isError  Boolean 文件是否错误
            // item.isReady  Boolean 文件是否已准备就绪
            // item.isUploading  Boolean 文件是否正在上传
            // item.progress Number 文件的上传进度 1~100
            // item.upload() Function 文件上传方法
            // item.cancel() Function 文件取消上传方法
            // item.remove() Function 将文件从队列中删除的方法

            // 回调方法
            // 当加载文件失败时
            // uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            //     console.info('onWhenAddingFileFailed', item, filter, options);
            // };
            // //加载单个文件之后
            // uploader.onAfterAddingFile = function(fileItem) {
            //     console.info('onAfterAddingFile', fileItem);
            // };
            // //加载所有文件之后
            // uploader.onAfterAddingAll = function(addedFileItems) {
            //     console.info('onAfterAddingAll', addedFileItems);
            // };
            // //上传单个文件之前
            // uploader.onBeforeUploadItem = function(item) {
            //     console.info('onBeforeUploadItem', item);
            // };
            // //单个文件上传中
            // uploader.onProgressItem = function(fileItem, progress) {
            //     console.info('onProgressItem', fileItem, progress);
            // };
            // //所有文件上传中
            // uploader.onProgressAll = function(progress) {
            //     console.info('onProgressAll', progress);
            // };
            // //当单个文件上传成功后
            // uploader.onSuccessItem = function(fileItem, response, status, headers) {
            //     console.info('onSuccessItem', fileItem, response, status, headers);
            // };
            // //当单个文件上传上传错误
            // uploader.onErrorItem = function(fileItem, response, status, headers) {
            //     console.info('onErrorItem', fileItem, response, status, headers);
            // };
            // //取消单个文件
            // uploader.onCancelItem = function(fileItem, response, status, headers) {
            //     console.info('onCancelItem', fileItem, response, status, headers);
            // };
            //单个文件上传成功后
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.log("single file upload ok!!!");
                console.info('onCompleteItem', fileItem, response, status, headers);
                // alert(response.originalname);
                // alert(response.filename);
            };
            // //所有上传成功后
            // uploader.onCompleteAll = function() {
            //     console.info('onCompleteAll');
            // };

            // console.info('uploader', uploader);



    }])

