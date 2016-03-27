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
            })

            //单个文件上传成功后
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.log("single file upload ok!!!");
                console.info('onCompleteItem', fileItem, response, status, headers);
                // alert(response.originalname);
                // alert(response.filename);
            };



    }])

