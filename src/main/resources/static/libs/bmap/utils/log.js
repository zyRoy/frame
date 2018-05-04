define(['underscore','jquery'], function (_) {
    function info(msg, prefix) {
        var _prefix = prefix ? prefix + " : " : "";
        if(!window.AppConfig.DEBUG) {
            return;
        }
        if (_.isObject(msg)) {
            console.log(_prefix + JSON.stringify(msg))
        }
        else {
            console.log(_prefix + msg)
        }
    }
    function debug(msg, prefix) {
        var _prefix = prefix ? prefix + " : " : "";
        if (_.isObject(msg)) {
            console.debug(_prefix + JSON.stringify(msg))
        }
        else {
            console.debug(_prefix + msg)
        }
    }

    function error(msg, prefix) {
        var _prefix = prefix ? prefix + " : " : "";
        if (_.isObject(msg)) {
            console.error(_prefix + JSON.stringify(msg))
        }
        else {
            console.error(_prefix + msg)
        }
    }

    return {
        info: info,
        debug: debug,
        error: error
    };
});