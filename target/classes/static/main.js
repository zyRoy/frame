//配置全局变量
window.AppConfig = {
};
var url = document.URL;
var temp1 = url.indexOf("/", 9);
var temp2 = url.indexOf("/", temp1 + 1);
var gisRootPath = url.substr(0, temp2 + 1);
//功能配置节点，用于前端功能定制时使用
window.FeatureConfig = {}
//获取数据库全局变量的配置，采取同步的ajax请求方式
ajax({
    url: gisRootPath+"param/getConfig",              //请求地址
    type: "POST",                       //请求方式
    data: { systemId:"DTJG" },        //请求参数
    dataType: "json",
    success: function (response, xml) {
        var data=eval('(' + response + ')');
        if(data&&data.length>0){
            var obj={}
            for(var i=0;i<data.length;i++){
                //过滤掉后台数据
                if(data[i].paramterType==1){
                    continue;
                }
                //将json字符串转换为json对象
                if(data[i].valueType=='json'){
                    data[i].value= eval('(' + data[i].value + ')');
                }
                //将boolean字符串转换为boolean类型
                if(data[i].valueType=='boolean'){
                    data[i].value=data[i].value=="false"?false:true;
                }
                obj[data[i].pinyin]=data[i].value;
            }
            window.AppConfig=obj;
        }
    },
    fail: function (status) {
        console.log("读取配置参数有误")
    }
});

function ajax(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    var params = formatParams(options.data);

    //创建 - 非IE6 - 第一步
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else { //IE6及其以下版本浏览器
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    //接收 - 第三步
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var status = xhr.status;
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.responseText, xhr.responseXML);
            } else {
                options.fail && options.fail(status);
            }
        }
    }

    //连接 和 发送 - 第二步
    if (options.type == "GET") {
        xhr.open("GET", options.url + "?" + params, false);
        xhr.send(null);
    } else if (options.type == "POST") {
        xhr.open("POST", options.url, false);
        //设置表单提交时的内容类型
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);
    }
}
//格式化参数
function formatParams(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".",""));
    return arr.join("&");
}

