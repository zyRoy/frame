define(['underscore'], function (_) {
    var utils = {};
    utils.tabContType = function(text) {
        text = text || "";
        if (/^(https?:\/\/)+([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i.test(text)) {
            return "iframe";
        } else if ((/\.html$|\.jsp$|\.php$/i.test(text))) {
            return "url";
        } else {
            return "html";
        }
    };
    //日期格式化
    utils.dateFmt = function(date, fmt) {
        fmt = fmt || "yyyy-MM-dd";

        if (!(date instanceof Date)) {
            return date;
        }


        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    utils.toDirection = function(direction) {
        var formatResult = {};
        if(direction==0||direction==360){
            formatResult["CN"]="正北";
            formatResult["EN"]="up";
        }else if(direction==90){
            formatResult["CN"]="正东";
            formatResult["EN"]="right";
        }else if(direction==180){
            formatResult["CN"]="正南";
            formatResult["EN"]="down";
        }else if(direction==270){
            formatResult["CN"]="正西";
            formatResult["EN"]="left";
        }else if(direction>0&&direction<90){
            formatResult["CN"]="东北";
            formatResult["EN"]="up";
        }else if(direction>270&&direction<360){
            formatResult["CN"]="西北";
            formatResult["EN"]="left";
        }else if(direction>90&&direction<180){
            formatResult["CN"]="东南";
            formatResult["EN"]="right";
        }else if(direction>180&&direction<270){
            formatResult["CN"]="西南";
            formatResult["EN"]="down";
        }
        return formatResult;
    }

    return utils;
});
