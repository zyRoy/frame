define(['jquery', 'underscore', 'backbone', 'log'], function ($, _, Backbone, Log) {
    Backbone.emulateJSON = true;
    var getResponseResult = function (responseJSON) {
        var success, code, collection, message, size;
        if (responseJSON) {
            success = responseJSON.resultCode;
            code = responseJSON.code;
            collection = responseJSON.collection;
            message = responseJSON.message;
            size = responseJSON.size;
        }
        var result = {
            success: success,
            code: code,
            collection: collection,
            message: message,
            size: size
        };
        Log.info(result, "收到服务器的响应");
        return responseJSON;
        //return result;
    };

    var baseHttpSuccessCallBack = function (data, response) {
        var responseJSON = response;
        if (responseJSON && responseJSON.collection && responseJSON.collection.length > 0 && responseJSON.collection[0]['auth_token']) {
            var _auth_token = responseJSON.collection[0]['auth_token'];
            //window.Utils.Log.info(_auth_token,"backbone_utils 28 hang 请求成功之后的_auth_token：");
            if (_auth_token) {
                sessionStorage.setItem('auth_token', _auth_token);
            }
        }
        return getResponseResult(responseJSON);
    };

    var baseHttpErrorCallBack = function (data, response) {
        if (response.statusText === 'timeout') {
            var result = {
                success: false,
                code: 'timeout',
                collection: [],
                message: '请求超时',
                size: 0
            };
            return result;
        } else {
            var responseJSON = response.responseJSON || JSON.parse(response.responseText);
            return getResponseResult(responseJSON);
        }
    };

    var httpState401 = function () {
        Log.info('you got 401 ');
        //navigator.notification.alert("你的账号在别处登录，请重新登录!", function () {
        //    require('manager/pages').openUsersSessionsNewPage();
        //}, "提示", "知道了");
    };

    var httpState404 = function () {
        Log.info('you got 404 ');
    };

    var doHttp = function (opt, callback, errorCallBack) {
        var params = {
            timeout: 120 * 1000,
            statusCode: {
                401: httpState401,
                404: httpState404
            },
            global: true,
            success: function (data, response) {
                callback(baseHttpSuccessCallBack(data, response));
            },
            error: function (data, response) {
                if (errorCallBack) {
                    errorCallBack(data, response)
                } else {
                    callback(data, response);
                }

            }
            //"Accept-Encoding": "gzip"
        };
        _.extend(params, opt);
        params.data = params.data || {};

        // access token validation
        //if (sessionStorage.getItem('auth_token')) {
           // _.extend(params.data, {auth_token: sessionStorage.getItem('auth_token')});
        //}

        opt.model.fetch(params);
        delete params.model;
        delete params.statusCode;
        delete params.dataType;
        delete params.contentType;
        Log.info(params.type + " Request: " + opt.model.url + " | Parameters:" + JSON.stringify(params));
    };

    var get = function (options, callback, errorCallBack) {
        _.extend(options, {type: 'get'});
        try {
            doHttp(options, callback, errorCallBack);
        } catch(e) {
            Log.info(e);
        }

    };
    var post = function (options, callback) {
        _.extend(options, {type: 'post'});
        doHttp(options, callback);
    };
    var put = function (options, callback) {
        _.extend(options, {type: 'put'});
        doHttp(options, callback);
    };
    var destroy = function (options, callback) {
        _.extend(options, {type: 'delete'});
        doHttp(options, callback);
    };

    return {
        get: get,
        post: post,
        put: put,
        destroy: destroy
    };

});