define(['underscore'], function (_) {
    var setItem = function (key, value) {
        var _value;
        if (_.isObject(value)) {
            _value = JSON.stringify(value);
        } else {
            _value = value;
        }
        sessionStorage.setItem(key, _value)
    };
    var getItem = function (key) {
        var _value = sessionStorage.getItem(key);
        try {
            return JSON.parse(_value);
        }
        catch (e) {
            return _value
        }
    };

    var removeItem = function(key)
    {
        sessionStorage.removeItem(key);
    };

    return {
        setItem: setItem,
        getItem: getItem,
        removeItem: removeItem
    }
});