window.AppConfig.NRemoteApiUrl = gisRootPath;
window.AppConfig.RemoteApiUrl = gisRootPath;
var config = {
    paths: {
        jquery: 'libs/core/jquery/jquery',
        underscore: 'libs/core/underscore/underscore',
        backbone: 'libs/core/backbone/backbone',
        text: 'libs/core/backbone/text',
        datatables: 'libs/core/datatables/1.10.0/jquery.dataTables.min',
        jqueryui: 'libs/core/jquery/jqueryui/jquery-ui',
        mscrollbar: 'libs/core/jquery/mCustomerScroll/jquery.mCustomScrollbar',
        mousewheel: 'libs/core/jquery/jquery.mousewheel-3.0.6.min',
        baresize: 'libs/core/jquery/jquery.ba-resize',
        uibase: 'libs/bmap/ui/base/base',
        uiform: 'libs/bmap/ui/base/form',
        // 集成orm
        orm_client: 'libs/bmap/utils/orm',
        bmapui: 'libs/bmap/ui/control/bmapUI',
        bmapui2: 'libs/bmap/ui/control/bmapUI',
        orgchart: 'libs/bmap/ui/control/orgtree/orgchart',
        webuploader: 'libs/core/webuploader/webuploader',
        myValidator: 'libs/bmap/utils/validator',
        bmap: window.AppConfig.mapUrl,
        emergencyUnit: "/transafe-mrg/config/emergencyUnitTree",
        boot4tables: 'libs/core/datatables/1.10.11/js/dataTables.bootstrap4.min',
        bp_multiselect: 'libs/core/bootstrap/multiselect/bootstrap-multiselect',
        wdatepicker:'libs/core/My97DatePicker/WdatePicker',
        http_utils: 'libs/bmap/utils/http_utils',
        log: 'libs/bmap/utils/log',
        dateutils: 'libs/bmap/utils/date_utils',
        cache: 'libs/bmap/utils/cache',
        map_utils: 'dynamic-monitor/common/mod/map/map',
        easyui: 'libs/core/easyui/1.3.6/jquery.easyui.min',
        echarts: 'libs/core/echarts/2.1.8/echarts-all',
        layer: 'libs/core/layer/layer',
        cookie: 'resources/amd/js/arale/cookie/1.0.2/cookie-debug',
        bootstrap: 'libs/core/bootstrap/3.3.5/js/bootstrap.min',
        //验证
        bootstrapValidatorjs: 'libs/core/bootstrapValidator/bootstrapValidator2',
        bootstrapValidator: 'libs/core/bootstrapValidator/zh_CN',

        // 时间选择插件
        bootstrapDatetimepickerjs:'libs/core/bootstrapDatetimepicker/bootstrap-datetimepicker',
        bootstrapDatetimepicker:'libs/core/bootstrapDatetimepicker/bootstrap-datetimepicker.zh-CN',
        // bootstrap分页插件
        bootstrapPaginator: 'libs/core/bootstrap-paginator/bootstrap-paginator',
        //bootstrapSelect
        bootstrapSelect: 'libs/core/bootstrapSelect/select2',
        //bootstrap文件上传
        bootstrapFileInput: 'libs/core/bootstrapFileInput/js/fileinput',
        //bootstrap文件上传中文包
        bootstrapFileInputZH: 'libs/core/bootstrapFileInput/js/locales/zh',
        //bootstrap文件上传皮肤
        bootstrapFileInputTheme: 'libs/core/bootstrapFileInput/themes/explorer/theme',
        custominput: 'libs/core/custominput/custominput',
        //树结构
        zTree:'libs/core/zTree/js/jquery.ztree.core.min',
        treeSelect: 'libs/core/zTree/treeSelect',
        // 模拟数据
        mock:"libs/core/mockJs/mock",

        tabview:"libs/linkcld/wytabview/tabview",

        'widget': 'resources/amd/js/arale/widget/1.2.0/widget-debug',
        'class': 'resources/amd/js/arale/class/1.2.0/class-debug',
        'events': 'resources/amd/js/arale/events/1.2.0/events-debug',
        'base': 'resources/amd/js/arale/base/1.2.0/base-debug',
        'autocomplete': 'resources/amd/js/arale/autocomplete/1.3.0/autocomplete-debug',
        'textarea': 'resources/amd/js/arale/autocomplete/1.3.0/textarea-complete-debug',
        'calendar': 'resources/amd/js/arale/calendar/0.9.0/calendar-debug',
        'cookie': 'resources/amd/js/arale/cookie/1.0.2/cookie-debug',
        'detector': 'resources/amd/js/arale/detector/1.2.1/detector-debug',
        'dialog': 'resources/amd/js/arale/dialog/1.2.1/dialog-debug',
        'confirmbox': 'resources/amd/js/arale/dialog/1.2.1/confirmbox-debug',
        'easing': 'resources/amd/js/arale/easing/1.0.0/easing-debug',
        'iframe-shim': 'resources/amd/js/arale/iframe-shim/1.0.2/iframe-shim-debug',
        'messenger': 'resources/amd/js/arale/messenger/1.0.2/messenger-debug',
        'overlay': 'resources/amd/js/arale/overlay/1.1.2/overlay-debug',
        'mask': 'resources/amd/js/arale/overlay/1.1.2/mask-debug',
        'placeholder': 'resources/amd/js/arale/placeholder/1.1.0/placeholder-debug',
        'popup': 'resources/amd/js/arale/popup/1.1.5/popup-debug',
        'position': 'resources/amd/js/arale/position/1.0.1/position-debug',
        'select-debug': 'resources/amd/js/arale/select/0.9.6/select-debug',
        'sticky': 'resources/amd/js/arale/sticky/1.2.1/sticky-debug',
        'switchable-debug': 'resources/amd/js/arale/switchable/1.0.0/switchable-debug',
        'accordion': 'resources/amd/js/arale/switchable/1.0.0/accordion-debug',
        'carousel': 'resources/amd/js/arale/switchable/1.0.0/carousel-debug',
        'slide': 'resources/amd/js/arale/switchable/1.0.0/slide-debug',
        'tabs': 'resources/amd/js/arale/switchable/1.0.0/tabs-debug',
        'templatable': 'resources/amd/js/arale/templatable/0.9.2/templatable-debug',
        'tip': 'resources/amd/js/arale/tip/1.2.0/tip-debug',
        'atip': 'resources/amd/js/arale/tip/1.1.4/atip-debug',
        'upload': 'resources/amd/js/arale/upload/1.0.1/upload-debug',
        'validator': 'resources/amd/js/arale/validator/0.9.7/validator-debug',
        'validator-core': 'resources/amd/js/arale/validator/0.9.5/core-debug',
        'dnd': 'resources/amd/js/arale/dnd/1.0.0/dnd-debug.js',
    },
    map: {
        '*': {
            'css': 'libs/core/requirejs/require-css/css.min'
        }
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'jquery': {
            exports: '$'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'log': {
            deps: ['underscore'],
            exports: 'Log'
        },
        'http_utils': {
            deps: ['jquery', 'underscore', 'backbone', 'log'],
            exports: 'Http'
        },
        'cache': {
            deps: ['underscore'],
            exports: 'Cache'
        },
        'jqueryui': {
            deps: ['jquery','css!libs/core/jquery/jqueryui/jquery-ui.css']
        },
        'mousewheel': ['jquery'],
        'mscrollbar': {
            deps: ['mousewheel', 'css!libs/core/jquery/mCustomerScroll/jquery.mCustomScrollbar.css']
        },
        'uibase': {
            deps: ['jqueryui', 'mscrollbar']
        },
        'bmapui': {
            deps: ['uibase', 'css!libs/bmap/ui/wyui.2.0.css', 'css!libs/core/fonts/material/css/material.css']
        },
        'bmapui2': {
            deps: ['uibase']
        },
        'myValidator': {
            deps: ['tipsy']
        },
        'orgchart': {
            deps: ['jquery', 'jqueryui', 'uibase', 'css!libs/bmap/ui/control/orgtree/orgchart.css']
        },
        'bp_multiselect': {
            deps: ['jquery', 'bootstrap', 'css!libs/core/bootstrap/multiselect/bootstrap-multiselect.css']
        },
        'map_utils': {
            deps: ['jquery', 'bmap']
        },
        'bmap': {
            deps: ['jquery']
        },
        'easyui': {
            deps: ['jquery', 'css!libs/core/easyui/1.3.6/easyui.css']
        },
        'layer': {
            deps: ['jquery']
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrapValidator': {
            deps: ['jquery', 'bootstrap', 'bootstrapValidatorjs', 'css!libs/core/bootstrapValidator/bootstrapValidator.css']
        },
        'bootstrapDatetimepicker':{
            deps:['jquery','bootstrap','bootstrapDatetimepickerjs','css!libs/core/bootstrapDatetimepicker/bootstrap-datetimepicker.css']
        },
        'bootstrapSelect': {
            deps: ['jquery', 'bootstrap', 'css!libs/core/bootstrapSelect/select2.css']
        },
        'bootstrapFileInputZH': {
            deps: ['bootstrapFileInput', 'css!libs/core/bootstrapFileInput/css/fileinput.css']
        },
        'bootstrapFileInputTheme': {
            deps: ['bootstrapFileInput', 'bootstrapFileInputZH', 'css!libs/core/bootstrapFileInput/css/fileinput.css', 'css!libs/core/bootstrapFileInput/themes/explorer/theme.css']
        },
        'custominput': {
            deps: ['css!libs/core/custominput/custominput.css']
        },
        'zTree':{
            deps:['jquery','css!libs/core/zTree/css/zTreeStyle.css']
        },
        'treeSelect': {
            deps: ['jquery',
                'css!libs/core/zTree/treeSelect.css'
            ]
        },
        'treeSelectEX': {
            deps: [
                'css!libs/core/zTree/treeSelect.css'
            ]
        },
        'tabview':{
            deps:['css!libs/linkcld/wytabview/tabview.css']
        }
    }
};

require.config(config);
require.onError = function (err) {
    console.log('RequireJS loading error!: ', err.requireModules, err.message);
    console.log('RequireJS loading error!: ', err.requireModules, "\n\tsrc= ", err.originalError ? err.originalError.target.src : undefined, "\n\terr=", err);
}

define(['jquery', 'backbone', 'underscore'],
    function () {
        window.ByEvent.fireEvent("mainjsLoaded");
    }
);