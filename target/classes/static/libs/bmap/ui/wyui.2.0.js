//全局参数定义
var gConfig = {
    overlayColor : "#000000",
    overlayOpacity :.5 ,
    overlayIndex : 200,//overlay z-index
    baseIndex : 50 ,//panel z-index
    dialogIndex : 210,//dialog container z-index
    alertIndex : 250 //alert container z-index
};

//图标定义
var icoDef = {
    close : "zmdi zmdi-close",
    full : "zmdi zmdi-fullscreen",
    fullOff : "zmdi zmdi-fullscreen-exit",
    max : "zmdi zmdi-window-maximize",
    maxOff:"zmdi zmdi-window-restore",
    refresh : "zmdi zmdi-refresh",
    previous : "zmdi zmdi-chevron-left",
    next : "zmdi zmdi-chevron-right",
    chevronLeft : "zmdi zmdi-chevron-left",
    chevronRight : "zmdi zmdi-chevron-right",
    chevronUp : "zmdi zmdi-chevron-up",
    chevronDown : "zmdi zmdi-chevron-down",
    resizeHandle : "zmdi zmdi-filter-list",
    search:"fa fa-search"
};

//组件内元素class定义
var classDef = {
    source : "wy-ui-source",
    closable:"closable",
    footer:"wy-footer",
    state : {
        active : "active",
        hover : "hover",
        selected : "selected",
        disable:"disable"
    }
};


var wyHelper = {
    //遮罩层计数器
    overlayCounter:0 ,
    isDebug:true,

    time:function(name){
        if(wyHelper.isDebug)console.time(name);
    },
    end:function(name){
        if(wyHelper.isDebug)console.timeEnd(name);
    },
    info:function(object){
        if(wyHelper.isDebug)console.info(object);
    },
    toFullScreen:function(target){

    },
    //设置全局配置
    setGlobal:function(config){
        for(var k in config){
            gConfig[k] = config[k];
        }
    },
    /***
     *  获取一个顶层body
     *  @method getTopBody
     *  @reutrn 返回一个顶层body
     * */
    getBody:function(){
        var body = $(document.body) ;
        if($(window.top.document.body)){
            body =$(window.top.document.body)
        }
        return body ;
    },
    hasTop:function(){
        return !(window.top === window);
    },
    /***
     *  统一创建UI内部对话框或alert遮罩层
     *  @method getOverlay
     *  @reutrn 返回一个顶层唯一的遮罩层
     * */
    getOverlay:function(notOnTop){
        //查找最上层的body
        var body = $(document.body) ;
        if(!notOnTop){
            if($(window.top.document.body)){
                body =$(window.top.document.body)
            }
        }
        var overlay = body.find("#wy-ui-overlay") ;
        if(!overlay || overlay.length < 1){
            overlay = $("<div id='wy-ui-overlay' class='user-select-none'></div>").appendTo(body);
            overlay.css({
                "background-color" : gConfig.overlayColor,
                "opacity" : gConfig.overlayOpacity,
                "z-index":gConfig.overlayIndex
            });
        }
        return overlay;
    },
    /***
     *  显示对话框或alert遮罩层，如果需要显示遮罩层，建议用此方法，以此保证多次调用的正确性
     *  @method showOverlay
     * */
    showOverlay:function(){
        wyHelper.getOverlay().fadeIn();
        wyHelper.overlayCounter++;
    },
    /***
     *  @method hideOverlay
     *  隐藏对话框或alert遮罩层，如果需要显示遮罩层，建议用此方法，以此保证多次调用的正确性
     * */
    hideOverlay:function(){
        wyHelper.overlayCounter--;
        if(wyHelper.overlayCounter==0){
            wyHelper.getOverlay().fadeOut();
        }
    },
    /***
     * 为目标对象添加滚动条，可在实际中重写此方法，以改变wyui所有scroll方式
     *  @method scroll
     *  @param target 要添加滚动条的jquery对象
     *  @param opt 参数，默认使用mCustomerScroll组件，参数可参考该组件参数
     *  @return 添加滚动条后的content
     * */
    scroll:function(target,opt){
        if(!opt){
            opt = {
                theme:"dark",
                scrollInertia:0,
                keyboard:{
                    enable:true,
                    scrollType:"stepless",
                    scrollAmount:"auto"
                }
            }
        }
        $(target).mCustomScrollbar(opt);
        return $(target).find(".mCSB_container");
    },
    escapeRegExp: function(text) {
        return text.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    },
    escapeHTML: function(value) {
        return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br/>');
    },
    /***
     * 格式化日期
     * @method dateFormat
     * @param d:date
     * @param f:fomatter
     *
     * */
    dateFormat:function(d, f){
        var t = {
            "y+" : d.getFullYear(),
            "M+" : d.getMonth()+1,
            "d+" : d.getDate(),
            "H+" : d.getHours(),
            "m+" : d.getMinutes(),
            "s+" : d.getSeconds(),
            "S+" : d.getMilliseconds()
        };
        var _t;
        for(var k in t){
            while(new RegExp("(" + k + ")").test(f)){
                _t = (RegExp.$1.length == 1) ? t[k] :
                    ("0000000000".substring(0, RegExp.$1.length) + t[k]).substr(("" + t[k]).length);
                f = f.replace(RegExp.$1, _t + "");
            }
        }
        return f;
    },
    /**
     * 对象数据替换到文本
     * */
    fillString:function(obj,html){
        for(var k in obj){
            html = html.replace(new RegExp("\{\{"+ k +"\}\}","ig") , obj[k]);
        }
        return html;
    },
    /***
     * 合并多个对象
     * @method dateFormat
     * @param 要合并的对象.例：unionObject(o1,o2,o3.....)
     * */
    unionObjects:function(){
        var objs = arguments ;
        //至少需要两个对象
        if(objs.length==0){
            return {};
        }
        if(objs.length==1){
            return objs[0];
        }
        var finalObj=null;

        for(var i=0;i<objs.length;i++){
            if(finalObj==null){
                finalObj=objs[i];
                continue;
            }
            finalObj = wyHelper.unionObject(finalObj,objs[i]);
        }
        return finalObj;
    },
    //合并两个对象
    unionObject:function(obj1,obj2){
        var tempObj={} ;
        if(obj1){
            for(var k in obj1){
                tempObj[k] = obj1[k] ;
            }
        }

        for(var k in obj2){
            if(!tempObj[k]){
                tempObj[k] = obj2[k] ;
            }
        }

        return tempObj;
    },
    /**
     * 线性数据结构转树状结构
     * list:要转换的列表
     * opt:设置包含属性（idname）id主键属性名，(pidname)pid的属性名用于对象之间建立父子关联
     * */
    list2Tree:function(list,opt){
        if(!opt) opt={};
        return wyHelper.getTree(list,
                                opt["pid"],
                                opt["idname"],
                                opt["pidname"]);
    },
    getTree:function(data,pid,idname,pidname) {
        var tree = [],
            temp,
            temp2,
            mark,
            pids=[],
            tempChildren;
        if(!idname) idname = "ID";
        if(!pidname) pidname = "PID";

        if(!pid){
            //先标记出根节点
            for(var i=0;i<data.length;i++){
                temp = data[i];
                mark = false;//是否有父节点
                for(var j=0;j<data.length;j++){
                    temp2 = data[j];
                    if(temp[idname]!=temp2[idname] && temp[pidname]==temp2[idname]){
                        mark = true ;
                        break;
                    }
                }
                if(mark==false){//多个根节点
                    var hasId = false ;
                    for(var o=0;o<pids.length;o++){
                        if(pids[o]==temp[pidname]){
                            hasId = true;
                            break;
                        }
                    }
                    if(!hasId){
                        pids.push(temp[pidname]);
                    }
                }
            }
        }

        if(pid){
            for(var i=0;i<data.length;i++){
                temp = data[i];
                if(temp[pidname]==pid){
                    tempChildren = wyHelper.getTree(data,temp[idname],idname,pidname);
                    if(tempChildren && tempChildren.length>0){
                        temp.children = tempChildren ;
                    }
                    tree.push(temp);
                }
            }
        }

        //针对多个父节点
        if(pids!=null && pids.length>0){
            for(var j=0;j<pids.length;j++){
                for(var i=0;i<data.length;i++){
                    temp = data[i];
                    if(temp[pidname]==pids[j]){
                        tempChildren = wyHelper.getTree(data,temp[idname],idname,pidname);
                        if(tempChildren && tempChildren.length>0){
                            temp.children = tempChildren ;
                        }
                        tree.push(temp);
                    }
                }
            }
        }
        return tree;
    },
    animationEndEvent :function(){
        var element = document.createElement('div');
        var animations = {
            'animation' :'animationend',
            'OAnimation' :'oAnimationEnd',
            'MozAnimation' :'mozAnimationEnd',
            'WebkitAnimation' :'webkitAnimationEnd'
         };

        var animation  ;
        for(animation in animations){
            if( element.style[animation] !== undefined ){
                return animations[animation];
            }
        }
        return false;
    },
    //target:目标pop
    //e:MouseDownEvent
    isMouseIn:function(target,e){
        var offset = target.offset();
        if(e.pageX < offset.left || e.pageX > offset.left + target.width()
            || e.pageY < offset.top || e.pageY > offset.top + target.height()) {
            return false;
        }
        return true;
    }
};

/*

(function(factory){
    if (typeof define === "function" && define.cmd ) {
        define(function(require){
            var $ = require("$");
            require("jqueryui");
            require("./base");
            factory($);
        });
    } else {
        $(function(){
            factory(jQuery);
        });
    }
}(function($){
*/

    $.widget("wy.base",{
        //从元素属性定义上获取组件options
        //isAttrPrior:如果定义为true,元素属性上的定义将覆盖options中定义
        _getElementOpt:function(optName,isAttrPrior){
            if(!isAttrPrior){
                if(this.options[optName]==null && this.element.attr(optName)){
                    this.options[optName] = this.element.attr(optName) ;
                }
            }else if(this.element.attr(optName)){
                this.options[optName] = this.element.attr(optName) ;
            }
        }
    });

    Array.prototype.remove = function(item,comparator){
        var fn = comparator ? comparator :  function(d1,d2){
            return d1 == d2 ;
        }
        for(var i=0;i<this.length;i++){
            if(fn(item,this[i])){
                this.splice(i,1);
            }
        }
    }

    Array.prototype.isContains = function(item){
        return wyHelper.inArray(this,item);
    }

    String.prototype.fill = function(obj){
        return wyHelper.fillString(obj,this);
    }


/*

}));
*/








/**
 * Created by hexb on 15/3/16.
 */

/**
 * wyUI基础方法
 * @class wyHelper
 * @static
*/
var wyForm={
    getFormJsonData:function($targetForm){
        var inputdata={};
        var fieldName = "name";
        //input-text
        $targetForm.find("input[type=text],input[type=password],input[type=hidden],input[type=number]").each(function(){
            //如果有别名则取别名的值，用于填充多层数据结构时
            fieldName = $(this).attr("alias") ? "alias" : "name";
            if($(this).attr(fieldName)){
                if($(this).val() && $(this).val()!=null && $.trim($(this).val())!=""){
                    inputdata[$(this).attr(fieldName)] = $(this).val();
                }
            }
        });
        //input

        //input-select
        $targetForm.find("select").each(function(){
            fieldName = $(this).attr("alias") ? "alias" : "name";
            if($(this).attr(fieldName)){
                if($(this).val() && $(this).val()!=null && $.trim($(this).val())!="") {
                    inputdata[$(this).attr(fieldName)] = $(this).find("option:selected").val();
                }
            }
        });

        $targetForm.find("textarea").each(function(){
            fieldName = $(this).attr("alias") ? "alias" : "name";
            if($(this).attr(fieldName)){
                if($(this).val() && $(this).val()!=null && $.trim($(this).val())!="") {
                    inputdata[$(this).attr(fieldName)] = $(this).val();
                }
            }
        });

        //checkbox
        $targetForm.find("input[type=checkbox]").each(function(){
            fieldName = $(this).attr("alias") ? "alias" : "name";
            if($(this).attr(fieldName)){
                var name = $(this).attr(fieldName) ;
                if(inputdata[name]!=undefined){
                    return true ;//continue
                }
                //数组
                var values = [];
                $targetForm.find("input["+fieldName+"="+name+"]:checked").each(function(){
                    values.push($(this).val());
                });
                inputdata[$(this).attr(fieldName)] = values;
            }
        });
        return inputdata;
    },
    //用数据填充查看详细页面
    fillView:function($target,data){
        if(!$target){
           throw new error("view target illegal!");
        }
        if(!data){
            throw new error("view data illegal!");
        }

        $target.find("span[name],div[name]").each(function(){
            var field = $(this).attr("name") ;
            if(eval("data."+field)){
                $(this).html(eval("data."+field));
            }else{
                $(this).html("暂无");
            }
        });
    },
    //填充表单控件域
    fillForm:function($targetForm,data){
        if(!$targetForm){
            $.error("传入的$targetForm非法！");
            return ;
        }
        if(!data){
            $.error("参数data非法，未传入data参数");
            return ;
        }

        //text
        $targetForm.find("input[type=text],textarea,input[type=hidden]").each(function(){
            var field = $(this).attr("name") ;
            //简单属性
            if(eval("data."+field)){
                $(this).val(eval("data."+field));
            }else{
                $(this).val("");
            }
        });

        $targetForm.find("input[type=number]").each(function(){
            var field = $(this).attr("name") ;
            //简单属性
            if(eval("data."+field)){
                $(this).val(eval("data."+field));
            }else{
                $(this).val("0");
            }
        });


        $targetForm.find("span[name],div[name]").each(function(){
            var field = $(this).attr("name") ;
            //简单属性
            if(eval("data."+field)){
                $(this).html(eval("data."+field));
            }else{
                $(this).html("");
            }
        });

        //select
        $targetForm.find("select").each(function(){
            var field = $(this).attr("name") ;
            //简单属性
            if(eval("data."+field+"_VALUE")){
                $(this).wyDropdown("selectValue",eval("data."+field+"_VALUE"));
            } else if(eval("data."+field)){
                $(this).wyDropdown("selectText",eval("data."+field));
            }else{
                $(this).wyDropdown('selectValue', "");
            }
        });


        //checkbox
        $targetForm.find("input[type=checkbox]").each(function(){
            var field = $(this).attr("name") ;
            var checkdata=eval("data."+field);
            if(checkdata){
                if(wyHelper.inArray(checkdata,$(this).val()) || checkdata==$(this).val()){
                    $(this).prop("checked",true);
                }else{
                    $(this).prop("checked",false);
                }
            }else{
                $(this).prop("checked",false);
            }
        });
    },//end fillForm
    resetForm:function($targetForm){
        //首先清除检验信息
        $targetForm.find("input[type=text],input[type=password]").each(function(){
            $(this).val("");
        });
        $targetForm.find("select").each(function(){
            $(this).wyDropdown('selectValue', "");
        });
        $targetForm.find("textarea").each(function(){
            $(this).val("");
        });
    }
}


$(function(){

    $.prototype.getData = function(){
        return wyForm.getFormJsonData(this);
    }

    $.prototype.fillView = function(data){
        wyForm.fillView(this,data);
    }

    $.prototype.fill = function(data){
        wyForm.fillForm(this,data);
    }

    $.prototype.rest = function(){
        wyForm.resetForm(this);
    }
});



/**
 * Created by hexb on 15/5/8.
 */

$(function () {

    $.widget("wy.wyAlert", {
        options: {
            draggable: true,
            resizeable: false,
            alertClass: "default",
            okButton: "<button class='ok-button'><i class='fa fa-check' style='margin-right: 8px;'></i>确定</button>",
            cancelButton: "<button class='cancel-button '><i class='fa fa-close' style='margin-right: 8px;'></i>关闭</button>",
            vOffset: -100,
            hOffset: 0,
            icons:{
                alert:"<i class='icon-bubble-alert'></i>",
                confirm:"<i class='icon-bubble-question'></i>",
                prompt:"icon-bubble-pencil"
            },
            effectIn:"wy-zoom-gl-out",//zoom-in
            effectOut:"zoom-out"
        },
        alert: null,
        buttonbar: null,
        _create: function () {
            this.element.addClass("wy-alert-container");
        },
        show: function (title, message, callbak, type, parent, icon) {
            message = message ? message : "";
            type = type.toLowerCase();
            //窗口
            var popHtml = "<div class='wy-alert " + this.options.alertClass + "' style='display:none;'>";

            //关闭按钮
            popHtml += "<i class='close fa fa-close'></i>";

            //图标
            popHtml += "<div class='wy-alert-icon'>"+ (icon ? icon : this.options.icons[type]) +"</div>"

            //标题
            popHtml += "<div class='wy-alert-title'>" + title + "</div>";

            //内容
            popHtml += "<div class='wy-alert-message'>" + wyHelper.escapeHTML(message);
            popHtml += "</div>";

            //按钮
            popHtml += "<div class='wy-alert-buttonbar'>";
            popHtml += "</div>"

            popHtml += "</div>";

            wyHelper.getOverlay().show();
            this.alert = $(popHtml);
            this.buttonbar = this.alert.children(".wy-alert-buttonbar");

            var body = $(document.body);
            if ($(window.top.document.body)) {
                body = $(window.top.document.body)
            }
            this.element.css("overflow","hidden");
            this.element.append(this.alert).appendTo(body);
            this._addButtons(this.buttonbar, callbak, type);
            this._fixPostion(this.alert, parent);
            this._bindEvents(callbak);
            this.alert.draggable({
                opacity: .95,
                handle:".wy-alert-icon"
            });
            this.alert.show("zoomIn");
        },
        //计算位置
        _fixPostion: function (pop, parent) {
            //
            var top, left;
            if (parent) {
                return;
            }

            top = (($(window).height() / 2) - (pop.outerHeight() / 2)) + this.options.vOffset;
            left = (($(window).width() / 2) - (pop.outerWidth() / 2)) + this.options.hOffset;
            if (top < 0) top = 0;
            if (left < 0) left = 0;

            pop.css({
                top: top,
                left: left
            });
        },
        _addButtons: function (buttonBar, callback, type) {
            var _self = this;
            switch (type) {
                case "alert" :
                {
                    var okBtn = $(this.options.okButton).appendTo(buttonBar).focus();
                    okBtn.click(function () {
                        if (callback)callback(true);
                        _self._close()
                    });
                    break;
                }
                case "confirm" :
                {
                    var okBtn = $(this.options.okButton).appendTo(buttonBar).focus();
                    okBtn.click(function () {
                        if (callback)callback(true);
                        _self._close()
                    });
                    var canelBtn = $(this.options.cancelButton).appendTo(buttonBar).focus();
                    canelBtn.click(function () {
                        if (callback)callback(false);
                        _self._close()
                    });
                    break;
                }
                case "prompt" :
                {
                    var okBtn = $(this.options.okButton).appendTo(buttonBar).focus();
                    okBtn.click(function () {
                        if (callback)callback(true);
                        _self._close()
                    });
                    var canelBtn = $(this.options.cancelButton).appendTo(buttonBar).focus();
                    canelBtn.click(function () {
                        if (callback)callback(false);
                        _self._close()
                    });
                    break;
                }
            }
        },
        _close: function () {
            var _self = this;
            _self._trigger("close", this);
            this.alert.hide();
            _self._destroy();
            _self.element.remove();
        },
        _bindEvents: function (callback) {
            var _self = this;
            this.alert.children(".close").click(function () {
                if (callback)callback(false);
                _self._close()
            });
        },
        _destroy: function () {
            this._super("_destroy");
        },
        gotoFront: function () {
            if (this.element.hasClass("wy-alert-back")) {
                this.element.removeClass("wy-alert-back");
            }
        },
        gotoBack: function () {
            if (!this.element.hasClass("wy-alert-back")) {
                this.element.addClass("wy-alert-back");
            }
        }
    });

    //此控件由框架提供公共方法统一创建
    $.wyAlert = {
        alertStack: [],//如果多个alert共存，以栈的方式处理
        alert: function (title, message, callback, parent, icon) {
            var alert = $("<div></div>").wyAlert({
                close: function () {
                    $.wyAlert._closeHandler()
                }
            });
            alert.wyAlert("show", title, message, callback, "alert", parent, icon);
            $.wyAlert._addHandler(alert);
        },
        confirm: function (title, message, callback, parent, icon) {
            var alert = $("<div></div>").wyAlert({
                close: function () {
                    $.wyAlert._closeHandler()
                }
            });
            alert.wyAlert("show", title, message, callback, "confirm", parent, icon);
            $.wyAlert._addHandler(alert);
        },
        prompt: function (title, message, calback, parent, icon) {

        },
        _addHandler: function (alert) {
            //TODO:使用z-index+/-完成
            if ($.wyAlert.alertStack.length > 0) {
                var last = $.wyAlert.alertStack[$.wyAlert.alertStack.length - 1];
                last.wyAlert("gotoBack");
            }
            $.wyAlert.alertStack.push(alert);
        },
        _closeHandler: function () {
            if ($.wyAlert.alertStack.length > 0) {
                $.wyAlert.alertStack.splice($.wyAlert.alertStack.length - 1, 1);
            }
            if ($.wyAlert.alertStack.length > 0) {
                var last = $.wyAlert.alertStack[$.wyAlert.alertStack.length - 1];
                last.wyAlert("gotoFront");
            } else {
                wyHelper.getOverlay().fadeOut();
            }
        }
    }
});


$(function(){
    var wyAnimate =function(type,target,animateClass,callback){
        var animateType = "in" ;
        if(type){
            animateType = type;
        }

        target.removeClass("animated");
        if(target.attr("animateClass")){
            target.removeClass(target.attr("animateClass"));
        }
        target.addClass("animated").addClass(animateClass);
        target.attr("animateClass",animateClass);
        if(animateType=="in"){
            target.show();
        }

        target.on("webkitAnimationEnd",function(){
            if(animateType=="out"){
                target.hide();
            }
            if (callback) {
                callback.call();
            }
        });
    }

    $.prototype.show = function(base){
        return function(animate,cback){
            if(animate){
                wyAnimate("in",this,animate,cback);
            }else{
                base.call(this);
            }
            return this;
        };
    }($.prototype.show);
});

/**
 *  wyButton
 *  按钮
 *  <h3>$(button).wyButton(options)</h3>
 *  @class wyButton
 *  @constructor
 *  @extends  jQuery.widget
 *  @param {Object} options
 */


/*
(function(factory){
    if (typeof define === "function" && define.cmd ) {
        define(function(require){
            var $ = require("$");
            require("jqueryui");
            require("./base");
            factory($);
        });
    } else {
        $(function(){
            factory(jQuery);
        });
    }
}(function($){

*/


    $.widget("wy.wyButton",{
        options:{
            //类型 [1]none 仅文本 [2]icon 仅图标 [3]icon-labeled 图标->文字 [4]labeled-icon 文字->图标
            //按钮大小 [1]none 标准 [2]large 大按钮 [3]small 小按钮
            //按钮风格 [1]none 背景色填充 [2]border 仅边框
            //按钮形状 [1]none 圆角 [2]rect 直角  [3]circle 圆形
            //颜色 :
            //是否有水纹效果 : [1] ripple
            clazz : ""
            //动画效果
            ,animate:null
            //可切换
            ,toggle:false
        },
        _create:function(){
            this.element.addClass("wy-button user-select-none wy-ts-color") ;
            //创建点击水纹
            if(!this.element.hasClass("animated") && this.element.hasClass("ripple")){
                this._createRipple();
            }
        },
         _createRipple:function(){
            this.element.mousedown(function(e){
                var animationEnd = wyHelper.animationEndEvent();
                if(!animationEnd){
                    return;
                }
                var x = e.pageX ;
                var y = e.pageY;

                var x1 = $(this).offset().left ;
                var y1 = $(this).offset().top;

                if($(this).children(".ripple-circle").length > 3){
                    return;
                }

                var $ripple = $("<div class='ripple rippleIn ripple-circle'></div>");
                $ripple.css({
                    left: x - x1 - 15,//15为ripple-circle初始宽度 / 2
                    top:y - y1 - 15 //15为ripple-circle初始高度 / 2
                });

                if(animationEnd){
                    $ripple.on(animationEnd,function(){
                        $(this).remove();
                    });
                }

                $(this).append($ripple);

            });

         }
    });


/*
}));
*/
/**
 * Created by hexb on 15/4/24.
 * input type='checkbox'替代控件
 */

$(function(){
    $.widget("wy.wyCheckbox",{
        options:{
            colorStyle:null
        },
        container:null,
        source:null,
        checkTrigger:null,
        label:null,
        _create:function(){
            //优先控件上的属性设置
            if(this.element.attr("colorStyle")){
                this.options.colorStyle = this.element.attr("colorStyle");
            }
            this._createUI();
            this._bindEvents();
        },
        _createUI:function(){
            //this.options.width = this.element.width();
            this.label = this.element.next("label");
            this.element.wrap("<div class='wy-checkbox'><span class='wy-source wy-checkbox-source'></span></div>");
            this.container = this.element.closest(".wy-checkbox");
            this.source = this.container.children(".wy-checkbox-source");
            this.checkTrigger = $("<span class='wy-checkbox-trigger user-select-none'><i class='fa fa-check'></i></span>").appendTo(this.container);
            this.label.appendTo(this.container);

            if(this.element.is(":checked")){
                this.container.addClass("checked");
            }

            if(this.element.is(":disabled")){
                this.container.addClass("disabled");
            }

            if(this.options.colorStyle){
                this._setColorStyle(this.options.colorStyle);
            }
        },
        _bindEvents:function(){
            var _self = this;
            this.__bindEvents4Target(this.checkTrigger);
            this.__bindEvents4Target(this.label);
        },
        __bindEvents4Target:function(traget){
            if(!traget){
                return ;
            }
            var _self = this;
            traget.hover(function(){
                if(_self.element.is(":disabled")){
                    return;
                }
                _self.container.addClass("hover");
            },function(){
                _self.container.removeClass("hover");
            }).click(function(e){
                e.stopPropagation();
                if(_self.element.is(":disabled")){
                    return;
                }
                _self._toggleCheck();
            });

        },
        _setColorStyle:function(colorStyle){
            this.checkTrigger.css("border-color",colorStyle);
            this.checkTrigger.children("i").css("background-color",colorStyle);
        },
        _triggerChange:function(event){
            var _self = this ;
            this.element.trigger("change");
            this._trigger("change",null,{
                checked:_self.isChecked(),
                value:_self.source.val(),
                target:_self.container
            });
        },
        //silent为true不触发change事件
        _toggleCheck:function(silent){
            if(this.isChecked()){
                this.unCheck(silent);
            }else{
                this.check(silent);
            }
        },
        check:function(silent){
            this.setCheck(true,silent);
        },
        unCheck:function(silent){
            this.setCheck(false,silent);
        },
        setCheck:function(isCheck,silent){
            if(isCheck){
                if(!this.container.hasClass("checked")){
                    this.container.addClass("checked");
                    this.element.prop("checked",true);
                    if(!silent){
                        this._triggerChange();
                    }
                }
            }else{
                if(this.container.hasClass("checked")) {
                    this.container.removeClass("checked");
                    this.element.prop("checked",false);
                    if(!silent){
                        this._triggerChange();
                    }
                }
            }
        },
        toggleCheck:function(){
            this._toggleCheck();
        },
        isChecked:function(){
            return this.container.hasClass("checked");
        },
        disable:function(){
            this.container.addClass("disabled");
            this.element.attr("disabled","disabled");
        },
        enable:function(){
            this.container.removeClass("disabled");
            this.element.removeAttr("disabled");
        }
    });
});

/**
 * Created by hexb on 15/3/18.
 *  表格控件，对应html table 元素所对应的控件
 *  1.初始化分为从空白div初始化 / 从已有的table初始化（此方式初始化要求table格式分为thead,tbody）
 *  columns:[
 *      {
 *          field:String //列数据字段
 *          headerText：String //列名
 *          sortable:bool //是否可以排序
 *          sortType:number //排序方式，默认排数字方式，可选值，auto / number / char / function
 *          content:function(rowData) //列数显示方式,默认为空，为空时使用field设置显示
 *          -------------以下为次要属性------------
 *          columnHeaderClass:String //该列的样式类，用于表格头
 *          columnHeaderStyle:String //样式，用于表格头
 *          columnBodyClass:String //该列的样式类，用于数据列
 *          columnBodyStyle:String //样式，用于数据列
 *          columnWidth:数值 / 百分比
 *      }
 *  ]
 *  注：如果以表格方式初始化，则是样式上套用，其中部分公用方法可能不可用
 *  实现顺序：
 *  1）元素结构
 *  2）根据设置添加各组件
 *  3) 事件
 */


/**
 *  wyDatatable
 *  表格控件
 *  <h3>$(div).wyDatatable(options)</h3>
 *  @class wyDatatable
 *  @constructor
 *  @param {Object} options
 *  @param options.clumns
 *  @param options.clumns.field:String 列数据字段
 *  @param options.clumns.headerText：String 列名
 *  @param options.clumns.sortable:bool 是否可以排序
 *  @param options.clumns.sortType:number 排序方式，默认排数字方式，可选值，auto / number / char / function
 *  @param options.clumns.content:function(rowData) 列数显示方式,默认为空，为空时使用field设置显示
 *  @param options.clumns.columnHeaderClass:String 该列的样式类，用于表格头
 *  @param options.clumns.columnHeaderStyle:String 样式，用于表格头
 *  @param options.clumns.columnBodyClass:String 该列的样式类，用于数据列
 *  @param options.clumns.columnBodyStyle:String 样式，用于数据列
 *  @param options.clumns.columnWidth:数值 / 百分比
 *
 *
 *  @param options.paginator: null,此表格对应的分页控件，可选值：null,auto,分页组件jquery对象
 *  @param options.datasource: null, 对应的数据源，Object / Function
 *  @param options.nodataTips: "暂无数据",没有数据时表格中显示提示文本
 *  @param options.sequenceColumn: "auto",排序的字段，可选值null(无序号字列显示),auto(控件自动序列)，String类型（到datasource中的字段）
 *  @param options.checkColumn: "ID",复选框勾选列，可选值null(无复选框列),默认选择ID，String类型（atasource中的字段）
 *  @param options.checkUnionRowSelect: "true",check选中时是否触发rowSelect,默认"是",如果此属性设为true,selectionMode自动为multiple
 *  @param options.selectionMode: "single",列选择模式，可选值"single/multiple"单选式多选
 *  @param options.rowSelectUnionCheck: true,行选择时是否自动联动checkbox(暂未实现)
 *  @param options.rowEditRender: null,行处于编辑状态时渲染函数:function(rowData)
 *  @param options.cellboder: "both", 表格内td是否有分隔边框,可选both，header,body,none
 *  @param options.intervalRow true ,表格数据列是否区分奇偶行
 *  @param options.customerRender 数据填充后自定义渲染函数，表格控件setDatasource后执行
 *  @param options.sortRange "current" 排序方式，默认为当前页内数据排序，可选：all 全部数据排序，设置为此参数时，需要触发事件，或刷新dataSource
 *  @param options.hasLock true是否需要显示锁定按钮
 *  @param options.colorStyle check列的控件theme样式
 *

 *   @event  rowCheck 当每一行的check列被check时触发
 *   @event columnSort 排序时触发，此事件只在sortRange设置为all时触发，以便处理事件重新刷新datasource
 */

$(function () {
    $.widget("wy.wyDatatable", {
        options: {
            columns: [],//表格列设置
            paginator: null,//此表格对应的分页控件，可选值：null,auto,分页组件jquery对象
            datasource: null,// 对应的数据源，Object / Function
            nodataTips: "暂无数据",//没有数据时表格中显示提示文本
            sequenceColumn: "auto",//排序的字段，可选值null(无序号字列显示),auto(控件自动序列)，String类型（到datasource中的字段）
            checkColumn: "ID",//复选框勾选列，可选值null(无复选框列),默认选择ID，String类型（atasource中的字段）
            checkUnionRowSelect: "true",//check选中时是否触发rowSelect,默认"是",如果此属性设为true,selectionMode自动为multiple
            selectionMode: "single",//列选择模式，可选值"single/multiple"单选式多选
            rowSelectUnionCheck: true,//行选择时是否自动联动checkbox(未实现 TODO:)
            rowEditRender: null,//行处于编辑状态时渲染函数:function(rowData)
            cellboder: "both", //表格内td是否有分隔边框,可选both，header,body,none
            intervalRow: true ,//表格数据列是否区分奇偶行
            customerRender:null ,//数据填充后自定义渲染函数，表格控件setDatasource后执行
            //以下为新增、编辑、查看设置

            //绑定事件
            rowCheck:null, //fn当每一行的check列被check时触发
            //排序方式，默认为当前页内数据排序，可选：all 全部数据排序，设置为此参数时，需要触发事件，或刷新dataSource
            sortRange:"current",
            hasLock:true, //是否需要显示锁定按钮
            colorStyle:null //check列的控件颜色样式 TODO:如果为一个颜色值，则设定check列和序号列，如果为一个对象则分别设置
        },
        //用于记录控件内全局对象
        container: null,
        header: null,
        body: null,
        bodyContainer:null,//表格内容的实际容器
        footer: null,
        paginator: null,
        startColIndex:0,
        rows:null,//数据列列表
        data:null,
        hideCols:[],
        _init: function () {
            
        },
        _create: function () {
            //TODO:初始化时清除一些设置。注：待确认和解决，对象被初始化后，内存中应该还存在，用$.load再次加载页面，上次的参数设置好像依然有效！！！！
            //TODO:隐藏列的问题，上一次操作隐藏了某列，下次再次重新加载页面时，hidCols依然被保存着，什么原因待查
            this.hideCols = [];

            wyHelper.time("datatable");

            this.data = this.options.datasource;

            //1.从空白div通过columns设置创建
            if (this.element.prop("tagName").toLowerCase() == "div") {
                this.container = this.element;
                this.container.addClass("wy-datatable");
                this._createUIWithDiv();
            }
            //2.从已有表格中获取列创建
            if (this.element.prop("tagName").toLowerCase() == "table") {
                this.container = this.element.wrap("<div class='wy-datatable'></div>").closest(".wy-datatable");
                this.container.attr("style", this.element.attr("style"));
                this._createUIWithTable();
            }
            this._adjustPosition();
            this._createSequenceCol();
            this._createCheckCol();
            this._createSortableCol();

            this._bindEvents();
            this._renderData();

            //3.关于样式的设置
            if (this.options.cellboder) {
                switch(this.options.cellboder){
                    case "both":{
                        this.container.addClass("border-both");
                        break;
                    }
                    case "header":{
                        this.container.addClass("border-header");
                        break;
                    }
                    case "body":{
                        this.container.addClass("border-body");
                        break;
                    }
                }
            }

            if (this.options.intervalRow) {
                this.container.addClass("odd-even-row");
            }
            this._adjustColumnWidths();
        },
        _destroy:function(){
            this.container = null ;
            this.header =  null ;
            this.body = null ;
            this.bodyContainer = null ;//表格内容的实际容器
            this.footer = null ;
            this.paginator = null ;
            this.startColIndex = 0 ;
            this.rows = null ;//数据列列表
            this.data = null ;
            this.hideCols = [] ;
        },
        //1.1.从空白div通过columns设置创建
        _createUIWithDiv: function () {
            if(this.options.columns.length==0){
                throw new Error("datatable column undefined!");
            }
            //a.创建header
            var headerHtml = "<div class='wy-datatable-header'><table cellpadding='0' cellspacing='0'><thead><tr>";
            for(var i=0;i<this.options.columns.length;i++){
                //排序设置
                if(this.options.columns[i]["sortable"]){
                    headerHtml += "<th sortable='true'" ;
                    if (this.options.columns[i]["sortType"]){
                        headerHtml += " sortable='true' sort-type='"+this.options.columns[i]["sortType"]+"'" ;
                        headerHtml += " class='sort-cell'"
                    }
                }else{
                    headerHtml += "<th";
                }

                if(this.options.columns[i]["columnWidth"]){
                    headerHtml += " width='" + this.options.columns[i]["columnWidth"] + "'" ;
                }

                //次要属性设置
                if(this.options.columns[i]["columnHeaderClass"]){
                    headerHtml += " class='" + this.options.columns[i]["columnHeaderClass"] + "'" ;
                }

                if(this.options.columns[i]["columnHeaderStyle"]){
                    headerHtml += " style='" + this.options.columns[i]["columnHeaderStyle"] + "'" ;
                }

                if(this.options.columns[i]["columnHeaderWidth"]){
                    headerHtml += " width='" + this.options.columns[i]["columnHeaderWidth"] + "'" ;
                }

                headerHtml += "><span>" +  this.options.columns[i]["headerText"] + "</span></th>";
            }
            headerHtml+="</tr></thead></table></div>";

            this.header = $(headerHtml).appendTo(this.container);

            //b.创建body
            this.body = $("<div class='wy-datatable-body'></div>")
                .append($("<table cellpadding='0' cellspacing='0'><tbody></tbody></table>"))
                .appendTo(this.container);

            //c.根据header设置body位置
            if(this.header){
                this.body.css("top",this.header.outerHeight());
            }

            this.bodyContainer = wyHelper.scroll(this.body);
        },
        //1.2.从已有表格中获取列创建
        _createUIWithTable: function () {
            //分解已有表格
            var header = this.element.find("thead").remove();
            var body = this.element.find("tbody").remove();
            var footer = this.element.find("tfoot").remove();

            this.container.append($("<span class='wy-datatable-source'></span>").append(this.element.css("display", "none")))
            this.header = $("<div class='wy-datatable-header'></div>")
                .append($("<table cellpadding='0' cellspacing='0'></table>").append(header))
                .appendTo(this.container);

            this.body = $("<div class='wy-datatable-body'></div>")
                .append($("<table cellpadding='0' cellspacing='0'></table>").append(body))
                .appendTo(this.container);
            this.bodyContainer = wyHelper.scroll(this.body);

            //TODO:footer
        },
        //2设置各组件属性
        _adjustPosition: function () {
            var bottom = 0;
            if (this.footer) {
                bottom += this.footer.height();
            }
            if (this.paginator) {
                bottom += this.paginator.height();
            }
            if(this.body){
                this.body.css("bottom", bottom);
            }
        },
        //保持header与body列宽度一致
        _adjustColumnWidths: function () {
            if(!this.header || !this.body){
                return ;
            }
            var _self = this ;
            this.header.find("th").each(function(){
                var headerCol = $(this),
                    colIndex = headerCol.index(),
                    innerWidth = headerCol.innerWidth();
                _self.body.find("tr:first td").eq(colIndex).width(innerWidth);
            });
        },
        //根据设置添加sequence列
        _createSequenceCol: function () {
            if(!this.header){
                return ;
            }
            if (!this.options.sequenceColumn || this.options.sequenceColumn == "null") {
                return;
            }
            //为表格头添加序号列
            var $htr = this.header.find("tr");
            //是否需要显示锁定列
            var lockButton = "<i class='icon icon-unlock wy-datatable-rowLock'></i>" ;
            if(!this.options.hasLock){
                lockButton = "<i class='icon icon-unlock wy-datatable-rowLock' style='display: none;'></i><i class='fa fa-sort-numeric-asc'></i>" ;
            }
            $htr.prepend("<th class='sequence-column'>"+lockButton+"</th>");

            //为表格内容添加
            if(!this.body){
                return;
            }
            this.body.find("tr").each(function (index) {
                $(this).prepend("<td class='sequence-column'>" + (index + 1) + "</td>");
            });

            this.startColIndex ++;
        },
        //根据设置添加check列
        _createCheckCol: function () {
            if(!this.header){
                return ;
            }

            if (!this.options.checkColumn || this.options.checkColumn == "null") {
                return;
            }
            //为表格头添加全选
            var $htr = this.header.find("tr");
            var $sequenCol = this.header.find(".sequence-column");
            if ($sequenCol) {
                $sequenCol.after("<th class='check-column'><input type='checkbox'/></th>");
            } else {
                $htr.prepend("<th class='check-column'><input type='checkbox'/></th>");
            }

            if(!this.body){
                return;
            }
            //为表格内容添加
            this.body.find("tr").each(function (index) {
                $sequenCol = $(this).find(".sequence-column");
                if ($sequenCol) {
                    $sequenCol.after("<td class='check-column'><input type='checkbox'/></td>");
                } else {
                    $(this).prepend("<td class='check-column'><input type='checkbox'/></td>");
                }
            });

            this.startColIndex ++;
        },
        //设置排序列UI
        _createSortableCol: function () {
            var _self = this;
            if(!this.header){
                return ;
            }
            var $sortableTh = this.header.find("th[sortable=true]"),sortHtml;
            $sortableTh.each(function () {
                sortHtml = "<span class='column-sort'>";
                sortHtml+="<i class='column-asc fa fa-angle-up'  style='display: none;'/>";
                sortHtml+="<i class='column-sort-original fa fa-ellipsis-v'/>";
                sortHtml+="<i class='column-desc fa fa-angle-down' style='display: none;'/>";
                sortHtml+="</span>";
                $(this).append(sortHtml);
            });
        },
        //渲染数据
        _renderData:function(){
            if(!this.data){
                return ;
            }
            var tb = this.bodyContainer.find("tbody");
            tb.html("");

            if($.isArray(this.data)){
                //处理无数据
                if(this.data.length == 0){
                    tb.html("<tr><td colspan='"+ (this.options.columns.length + this.startColIndex) + "'>"+this.options.nodataTips+"</td></tr>");
                }else{
                    for(var i=0;i<this.data.length;i++){
                        this.__addDataRow(this.data[i],i);
                    }
                }
                if(this.options.customerRender){
                    this.options.customerRender();
                }
            }

            this._adjustColumnWidths();

            if(this.options.checkColumn){
                var opt = {} ;
                //TODO:创建方法来获取check列颜色样式
                if(this.options.colorStyle){
                    opt = {
                        colorStyle:this.options.colorStyle
                    };
                }
                this.container.find(".check-column input[type=checkbox]").wyCheckbox(opt);
            }

        },
        //表格排序(只针对当前表格（页）中数据)
        _sortTable:function(colIndex,storType,sortOrder,sortFn,event){
            if(this.options.sortRange==="all"){
                this._trigger("columnSort",null,{
                    sortType:storType,
                    sortOrder:sortOrder == 1 ? "ASC" : "DESC",
                    sortColumnIndex:colIndex - this.startColIndex,
                    sortColumnField:this.options.columns[colIndex - this.startColIndex].field
                });
                return ;
            }

            var sortArr=[],$trs= this.bodyContainer.find("tr"),sortFunction;
            if(sortFn){
                sortFunction = function(a, b){
                    return (sortOrder * sortFn(a,b));
                };
            }else{
                sortFunction = function(a, b) {
                    var value1 = a["value"],
                        value2 = b["value"],
                        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
                    return (sortOrder * result);
                };
            }
            $trs.each(function(){
                sortArr.push({
                    rowIndex : $(this).index(),
                    value : $(this).find("td").eq(colIndex).text() //TODO
                });
            });
            sortArr.sort(sortFunction);

            for(var i=0;i<sortArr.length;i++){
                this.bodyContainer.find("tbody").append($trs[sortArr[i].rowIndex]);
            }
        },
        _bindEvents: function () {
            var _self = this;
            //锁定列事件
            this.header.find(".wy-datatable-rowLock").click(function(){
                $(this).closest("tr").toggleClass("locked");
                $(this).toggleClass("icon-unlock").toggleClass("icon-lock");
            });

            //排序事件
            this.header.find(".column-sort").click(function(){
                var $tr=$(this).closest("tr");
                if($tr.hasClass("locked")){
                    return;
                }
                _self.header.find(".column-sort").removeClass("sorted").find(".column-sort-original").show();
                _self.header.find(".column-sort").find(".column-asc").hide();
                _self.header.find(".column-sort").find(".column-desc").hide();
                var $th=$(this).closest("th"),sortType=$th.attr("sort-type"),sortOrder=$(this).attr("sort-order"),colIndex;
                $(this).children(".fa-sort").hide();
                if(!sortOrder || sortOrder=="desc"){
                    //默认升序
                    $(this).attr("sort-order","asc").addClass("sorted");
                    sortOrder = 1;
                    $(this).children(".column-sort-original").hide();
                    $(this).children(".column-desc").hide();
                    $(this).children(".column-asc").show();
                }else{
                    $(this).attr("sort-order","desc").addClass("sorted");
                    sortOrder = -1;
                    $(this).children(".column-sort-original").hide();
                    $(this).children(".column-asc").hide();
                    $(this).children(".column-desc").show();
                }

                colIndex = $th.index();
                //TODO:sort自定义函数
                _self._sortTable(colIndex,sortType,sortOrder,null,event);
            });

            //容器大小改变事件
            this.container.resize(function(){
                _self.adjustColumnWidths();
            });

            //header列check事件
            this.header.find(".check-column input[type=checkbox]").bind("change",function(){
                var checkRow = _self.bodyContainer.find(".check-column input[type=checkbox]") ;
                if($(this).prop("checked")){
                    checkRow.each(function(){
                        //silent:true避免表格头和表格体checkbox相互触发事件
                        $(this).wyCheckbox("check",true);
                    });
                }else{
                    checkRow.each(function(){
                        $(this).wyCheckbox("unCheck",true);
                    });
                }
                //表格事件
                _self._trigger("rowCheck",null,null);
            });
        },
        //添加单行数据
        __addDataRow:function(data,rowIndex){
            //序号列
            var trHtml = "<tr>" ;

            if(this.options.sequenceColumn){
                var index = this.options.sequenceColumn == "auto" ? (rowIndex + 1) : data[this.options.sequenceColumn];
                trHtml += "<td class='sequence-column'><i>" + index + "</i></td>";
            }

            //check列
            if(this.options.checkColumn){
                var checkValue = data[this.options.checkColumn] ;
                trHtml += "<td class='check-column'><input type='checkbox' value='" + checkValue + "'/></td>"
            }

            //数据列
            var col;
            for(var i=0;i<this.options.columns.length;i++){
                col = this.options.columns[i] ;

                trHtml += "<td>" ;
                //自定义
                if(col.content){
                    trHtml += col.content(data,rowIndex) +"</td>";
                    continue;
                }

                if(col.field){
                    trHtml += data[col.field] +"</td>";
                    continue
                }
                trHtml += "</td>"
            }
            trHtml += "</tr>";
            $(trHtml).data("data",data).appendTo(this.bodyContainer.find("tbody"));
        },
        //设置数据源（目前只支持从div初始设置了columns的表格以及array结构数据）
        setDataSource:function(data){
            var _self = this ;
            this.data = data ;
            this._renderData();
            //绑定行check事件
            this.bodyContainer.find(".check-column input[type=checkbox]").bind("change",function(){
                if(_self.getCheckValues().length == _self.getRowCount()){
                    _self.header.find(".check-column input[type=checkbox]").wyCheckbox("check");
                }

                if(_self.getCheckValues().length == 0){
                    _self.header.find(".check-column input[type=checkbox]").wyCheckbox("unCheck");
                }
                _self._trigger("rowCheck",null,null);
            });

            //绑定行选中事件(单选)
            this.bodyContainer.find("tr").bind("click",function(){
                var rowIndex = _self.bodyContainer.find("tr").index($(this));
                if($(this).hasClass("selected")){
                    _self.unselectRow(rowIndex);
                }else{
                    _self.selectRow(rowIndex);
                }
            });

            //隐藏列同步
            if(this.hideCols.length>0){
                this.hideColumns(this.hideCols);
            }

            //重置表格头
            this.header.find(".check-column input[type=checkbox]").wyCheckbox("unCheck");

            //如果有分页控件，重置分页控件到正确状态
            //TODO:

            this._adjustColumnWidths();
        },
        //调整列保持表格头与表格内容一致
        adjustColumnWidths: function () {
            this._adjustColumnWidths();
        },
        //隐藏一列
        hideColumn: function (index) {
            this.header.find("tr th").eq(index).hide();
            this.body.find("tr").each(function () {
                $(this).children("td").eq(index).hide();
            });
            this._adjustColumnWidths();
            //暂存被隐藏的列，用更datasource更新时保持一致
            if(!wyHelper.inArray(this.hideCols,index)){
                this.hideCols.push(index);
            }
        },
        //显示一列
        showColumn: function (index) {
            this.header.find("tr th").eq(index).show();
            this.body.find("tr").each(function () {
                $(this).children("td").eq(index).show();
            });
            if(wyHelper.inArray(this.hideCols,index)){
                this.hideCols.remove(index);
            }
            this._adjustColumnWidths();
        },
        //隐藏列列表
        hideColumns:function(cols){
            if(cols){
                var index ;
                for(var i=0;i<cols.length;i++){
                    index = cols[i];
                    this.header.find("tr th").eq(index).hide();
                    this.body.find("tr").each(function () {
                        $(this).children("td").eq(index).hide();
                    });
                    if(!wyHelper.inArray(this.hideCols,index)){
                        this.hideCols.push(index);
                    }
                }
                this._adjustColumnWidths();
            }
        },
        //显示被隐藏的列列表
        showColumns:function(cols){
            if(cols){
                var index ;
                for(var i=0;i<cols.length;i++){
                    index = cols[i];
                    this.header.find("tr th").eq(index).show();
                    this.body.find("tr").each(function () {
                        $(this).children("td").eq(index).show();
                    });
                    if(wyHelper.inArray(this.hideCols,index)){
                        this.hideCols.remove(index);
                    }
                }
                this._adjustColumnWidths();
            }
        },
        //添加新行
        appendRow:function(data){
            var rowSize = this.bodyContainer.find("tbody>tr").length;
            this.__addDataRow(data,rowSize);

            if(this.options.checkColumn){
                this.container.find(".check-column input[type=checkbox]").wyCheckbox();
            }
        },
        //获取check行对应的check值
        getCheckValues:function(){
            var values = [] ;
            this.bodyContainer.find(".check-column input:checked").each(function(){
                values.push($(this).val());
            });
            return values;
        },
        //获取全部行数量
        getRowCount:function(){
            return this.bodyContainer.find("tbody tr").length;
        },
        //选中一行
        selectRow:function(rowIndex,silent){
            var row = this.bodyContainer.find("tbody tr").eq(rowIndex) ;
            this.bodyContainer.find("tbody tr").removeClass("selected");
            row.addClass("selected");
            if(!silent){
                this._trigger("rowSelect",null,{
                    data:row.data("data"),
                    ui:row
                });
            }
        },
        //取消选中一行
        unselectRow:function(rowIndex,silent){
            var row = this.bodyContainer.find("tbody tr").eq(rowIndex) ;
            row.removeClass("selected");
            if(!silent){
                this._trigger("rowUnselect",null,{
                    data:row.data("data"),
                    ui:row
                });
            }
        },
        clearSelectRow:function(silent){
            var row = this.bodyContainer.find("tbody tr");
            row.removeClass("selected");
        },
        //获取隐藏列数量
        getVisibleColumnCount:function(){
            return this.header.find("th:visible").length ;
        },
        //获取选中行的数据
        getSelectedRowData:function(){
            var row = this.bodyContainer.find("tbody tr[class~=selected]");
            if(row && row.data("data")){
                return row.data("data");
            }else{
                return null;
            }
        },
        getDataSource:function(){
            return this.data;
        }
    });
});
/*
(function(factory){
    //支持seajs
    if (typeof define === "function" && define.cmd ) {
        define(function(require){
            var $ = require("$");
            require("jqueryui");
            require("wybase");
            factory($);
        });
    } else {
        $(function(){
            factory(jQuery);
        });
    }
}(function($){
*/


    $.widget("wy.wyDialog",{
        options:{
            modal:true,//是否是模态窗口
            draggable: true,//是否可以拖动
            resizable: true,//是否可以调整大小
            awaysOnTop:true,//是否处于顶层,此设置在iframe嵌入页面时将显示在最顶层body中
            parent:null,//依附的父元素，如果有设置，则显示时以此元素为基准显示
            offsetX:  0,
            offsetY:-50,
            scroll:"y", //可选:null,y,x,xy
            button:{
                //全屏
                full:true,
                //刷新
                refresh:true,
                //关闭
                close:true,
            },
            hasHeader:true,
            buttonAlign:"right",
            defaultClose:null, //如果有自定的底栏，为关闭动作绑定一个元素
            bridge:null //如果dialog处于顶层容器中,将要调用的子窗体函数暂时复制到顶层,以便能从parent调用子页面函数
        },
        parts:{
            base:"wy-dialog",
            header:"wy-dialog-header",
            caption:"wy-dialog-caption",
            headerButtonBar:"wy-dialog-title-buttonbar",
            customerBar:"wy-dialog-header-customer",

            close:"wy-dialog-close",
            full:"wy-dialog-full",
            refresh:"wy-dialog-refresh",

            content:"wy-dialog-content",
            footer:"wy-dialog-footer",
        },
        icons:{
            close : icoDef.close,
            full : icoDef.full,
            fullOff : icoDef.fullOff,
            refresh : icoDef.refresh,
            resizeHandle : icoDef.resizeHandle
        },
        //组件内局部变量
        content:null,
        header:null,
        footer:null,
        contentContainer:null,//原始content
        _create:function(){
            this.element.addClass(this.parts.base).addClass(this.options.theme);
            this._createUI();
            this._bindEvent();
        },
        _createUI:function(){
            var title = this.element.attr("title") ? this.element.attr("title") : "" ;
            var titleButtonsHtml = "" ;
            var headerHtml;
            var contentHtml;

            this.element.removeAttr("title");

            if(this.options.button.full){
                titleButtonsHtml += "<span class='" + this.parts.full + "'><i class='" + this.icons.full + "'></i></span>";
            }
            if(this.options.button.refresh){
                titleButtonsHtml += "<span class='" + this.parts.refresh + "'><i class='" + this.icons.refresh + "'></i></span>";
            }
            if(this.options.button.close){
                titleButtonsHtml += "<span class='" + this.parts.close + "'><i class='" + this.icons.close + "'></i></span>";
            }

            headerHtml = "<div class='" + this.parts.header + "'><span class='" + this.parts.caption + "'>"+ title + "</span><span class='" + this.parts.headerButtonBar + "'>" + titleButtonsHtml + "</span></div>" ;
            contentHtml = "<div class='" + this.parts.content + "'></div>";

            this.header = $(headerHtml);
            this.element.contents().wrapAll(contentHtml);


            this.content = this.element.children("." + this.parts.content);
            this.contentContainer = this.content ;
            this.content.before(this.header);

            this.footer = this.content.find("." + this.parts.footer);

            if(this.footer){
                this.content.after(this.footer);
            }

            //调整cotent位置
            this.content.css("top",this.header.outerHeight());
            this.content.css("bottom", 0);

            if(this.footer){
                this.content.css("bottom", this.footer.outerHeight());
            }

            //可拖动
            if(this.options.draggable){
                this.element.draggable({
                    opacity: .95,
                    handle:"." + this.parts.header
                });
            }

            //可调整大小
            if(this.options.resizable){
                this.element.resizable();
                this.element.children(".ui-resizable-se").append("<i class='"+ this.icons.resizeHandle +"'></i>");
            }

            //滚动条
            //TODO:区别创建X/Y/XY滚动条
            if(this.options.scroll){
                //this.content = wyHelper.scroll(this.contentContainer);
            }

            this.element.hide();
        },
        _bindEvent:function(){
            var _self = this ;
            //标题栏关闭
            this.header.find("." + this.parts.close).click(function(){
                _self.hide();
            });

            //为默认绑定关闭按钮添加事件
            if(this.options.defaultClose){
                var fbtn = null;
                if(this.options.defaultClose instanceof jQuery){
                    fbtn = this.options.defaultClose ;
                }else{
                    fbtn = $(this.options.defaultClose);
                }
                fbtn.click(function(){
                    _self.hide();
                });
            }

        },
        _adjustPosition:function(){
            var top, left, $parent;
            if (this.options.parent) {
                $parent = this.options.parent;
            }else if(window.top){
                $parent = $(window.top);
            }else{
                $parent = $(window);
            }
            top = ($parent.height() / 2) - (this.element.outerHeight() / 2) + this.options.offsetY;
            left = ($parent.width() / 2) - (this.element.outerWidth() / 2) + this.options.offsetX;

            if (top < 0) top = 0;
            if (left < 0) left = 0;

            this.element.css({
                top: top,
                left: left
            });
        },
        show:function(){
            if(this.options.modal){
                wyHelper.showOverlay();
            }
            this.element.css("z-index",gConfig.dialogIndex ++);
            this.element.show();
            this._adjustPosition();
            this._trigger("open");
            var body ;
            if(this.options.awaysOnTop){
                body = wyHelper.getBody();
                if(wyHelper.hasTop()){
                    //bind bridge
                    if(this.options.bridge){
                        for(var k in this.options.bridge){
                            parent[k] = this.options.bridge[k] ;
                        }
                    }

                    this.element.appendTo(body);

                    //可拖动
                    if(this.options.draggable){
                        this.element.draggable("destroy");
                        this.element.draggable({
                            opacity: .95,
                            handle:"." + this.parts.header
                        });
                    }

                    //可调整大小
                    if(this.options.resizable){
                        this.element.resizable("destroy");
                        this.element.resizable();
                        this.element.children(".ui-resizable-se").append("<i class='"+ this.icons.resizeHandle +"'></i>");
                    }
                }
            }

            if(this.options.scroll){
                this.content = wyHelper.scroll(this.contentContainer);
            }
        },
        hide:function(){
            if(this.options.modal){
                wyHelper.hideOverlay();
            }
            gConfig.dialogIndex--;
            this.element.hide();
            this._trigger("close");

            if(this.options.awaysOnTop && wyHelper.hasTop()) {
                //unbind bridge
                if (this.options.bridge) {
                    for (var k in this.options.bridge) {
                        parent[k] = null;
                    }
                }
            }

            var body = $("body");
            this.element.appendTo(body);
        },
        open:function(){
            this.show();
        },
        close:function(){
            this.hide();
        }
    });


/*

}));
    */
/**
 * Created by hexb on 15/3/18.
 *  下拉列表控件，对应html select 元素所对应的控件
 *  扩展功能
 *  1.支持多选
 *  2.支持下拉选项过滤
 */

/***
 *控件相关的class
 * wy-dropdown
 * wy-dropdown-display
 * wy-dropdown-trigger
 * wy-dropdown-pop,wy-dropdown-filter
 * **/

$(function () {
    $.widget("wy.wyDropdown", {
        options: {
            width: 150,//默认宽度，具体宽度以对应的源控件决定
            itemRenderer: null, //列表渲染函数（fn）,参数为当前列表项的数据(data)
            popHeight: 150, //弹出列表高度,
            filter: false,//是否有选项过滤
            customerFilter:null, //自定义过滤器
            mutil: false,//是否支持多选
            effect: 'fade', //弹出下拉列表效果设定
            effectSpeed: 200,
            groupCanSelect: true, //选项分组是否可以被选择
            theme: null
        },
        //对象属性定义-begin
        pop: null,
        trigger: null,
        label: null,
        content: null,
        listContainer: null,//列表一级容器
        choices: null,//options
        filter:null,

        //默认的pop显示/隐藏效果动画
        fnShowEffect: null,
        fnHideEffect: null,
        changeFromUI:true,

        //对象属性定义-end
        //-------------------------------------------
        //jqueryUI widget方式重写
        _init: function () {
            //tag:此方法会在调用组件初始化方法时再次调用，如：$("").wyButton();
            if(this.pop){
                this.pop.css({
                    "max-height":this.options.popHeight
                });
            }
            //TODO
            if(!this.options.groupCanSelect){
                this.content.find(".wy-dropdown-list-group-header").removeClass("selectable");
            }else{
                this.content.find(".wy-dropdown-list-group-header").addClass("selectable");
            }
        },
        _initOptions:function(){
            this.options.theme = this.element.attr("theme") ? this.element.attr("theme") : this.options.theme;
        },
        //jqueryUI widget方式重写
        _create: function () {
            this._initOptions();
            //TODO:平均耗时:5ms需要优化
            this._createUI();
            this._bindEvents();
            this._initListFromSource(); //TODO:优化此方法，此方消耗时间过长
            this._selectDefault(); //TODO:优化此方法，此方消耗时间过长
        },
        //创建UI
        _createUI: function () {
            if (this.element.hasClass("wy-dropdown")) {
                this.element.removeClass("wy-dropdown");
            }

            this.options.width = this.element.width();
            this.choices = this.element.children('option');

            //整个控件容器
            this.element.wrap("<div class='wy-dropdown' style='width: " + this.options.width + "px;'><span class='wy-source wy-dropdown-source'></span></div>");
            this.content = this.element.closest(".wy-dropdown");

            //显示选中列表项
            this.label = $(this.options.mutil ? "<ul class='wy-dropdown-display'><input type='text'/></ul>" : "<div class='wy-dropdown-display'></div>").appendTo(this.content);

            //显示下拉按钮
            this.trigger = $("<div class='wy-dropdown-trigger'><i class='fa fa-angle-down'></i></div>").appendTo(this.content);

            //过滤选项输入框
            var filterInput = this.options.filter ? "<div class='wy-dropdown-filter'><i class='fa fa-search'></i><input placeholder='输入内容过滤列表' /></div>" : "";

            //列表显示POP容器
            this.pop = $("<div class='wy-dropdown-pop " + (this.options.filter ? "has-filter" : "")
                + "' style='max-height: " + this.options.popHeight + "px;'>"
                + filterInput
                + "<div class='wy-dropdown-list-box'><ul class='wy-dropdown-list'></ul></div></div>");
            this.pop.addClass(this.options.theme);
            this.content.append(this.pop);
            //计算列表容器高度




            //下拉列表容器
            this.listContainer = this.pop.find("ul");
            var userStyle = this.element.attr('style');
            if (!userStyle || userStyle.indexOf('width') == -1) {
                this.content.width(this.element.outerWidth(true) + 5);
            } else {
                this.content.attr('style', userStyle);
            }
            //隐藏源控件
            this.element.css("display", "none");
            if (this.options.theme) {
                this.content.addClass(this.options.theme);
            }

            this.filter =  this.pop.find(".wy-dropdown-filter").children("input");

            //设置过滤文本控件宽度
             this.filter.css("width",this.element.outerWidth(true) -45);
        },
        //UI事件
        _bindEvents: function () {
            var _self = this;
            var speed = this.options.effectSpeed;
            var filterFn = this.options.customerFilter;

            //触发下拉列表
            this.trigger.click(function (e) {
                e.stopPropagation();
                _self._showPop(speed);
            });

            //触发下拉列表
            this.label.click(function (e) {
                e.stopPropagation();
                _self._showPop(speed);
            });

            //触发过滤事件
            this.filter.bind("input propertychange",function(){
                var key = $(this).val();
                if(jQuery.trim(key)==""){
                    _self.listContainer.find(".wy-dropdown-list-leaf").each(function(){
                        $(this).text($(this).text());
                    });
                    _self.listContainer.find(".wy-dropdown-list-leaf").show();
                    return;
                }
                _self.listContainer.find(".wy-dropdown-list-leaf").each(function(){
                    var searched = true ;
                    var data = $(this).data("data");
                    data.text = data.text ? data.text : $(this).text();
                    data.value = data.value ? data.value : $(this).data("value");
                    if(!filterFn){
                        searched = _self._defaultFilter(key,$(this).data("data"));
                    }else{
                        searched = filterFn(key,$(this).data("data"));
                    }

                    if(!searched){
                        $(this).hide();
                    }else{
                        $(this).html($(this).text().replace(new RegExp(key,"ig"),"<span class='search-key'>"+ key +"</span>"));
                        $(this).show();
                    }
                });
            });

            //隐藏下拉列表
            $(document.body).bind('mousedown', function (e) {
                e.stopPropagation();
                if (_self.pop.is(":hidden")) {
                    return;
                }
                var offset = _self.pop.offset();
                if (e.target === _self.label.get(0) ||
                    e.target === _self.trigger.get(0) ||
                    e.target === _self.content.children().get(0)) {
                    return;
                }

                if (e.pageX < offset.left || e.pageX > offset.left + _self.pop.width()
                    || e.pageY < offset.top || e.pageY > offset.top + _self.pop.height()) {
                    _self.pop.fadeOut(speed);
                    _self.content.removeClass("pop-showing-up").removeClass("pop-showing-down");
                }
            });

            //TODO:源控件属性改变触发

        },
        _defaultFilter:function(key,data){
            if(data.value.indexOf(key) > -1 || data.text.indexOf(key) > -1){
                return true ;
            }
            return false ;
        },
        _showPop: function (speed) {
            var _self = this;
            //如果disable不能触发
            if (this.element.is(":disabled")) {
                return;
            }

            var popBoxHeight = this.pop.outerHeight() - this.pop.find(".wy-dropdown-filter").outerHeight() - 2;
            this.pop.find(".wy-dropdown-list-box").css("height",popBoxHeight);

            var direction = "down";
            var top = _self.content.height() ;
            //如果下方不足以显示pop，则向上方显示
            if(_self.content.offset().top + _self.content.height() + _self.pop.height() > $(window).height()){
                top = -1 - _self.pop.height() ;
                direction = "up";
            }

            var left = -1;

            _self.pop.css("z-index", wyHelper.WY_BASE_INDEX + 50)
                .css("left", left)
                .css("top", top)
                .css("width", _self.content.width());

            if (_self.pop.is(":hidden")) {
                _self.pop.show();
                //_self.pop.fadeIn(speed);
                _self.content.addClass("pop-showing-" + direction);
            } else {
                _self.pop.hide();
                //_self.pop.fadeOut(speed);
                _self.content.removeClass("pop-showing-up").removeClass("pop-showing-down");
            }
        },
        //为列表项添加事件
        _bindSelectItemEvent: function (target) {
            var _self = this, $li = $(target), speed = this.options.effectSpeed;
            //选择下拉项
            $li.click(function (e) {
                _self.pop.find(".wy-dropdown-list-item-selected").removeClass("wy-dropdown-list-item-selected");
                $(this).addClass("wy-dropdown-list-item-selected");
                _self.label.text($(this).text());
                _self.pop.fadeOut(speed);
                _self.content.removeClass("pop-showing-up").removeClass("pop-showing-down");

                //保持与源控件的联系
                _self.element.find("option[selected=selected]").prop("selected",false);
                if($li.data("value")==""){
                    _self.element.find("option[value='']").prop("selected", true);
                }else{
                    _self.element.find("option[value=" + $li.data("value") + "]").prop("selected", true);
                }
                //需要手动触发change事件
                _self._trigger("change", e, {
                    value:$li.data("value"),
                    //是否由UI触发change
                    changeFromUI:_self.changeFromUI
                });
                _self.element.trigger("change");
            });
        },
        //从源控件初始数据列表
        _initListFromSource: function () {
            var _self = this;
            var $children = this.element.children(), $group, $options, $option, $firstOption, optCount = 0, data;
            if ($children) {
                $children.each(function () {
                    data = {
                        value: $(this).val(),
                        text:$(this).text()
                    };
                    if ($(this).is("optgroup")) {
                        $group = _self._addGroup($(this).attr("label"), $(this).attr("value"));
                        $options = $(this).children("option");
                        $options.each(function () {
                            $option = _self._addOption($(this).text(), $(this).val(), $group.children("ul"),data);
                        });
                    } else {
                        $option = _self._addOption($(this).text(), $(this).val(), null,data);
                    }
                });
            }

            //创建完成后再设置滚动条（滚动条位置的计算需要实际内容填充后）
            if (wyHelper) {
                wyHelper.scroll(this.pop.find(".wy-dropdown-list-box"));
                //wyHelper.scroll(this.pop);
                this.pop.hide();
            }
        },
        //为控件下拉列表POP中添加选项
        //text,value :
        //container : 添加选项的目标容器，不传此参数则添加到POP根ul容器下，在有group时，此参数应为group容器（ul）
        //data:对列表项绑定数据，TODO:暂时未用到
        _addOption: function (text, value, container, data) {
            var $container = container || this.listContainer;
            var itemLabel = this.options.itemRenderer ? this.options.itemRenderer(data) : text;//如果有自定义列表项渲染，优先使用
            var $li = $("<li class='wy-dropdown-list-leaf selectable'>" + itemLabel + "</li>");
            $li.data("value", value);
            $li.data("data", data);
            $li.appendTo($container);
            this._bindSelectItemEvent($li);
            //选中默认项
            if (this.element.find("option").length == 1) {
                this._selectDefault();
            }
            return $li;
        },
        //添加group,group默认添加到POP根ul容器下，不支持多级目录（多级目录就应该使用popTree）
        //此方法会返回添加的对象
        _addGroup: function (text, value, data) {
            var itemLabel = this.options.itemRenderer ? this.options.itemRenderer(data) : text;//如果有自定义列表项渲染，优先使用
            var canSelect = this.options.groupCanSelect == true ? "selectable" : "";
            var $group = $("<li class='wy-dropdown-list-group'><div class='wy-dropdown-list-group-header " + canSelect + "'>" + itemLabel + "</div><ul></ul></li>")
                .appendTo(this.listContainer);
            $group.children(".wy-dropdown-list-group-header").data("value", value).data("data", data);
            if (this.options.groupCanSelect) {
                //分组可以被选中时，需要为源控件对象添加option以保持一致
                this.element.append("<option value='" + value + "'>" + text + "</option>");
                this._bindSelectItemEvent($group.children(".wy-dropdown-list-group-header"));
            }
            return $group;
        },
        _selectDefault: function () {
            this.changeFromUI = false;
            this.pop.find(".selectable:first").click();
            this.changeFromUI = true;
        },
        //text,value : require
        //data : optional
        //此方法为公开方法，添加选项时，会为源控件select添加option
        addOption: function (text, value, data, group) {
            this.element.append($("<option value='" + value + "'>" + text + "</option>"));
            this._addOption(text, value, null ,data);
        },
        getSelectedValue: function () {
            return this.element.val();
        },

        getSelectedLabel: function () {
            return this.choices.filter(':selected').text();
        },
        //silent如果为true,则不触发change事件，用于特定场景避免循环触发事件
        selectValue: function (value,silent) {
            var _self = this;
            this.pop.find(".wy-dropdown-list-item-selected").removeClass("wy-dropdown-list-item-selected");
            this.pop.find(".wy-dropdown-list-leaf").each(function () {
                if ($(this).data("value") == value) {
                    $(this).addClass("wy-dropdown-list-item-selected");
                    _self.label.text($(this).text());
                    //保持与源控件的联系
                    _self.element.find("option[selected=selected]").removeAttr("selected");
                    if(value==""){
                        _self.element.find("option[value='']").attr("selected", true);
                    }else{
                        _self.element.find("option[value=" + value + "]").attr("selected", true);
                    }
                    if(!silent){
                        _self.element.trigger("change");
                    }
                }
            });
        },
        selectText: function (text,silent) {
            var _self = this;
            //基于文本的选中方法
            this.choices.each(function () {
                if ($(this).text() == text) {
                    _self.selectValue($(this).val(),silent);
                }
            });
        },
        removeAllOptions: function () {
            this.element.html("");
            this.listContainer.html("");
        },
        reset: function (data) {

        },
        enable: function () {
            this.content.removeClass("disabled");
            this.element.removeAttr("disabled", "disabled");
        },
        disable: function () {
            this.content.addClass("disabled");
            this.element.attr("disabled", "disabled");
        },
        show:function(){
            this.content.show();
        },
        hide:function(){
            this.content.hide();
        }
    });
});
/**
 *  wyGroupButton
 *  按钮组,根据设置为多选或单选
 *  <h3>$(div).wyGroupButton(options)</h3>
 *  @class wyGroupButton
 *  @constructor
 *  @extends  jQuery.widget
 *  @param {Object} options
 *  @param {String} options.groupMode 控件模式，单选(single:默认)或多选(multiple)
 */



//TODO:改造为radiobutton group
$(function(){
    $.widget("wy.wyGroupButton",{
        options:{
            mutiple:false,//单选、多选
            toggle:true, //按钮是否可以点击时toggle状态,只在单选时有效
            default:0,
            theme:""
        },
        _buttons:null,
        _create:function() {
            this.element.addClass("wy-groupbutton").addClass(this.options.theme);
        },
        _init:function(){
            this._super("_init");
            this._buttons = this.element.children("a")  ;
            if(!this._buttons){
                return;
            }
            if(this.options.default>-1){
                var defaultChild = this.element.children("a").eq(this.options.default) ;
                if(defaultChild && this.element.children(".selected").length<1){
                    defaultChild.addClass("selected");
                }
            }
            this._bindEvents();
        },
        _bindEvents:function(){
            var _self = this ;
            this._buttons.click(function(event){
                if($(this).hasClass("disabled")){
                    return ;
                }
                if(!_self.options.mutiple){
                    _self._buttons.not($(this)).removeClass("selected");
                    if(_self.options.toggle){
                        $(this).toggleClass("selected");
                    }else{
                        $(this).addClass("selected");
                    }
                }else{
                    $(this).toggleClass("selected");
                }
                _self._trigger("click",event,{
                    index:_self._buttons.index($(this)),
                    selected:$(this).hasClass("selected"),
                    target:$(this)
                });
            });
        },
        disable:function(){
            this.element.addClass("disabled");
        },
        enable:function(){
            this.element.removeClass("disabled");
        },
        select:function(target,silence){
            if(!this.options.mutiple){
                this._buttons.removeClass("selected");
            }

            if(!isNaN(target)){
                var index = target;
                this._buttons.eq(index).addClass("selected");
                if(silence){
                    return;
                }
                this._trigger("click",null,{
                    index:index,
                    selected:true,
                    target:$(this)
                });
                return;
            }

            if(target instanceof jQuery){
                target.addClass("selected");
            }
        },
        unselect:function(target,silence){

            if(!isNaN(target)) {
                var index = target;
                this._buttons.eq(index).removeClass("selected");
                if (silence) {
                    return;
                }
                this._trigger("click", null, {
                    index: index,
                    selected: false
                });
                return;
            }

            if(target instanceof jQuery){
                target.removeClass("selected");
            }
        }
    });
});
/*
(function(factory){
    if (typeof define === "function" && define.cmd ) {
        define(function(require){
            var $ = require("$");
            require("jqueryui");
            require("./base");
            factory($);
        });
    } else {
        $(function(){
            factory(jQuery);
        });
    }
}(function($){
*/


    $.widget("wy.wyInputtext", $.wy.base,{
        options:{
            //前缀文本(用于显示如:http://)
            //如果为数组,则以下拉方式显示
            preLab:null
            //后缀文本(用于显示单位,如 公里)
            ,sufLab:null
            ,labSeparator:","

            //图标
            //在元素属性上设置时除图标显示的class外
            ,preIcon:null
            ,sufIcon:null

            ,button:null
            ,buttonClass:null
            ,buttonAction:null

            //自动实全时数据源
            ,dataSource:null
            //pop自定义渲染函数
            ,popItemRenender:null
            ,popItemToText:null
            ,theme:""
        },
        parts:{
            base:"wy-inputtext"
            ,origin:"wy-origin" //无任何部件
            ,source:"wy-source" //
            ,preLab:"wy-prelab" //前缀lab
            ,sufLab:"wy-suflab" //后缀lab
            ,preIcon:"wy-preicon" //前icon
            ,sufIcon:"wy-suficon" //后icon
            ,button:"wy-inputtext-button" //按钮
            ,downTrigger:"wy-down-trigger" //下拉触发部件
            ,pop:"wy-inputtext-pop" //自动补全容器
            ,popList:"wy-inputtext-pop-list" //自动补全列表
            ,popListItem:"wy-inputtext-pop-list-item" //自动补全列表项
            ,loading:"wy-inputtext-loading"

            //状态class
            ,popUp:"wy-pop-direction-up"
            ,popDown:"wy-pop-direction-down"
            ,selected:"selected"
        },
        icons:{
            //chevronDown:icoDef.chevronDown
            chevronDown:"fa fa-caret-down"

        },
        isOrigin:null,
        //外层容器
        container:null,
        preLab:null,
        sufLab:null,
        preIcon:null,
        sufIcon:null,
        button:null,
        buttons:null,//多按钮
        popBox:null,
        popCotent:null,
        autoCompleteData:null,
        _create:function(){
            //初始化设置选项
            this._initOptionsFromSource();
            //无自定义部件
            if(this._isOrigin()){
                this.element.addClass(this.parts.base).addClass(this.parts.origin).addClass(this.options.theme);
            }
        },
        _init:function(){


            //无自定义部件
            if(!this._isOrigin()){
                this.element.removeClass(this.parts.base).removeClass(this.parts.origin).removeClass(this.options.theme);

                if(!this.container){
                    //创建外层容器
                    this.container = this.element.wrap("<div class='"+this.parts.base+"'></div>")
                        .addClass(this.parts.source)
                        .closest("." + this.parts.base);
                }

                //创建UI
                this._createUI();
            }
            this._bindEvents();
        },
        //从源元素上获取设置的属性
        _initOptionsFromSource:function(){
            this._getElementOpt("labSeparator");
            this._getElementOpt("preLab");
            this._getElementOpt("sufLab");
            this._getElementOpt("preIcon");
            this._getElementOpt("sufIcon");
            this._getElementOpt("button");
            this._getElementOpt("buttonClass");
            this._getElementOpt("buttonAction");

            this._getElementOpt("preLabs");
            this._getElementOpt("sufLabs");

            if(this.options.preLab){
                var preLabs = this.options.preLab.split(this.options.labSeparator);
                if(preLabs.length>1){
                    this.options.preLab = preLabs;
                }
            }

            if(this.options.sufLab){
                var sufLabs = this.options.sufLab.split(this.options.labSeparator);
                if(sufLabs.length>1){
                    this.options.sufLab = sufLabs;
                }
            }

        },
        //创建UI部件
        _createUI:function(){
            this.container.addClass(this.options.theme);
            //1
            this._createLabel();
            //2
            this._createIcon();
            //3
            this._createButton();
            //4
            this._createPop();
        },
        //1.创建带label的input
        _createLabel:function(){
            if(this.preLab){
                this.preLab.remove();
            }

            if(this.options.preLab){
                //可下拉的lab
                if(this.options.preLab instanceof Array){
                    var preLabHtml =
                        "<span class='" + this.parts.preLab + "'>"
                        + this.options.preLab[0]
                        + "<i class='" + this.parts.downTrigger + " " +  this.icons.chevronDown + "'></i>"
                        + this._createLabelDownlist(this.options.preLab)
                        + "</span>";
                    this.preLab = $(preLabHtml);
                    this.preLab.prependTo(this.container);

                    //TODO:绑定事件
                }else{
                    this.preLab = $("<span class='" + this.parts.preLab + "'>" + this.options.preLab + "</span>").prependTo(this.container);
                }
            }

            if(this.sufLab){
                this.sufLab.remove();
            }

            if(this.options.sufLab){
                //可下拉的lab
                if(this.options.preLab instanceof Array){
                    var sufLabHtml =
                        "<span class='" + this.parts.sufLab + "'>"
                        + this.options.sufLab[0]
                        + "<i class='" + this.parts.downTrigger + " " +  this.icons.chevronDown + "'></i>"
                        + this._createLabelDownlist(this.options.sufLab)
                        + "</span>";
                    this.sufLab = $(sufLabHtml);
                    this.sufLab.appendTo(this.container);
                    //TODO:绑定事件
                }else{
                    this.sufLab = $("<span class='" + this.parts.sufLab + "'>" + this.options.sufLab + "</span>").appendTo(this.container);
                }
            }
        },
        _createLabelDownlist:function(arr){
            var list = "<ul style='display: none;'>"
            for(var i=0;i<arr.length;i++){
                list += "<li>" + arr[i] + "</li>"
            }
            list += "</ul>"
            return list ;
        },
        //2.创建带图标的input
        _createIcon:function(){

            if(this.preIcon){
                this.preIcon.remove();
            }
            if(this.options.preIcon){
                this.preIcon = $("<span class='" + this.parts.preIcon + "'><i class='" + this.options.preIcon + "'></i></span>").prependTo(this.container);
            }

            if(this.sufIcon){
                this.sufIcon.remove();
            }

            if(this.options.sufIcon){
                this.sufIcon = $("<span class='" + this.parts.sufIcon + "'><i class='" + this.options.sufIcon + "'></i></span>").appendTo(this.container);
            }
        },
        //3.创建按钮
        _createButton:function(){
            if(!this.options.button){
                return;
            }

            if(this.buttons){
                this.buttons.remove();
            }
            if(this.button){
                this.button.remove();
            }

            if(this.options.button instanceof Array){
                //TODO:去除span以减少html内容大小
                this.buttons = [];
                var _clickHanlder = null;
                for(var i=0;i<this.options.button.length;i++){
                    var _buttonClass = this.options.buttonClass instanceof Array ? this.options.buttonClass[i] : this.options.buttonClass;
                    var button = $("<span class='" + this.parts.button + " " + _buttonClass + "'>" + this.options.button[i] + "</span>").appendTo(this.container);
                    if(this.options.buttonAction){
                        _clickHanlder = this.options.buttonAction[i] ;
                        button.attr("action",_clickHanlder);
                        button.click(function(){
                            if(typeof($(this).attr("action")) === "string"){
                                eval($(this).attr("action")).apply();
                            }
                        });
                    }
                    this.buttons.push(button);
                }
            }else{
                this.button = $("<span class='" + this.parts.button + " " + this.options.buttonClass + "'>" + this.options.button + "</span>").appendTo(this.container);
                if(this.options.buttonAction){
                    _clickHanlder = this.options.buttonAction ;
                    this.button.click(function(){
                        if(typeof(_clickHanlder) === "string"){
                            eval(_clickHanlder).apply();
                        }
                    });
                }

            }
        },
        //创建自动补全列表容器
        _createPop:function(){
            if(this.popBox){
                this.popBox.remove();
            }
            if(this.options.dataSource && !this.popBox){
                this.popBox = $("<div style='display: none;'></div>");
                this.popBox.addClass(this.parts.pop);
                this.popBox.appendTo(this.container);
                this.popBox.css("min-width",this.element.outerWidth()).css("left",this.element.position().left);
                this.popContent = wyHelper.scroll(this.popBox);
            }
        },
        _showPop:function(){
            var _self = this;
            //如果disable不能触发
            if (this.element.is(":disabled")) {
                return;
            }
            this.container.removeClass(this.parts.popUp).removeClass(this.parts.popDown);
            var direction = "down";
            //如果下方不足以显示pop，则向上方显示

            if(_self.container.offset().top + _self.container.height() + _self.popBox.height() > $(window).height() &&
                _self.container.offset().top - _self.popBox.height() > 0 ){
                direction = "up";
            }

            _self.popBox.show();
            _self.container.addClass("wy-pop-direction-" + direction);
        },
        //创建自动补全列表
        _createPopList:function(data){
            var _self = this ;
            var key = this.element.val() ;
            this.popContent.html("");
            if(!data || data.length < 1){
                this.popBox.hide();
                return;
            }
            var $ul = $("<ul class='" + this.parts.popList + "'></ul>").appendTo(this.popContent);
            var $li;

            //渲染后的显示列表文本
            var renderText;

            for(var i=0;i<data.length;i++){
                if(this.options.popItemRenender){
                    renderText = this.options.popItemRenender(key,data[i]);
                }else{
                    renderText = "<i class='" + icoDef.search + "' style='margin-right: 4px;'></i>"
                        + (data[i]+"").replace(key,"<span class='filter-key'>"+ key +"</span>");
                }
                $li = $("<li class='" + this.parts.popListItem + "'>" + renderText +"</li>");

                $li.data("data",data[i]);
                $ul.append($li);
            }
            $ul.find("li").click(function(){
                //获取文本
                _self.element.val(_self._getItemText($(this)));
                _self.popBox.hide();
            });
            this._showPop();
        },
        _getItemText:function($item){
            //获取文本
            var _data = $item.data("data");
            //
            this.element.data("data",_data);

            if(this.options.popItemToText){
                return this.options.popItemToText(_data);
            }

            return _data ;
        },
        //刷新自动补全数据源
        _refreshDataSource:function(key){
            var _self = this ;
            if(jQuery.trim(key)===""){
                if(this.popBox){
                    this.popBox.hide();
                    this.container.removeClass(this.parts.popUp).removeClass(this.parts.popDown);
                }
                return;
            }
            if(!this.popBox){
                return ;
            }
            if(this.options.dataSource instanceof Function){
                var fn = this.options.dataSource ;
                fn(key,function(data){
                    _self._createPopList(data);
                });
            }else{
                var arr = [] ;
                for(var i=0;i<this.options.dataSource.length;i++){
                    if((this.options.dataSource[i]+"").indexOf(key) > -1){
                        arr.push(this.options.dataSource[i])
                    }
                }
                this._createPopList(arr);
            }
        },
        //控件事件绑定
        _bindEvents:function(){
            var _self = this ;

            /**================ 焦点事件 ==========================*/
            //焦点事件
            if(this.container){
                this.element.unbind("focus");
                this.element.focus(function(){
                    _self.container.addClass("focus");
                });
                this.element.unbind("blur");
                this.element.blur(function(){
                    _self.container.removeClass("focus");
                });
            }

            /**================= 文本内容改变事件 =========================*/
            //文本内容改变事件
            this.element.unbind("input propertychange");
            this.element.bind("input propertychange",function(){
                //触发自定义事件
                _self._trigger("inputChange",null,{
                    value:_self.element.val()
                });
                //如果有自动补全则显示pop
                _self._refreshDataSource(_self.element.val());
            });

            /**=================== 自动补全键盘事件 =======================*/
            //键盘事件
            this.element.unbind("keydown");
            if(this.options.dataSource){
                this._bindPopKeyEvent();
            }

            /**=================== 隐藏下拉列表自动补全 =======================*/
            //隐藏下拉列表
            $(document.body).bind('mousedown', function (e) {
                e.stopPropagation();
                if (!_self.popBox || _self.popBox.is(":hidden")) {
                    return;
                }
                if (e.target === _self.element.get(0)){
                    return;
                }
                if (!wyHelper.isMouseIn(_self.popBox,e)) {
                    _self.popBox.hide();
                    _self.container.removeClass(_self.parts.popUp).removeClass(_self.parts.popDown);
                }
            });

        },
        //自动补全键盘事件
        _bindPopKeyEvent:function(){
            var _self = this ;

            this.element.keydown(function(e){
                //选中的列表选择器
                var selectorSelected = ".wy-inputtext-pop-list-item[class~=selected]";

                //down / up
                if(e.keyCode==40 || e.keyCode==38){
                    var selectorItem = ".wy-inputtext-pop-list-item";
                    //选项数
                    var iLen = _self.popBox.find(selectorItem).length;
                    //选中选项
                    var si = _self.popBox.find(selectorSelected) ;
                    //选中的索引
                    var sInx = _self.popBox.find(selectorItem).index(si);

                    if(iLen < 1){
                        return;
                    }

                    if(_self.popBox.is(":hidden")){
                        _self._showPop();
                        return;
                    }
                    si.removeClass(_self.parts.selected);
                    if(e.keyCode==40){
                        sInx ++;
                        if(sInx >= iLen){
                            sInx = 0;
                        }
                    }else{
                        if(sInx < 0){
                            sInx = iLen;
                        }
                        sInx --;
                    }
                    var nowItem = _self.popBox.find(".wy-inputtext-pop-list-item:eq(" + sInx + ")") ;
                    nowItem.addClass("selected");
                    //获取文本
                    _self.element.val(_self._getItemText(nowItem));

                    if(sInx==0){
                        _self.popBox.mCustomScrollbar("scrollTo",0);
                        return;
                    }

                    //选中选项
                    si = _self.popBox.find(selectorSelected) ;
                    //选中的索引
                    sInx = _self.popBox.find(selectorItem).index(si);
                    if(sInx==iLen-1){
                        _self.popBox.mCustomScrollbar("scrollTo",_self.popContent.outerHeight());
                        return;
                    }

                    if(e.keyCode==40){
                        //如果当前选择项为视口可见的最后一个,向下滚动一条
                        //前当选中top - 内部容top > 容器height - 当前选中height
                        if(nowItem.position().top + _self.popContent.position().top > _self.popBox.height() - nowItem.outerHeight()){
                            _self.popBox.mCustomScrollbar("scrollTo",nowItem.position().top - _self.popBox.height() + nowItem.outerHeight() + 1);
                        }
                    }

                    if(e.keyCode==38){
                        //如果当前选择项为视口可见第一条,向上滚动一条
                        //前当选中top - 内部容器top < 0
                        if(nowItem.position().top + _self.popContent.position().top < 0){
                            //滚动条当前选中top
                            _self.popBox.mCustomScrollbar("scrollTo",nowItem.position().top);
                        }
                    }
                    return;
                }

                //enter
                if(e.keyCode==13){
                    _self.popBox.find(selectorSelected).click();
                    return;
                }

                //esc
                if(e.keyCode==27){
                    _self.popBox.hide();
                }
            });
        },
        //是否有添加自定部件设置
        _isOrigin:function(){
            if(this.options.preLab || this.options.sufLab){
                return false;
            }
            if(this.options.preIcon || this.options.sufIcon){
                return false;
            }
            if(this.options.button){
                return false;
            }
            if(this.options.dataSource){
                return false;
            }
            return true;
        },
        disable:function(){
            this.element.prop("disabled",true);
            this.container.addClass("disabled");
        },
        enable:function(){
            this.element.prop("disabled",false);
            this.container.removeClass("disabled");
        }

    });



/*

}));
    */
$(function(){
    $.widget("wy.wyListbox",{
        options:{
            groupCanSelect:false,//分组标签是否可以被选择
            itemRenderer: null, //列表渲染函数（fn）,参数为当前列表项的数据(data,index)
            dataSource:null,//列表数据源，如果设置则从数据源初始列表项，源控件中的列表项同步为数据源中的数据项
            multiple:true,//是否可以多选
            vScroll:true,//y滚动条
            hScroll:false,//x滚动条
            filter:true,//是否有过滤框
            minWidth:210,
            minHeight:250,
            searchPlaceholder:"inupt search text",//搜索输入框提示语
            theme:"",

            ignoreCase:true,//过滤时是否忽略大小写
            localFilter:null, //自定义过滤函数(本地过滤)
            ajaxFilter:null,//ajax远程数据过滤，格式：fn(key,callback(datasource))

            useGroup:false,//当使用数据源的时候指定类型是否group方式显示数据

            textProperty:"text",//通过数据源设置列表项时读取数据的属性名
            valueProperty:"value",
            chilrenProperty:"children"
        },
        //
        _width:0,
        _height:0,
        _content:null,//最外围容器部件
        _listContainer:null, //选项容器部件
        _choices:null, //源选项列表
        _filter:null,//过滤选项部件
        _value:null,
        _create:function(){
            this._createUI();
            this._bindEvents();
        },
        _init:function(){
            //清除容器
            this._listContainer.html("");
            if(this.options.dataSource){
                //从数据源初始化
                this._initListFromData();
            }else{
                //从控件选项初始化
                this._initListFromSource();
            }
        },
        _createUI:function(){
            if(this.element.hasClass("wy-listbox")){
                this.element.removeClass("wy-listbox");
            }

            this._width = this.element.outerWidth();
            this._height = this.element.outerHeight();
            this._choices = this.element.find("option");

            this.element.wrap("<div class='wy-listbox "+ this.options.theme +"'><span class='wy-source wy-listbox-source'></span></div>");
            this._content = this.element.closest(".wy-listbox");

            this._content.attr('style',this.element.attr('style'));

            this._content.css({
                minWidth:this.options.minWidth,
                minHeight:this.options.minHeight
            });

            //过滤选项输入框
            var filterHtml = this.options.filter ? "<div class='wy-listbox-filter'><i class='fa fa-search'></i><input placeholder='"+this.options.searchPlaceholder+"'/></div>" : "";
            if(this.options.filter){
                this._content.append(filterHtml);
                this._filter = this._content.find(".wy-listbox-filter>input");
            }

            //列表容器
            var listContainerHtml = "<div class='wy-listbox-content'></div>";
            this._listContainer = $(listContainerHtml).appendTo(this._content);
            if(this.options.vScroll){
                this._listContainer = wyHelper.scroll(this._listContainer);
            }
        },
        __filter:function(data,key){
            key = jQuery.trim(key);
            if(key===""){
                return true;
            }

            for(var k in data){
                if((data[k]+"").indexOf(key)>-1){
                    return true ;
                }
            }
            return false ;
        },
        _bindEvents:function(){
            var _self = this;
            this._filter.bind("input propertyChange",function(e){

                var data,key = _self._filter.val();;

                if(_self._value==null){
                    _self._value = key ;
                    _self._trigger("filterChange",e,key);
                }else if(_self._value != key){
                    _self._value = key ;
                    _self._trigger("filterChange",e,key);
                }else{
                    return;
                }

                //如果设定了ajax方式过滤远程数据，则本地过滤失效
                if(_self.options.ajaxFilter){
                    _self.options.ajaxFilter(key,function(data){
                        _self.setDataSource(data,_self.options.useGroup);
                    });
                    return;
                }

                var fn = _self.options.localFilter ? _self.options.localFilter : _self.__filter ;
                _self._listContainer.find(".selectable").each(function(){
                    data = $(this).data("data") ;
                    key = _self._filter.val();

                    if(_self.options.ignoreCase){
                        for(var k in data){
                            if(data[k] && data[k] instanceof String){
                                data[k] = data[k].toUpperCase();
                            }
                        }
                        key = key.toUpperCase();
                    }

                    $(this).html($(this).text());
                    if(!fn(data,key)){
                        $(this).hide();
                    }else{
                        if($(this).text().indexOf(key)>-1){
                            $(this).html($(this).text().replace(key,"<span class='wy-filter-key'>"+key+"</span>"));
                        }
                        $(this).show();
                    }
                });
            });
        },
        //从源控件初始列表项
        _initListFromSource:function(){
            var _self = this ;
            var $group = this.element.children("optgroup"),$tempGroup,data ;
            var $opts,$tempOpt;
            //有分组
            if($group && $group.length>0){
                var gindex = 0 ;
                $group.each(function(){
                    data={
                        text:$(this).attr("label"),
                        value:$(this).attr("value")
                    };
                    $tempGroup = _self._addGroup(data.text,data.value,data,gindex++);
                    $opts = $(this).children("option");
                    var index = 0 ;
                    $opts.each(function(){
                        data={
                            text:$(this).html(),
                            value:$(this).val()
                        };
                        _self._addOption(data.text,data.value,$tempGroup,data,index++);
                    });
                });
            }else{
                $opts = this.element.children("option");
                var index = 0 ;
                $opts.each(function(){
                    data={
                        text:$(this).html(),
                        value:$(this).val()
                    };
                    _self._addOption(data.text,data.value,null,data,index++);
                });
            }
        },
        _initListFromData:function(){
            if(this.options.dataSource){
                this._setDataSource(this.options.dataSource,this.options.useGroup);
            }
        },
        /**
         * data:要添加的数据项
         * $container:要添加的父容器，用于用组时传入分组容器，不传此参数则添加到_listContainer下
         * */
        _addOption:function(text,value,$container,data,index){
            var container = $container || this._listContainer ;
            var itemLabel = this.options.itemRenderer ? this.options.itemRenderer(data,index) : text ;
            var $li = $("<li class='wy-listbox-leaf selectable'>" + itemLabel + "</li>").data("value",value).data("data",data).appendTo(container);
            this._bindItemEvent($li);
            return $li ;
        },
        _addGroup:function(text,value,data){
            var itemLabel = this.options.itemRenderer ? this.options.itemRenderer(data) : text;//如果有自定义列表项渲染，优先使用
            var selectable = this.options.groupCanSelect == true ? "selectable" : "unselectable";
            var $group = $("<li class='wy-listbox-group'><div class='wy-listbox-group-header " + selectable + "'>" + itemLabel + "</div><ul></ul></li>")
                .appendTo(this._listContainer);
            $group.children(".wy-listbox-group-header").data("value",value).data("data", data);
            if (this.options.groupCanSelect) {
                //分组可以被选中时，需要为源控件对象添加option以保持一致
                this.element.append("<option value='" + value + "'>" + text + "</option>");
                this._bindItemEvent($group.children(".wy-listbox-group-header"));
            }
            return $group.children("ul");
        },
        //列表项绑定事件
        _bindItemEvent:function($item){
            var _self = this;
            var itemData ;
            $item.click(function(event){
                if(!_self.options.multiple){
                    _self._content.find(".selected").removeClass("selected");
                }
                $(this).toggleClass("selected");
                itemData = $(this).data("data");
                itemData.selected = $(this).hasClass("selected");
                _self._trigger("itemSelected",event,itemData);
            });
        },
        //通过数据源的方式设置
        _setDataSource:function(list,byGroup){
            var tempData,tempGroup,$tempGroup,chilrenOpts;
            if(!byGroup){
                for(var i=0;i<list.length;i++){
                    tempData = list[i];
                    this._addOption(tempData[this.options.textProperty],tempData[this.options.valueProperty],null,tempData,i);
                }
            }else{
                for(var i=0;i<list.length;i++){
                    tempGroup = list[i];
                    $tempGroup = this._addGroup(tempGroup[this.options.textProperty],tempGroup[this.options.valueProperty],tempGroup,i);
                    chilrenOpts = tempGroup[this.options.chilrenProperty];
                    if(chilrenOpts){
                        for(var j=0;j<chilrenOpts.length;j++){
                            tempData = chilrenOpts[j];
                            this._addOption(tempData[this.options.textProperty],tempData[this.options.valueProperty],$tempGroup,tempData,j);
                        }
                    }
                }
            }
        },
        setDataSource:function(data,byGroup){
            this._listContainer.html("");
            this._setDataSource(data,byGroup);
        },
        getSelectedValue:function(){
            //单选
            if(!this.options.multiple){
                return this._content.find(".selected").data("value");
            }
            //多选
            var arr=[];
            this._content.find(".selected").each(function(){
                if($(this).data("value")){
                    arr.push($(this).data("value"));
                }
            });
            return arr ;
        },
        getSelectedData:function(){
            //单选
            if(!this.options.multiple){
                return this._content.find(".selected").data("data");
            }
            //多选
            var arr=[];
            this._content.find(".selected").each(function(){
                if($(this).data("data")){
                    arr.push($(this).data("data"));
                }
            });
            return arr ;
        },
        unselect:function(){
            this._content.find(".selected").removeClass("selected");
        }
    });
});
//切换grid/list视图容器控件

$(function(){
    $.widget("wy.wyListview",{
        options:{
            gridWidth:150, //如果不设置，则以css描述为准
            gridHeight:150,
            listHeight:50,
            gridRender:null,
            listRender:null,
            dataSource:[],
            vScroll:true,
            defaultView:"grid", //默认视图
            yInterval:0, //垂直间隔，只有在grid视图下有效，list时只影响边距
            xInterval:0, //水平间隔，只有在grid视图下有效，list时只影响边距
            intervalAverage:true //是否均匀分布，只有在grid视图下有效
        },
        _viewType:"",
        _content:null, //记录活动容器
        _create:function(){
            this._content = this.element.addClass("wy-listview");//.append("<div class='wy-listview-content'></div>")
            if(this.options.vScroll){
                this._content = wyHelper.scroll(this.element);
            }
            this._viewType = this.options.defaultView ;
        },
        _init:function(){
            this._content.html("");
            if(this.options.dataSource){
                this._createItemWithSource(this.options.dataSource);
            }
            this._bindEvents();
            this._sortable();
        },
        //添加sortable
        _sortable:function(){
        },
        //从数据源中创建所有视图子项
        _createItemWithSource:function(datasource){
            for(var i=0;i<datasource.length;i++){
                this._addItem(datasource[i],i);
            }
            if(this._viewType=="grid"){
                this._adjustGridPosition();
            }else{
                this._adjustListPosition();
            }

        },
        //1.创建视图================ begin
        _addItem:function(data,index){
            var item = this._createItem(data);
            this._content.append($(item).data("data",data).addClass("wy-listview-item"));
        },
        _createItem:function(data){
            if(this._viewType=="grid"){
                return "<div class='grid-item'>" + this._createGridItem(data) + "</div>";
            }
            if(this._viewType=="list"){
                return "<div class='list-item'>" + this._createListItem(data) + "</div>";
            }
        },
        _createGridItem:function(data){
            if(this.options.gridRender){
                return this.options.gridRender(data);
            }
        },
        _createListItem:function(data){
            if(this.options.listRender){
                return this.options.listRender(data);
            }
        },
        //1.创建视图================ end

        //计算容器及子项位置
        _adjustGridPosition:function(){
            var griditem = $("<div class='grid-item'></div>").appendTo(this._content);
            var itemHeight = griditem ? griditem.outerHeight() : 0 ;
            var itemWidth = griditem ? griditem.outerWidth() : 0 ;
            //需要添加到页面才能获取大小
            griditem.remove();
            var itemCount = this._content.children(".wy-listview-item").length;

            //计算列数
            var colCount = Math.floor(this._content.innerWidth() / (itemWidth + this.options.xInterval));//每行放置数量
            var rowCount = Math.floor(itemCount / colCount) + (itemCount % colCount > 0 ? 1 : 0 );//一共多少行

            //将分列后剩余空间平均分布
            var tempInterval = 0 ;
            if(this.options.intervalAverage){
                tempInterval = (this._content.innerWidth() - (colCount * itemWidth + colCount * this.options.xInterval + this.options.xInterval)) / (colCount+1);
            }

            //调整容器大小
            this._content.css({
                height:rowCount * (itemHeight + this.options.yInterval + tempInterval) + (this.options.yInterval + tempInterval)
            });

            //调整单个子项位置
            var _self = this ;
            var index = 0 ;
            this._content.children().each(function(){
                $(this).removeClass("list-item").addClass("grid-item").css({
                    left : (_self.options.xInterval + tempInterval) + (index % colCount) * (itemWidth + _self.options.xInterval + tempInterval),
                    top : (_self.options.yInterval + tempInterval) * Math.floor(index / colCount + 1)  + (itemHeight *  Math.floor(index / colCount))
                });
                index++;
            });
        },
        _adjustListPosition:function(){
            var listitem = $("<div class='list-item'></div>").appendTo(this._content);
            var itemHeight = listitem ? listitem.outerHeight() : 0 ;
            listitem.remove();
            var itemCount = this._content.children(".wy-listview-item").length;
            this._content.children(".list-item").addClass("grid-item").removeClass("list-item");

            //调整容器大小
            this._content.css({
                height:itemHeight * itemCount + 2 * this.options.yInterval
            });

            //调整单个子项位置
            var _self = this ;
            var index = 0 ;
            this._content.children().each(function(){
                $(this).removeClass("grid-item").addClass("list-item").css({
                    left : _self.options.xInterval,
                    right:_self.options.xInterval,
                    top : _self.options.yInterval + (index * itemHeight)
                });
                index++;
            });
        },
        _adjustPosition:function(){
            switch (this._viewType){
                case "list" :{
                    this._adjustListPosition();
                    break;
                }
                case "grid" :{
                    this._adjustGridPosition();
                    break;
                }
            }
        },
        _bindEvents:function(){
            var _self = this ;
            this.element.resize(function(){
                if(_self._viewType=="grid"){
                    _self._adjustGridPosition();
                    return;
                }
                if(_self._viewType=="list"){
                    _self._adjustListPosition();
                }
            });
        },
        setDataSource:function(datasource){
            this.options.dataSource = datasource;
        },
        toListView:function(){
            this._viewType = "list";
            var _self = this;
            this._content.find(".wy-listview-item").each(function(){
                $(this).html(_self._createListItem($(this).data("data")));
            });
            this._adjustListPosition();
        },
        toGridView:function(){
            this._viewType = "grid";
            var _self = this;
            this._content.find(".wy-listview-item").each(function(){
                $(this).html(_self._createGridItem($(this).data("data")));
            });
            this._adjustGridPosition();
        },
        toggleView:function(){
            if(this._viewType=="list"){
                this.toGridView();
                return;
            }
            if(this._viewType=="grid"){
                this.toListView();
            }
        },
        //移除指定索引的item
        remove:function(index){
            this._content.children(".wy-listview-item").eq(index).remove();
            this._adjustPosition();
        },
        //移除指定item
        removeItem:function($item){
            if($item){
                $item.remove();
                this._adjustPosition();
            }
        },
        refresh:function(){
            this._adjustPosition();
        }
    });
});


//需要支持css3的浏览器


$(function(){
    $.widget("wy.wyLoader",{
        parts:{
            name:"wy-loader",
            ring:"wy-loader-ring"
        },
        options:{
            modal:true ,//是否在显示loading时禁用动作
            position:"center", //loading出现的位置，可选
            awaysOnTop:false,//在iframe环境中
            type:"ring",//ring:圆环

            size:18,//loading尺寸
            ringWidth:3,//圆环线宽度,此设置只有在type:ring时有效

            parent:null //如果不设，则为全局
        },
        _parentContainer:null,
        _content:null,
        _initOptions:{

        },
        _init:function(){

        },
        _create:function(){
            this.element.addClass(this.parts.name);
            //this.element.hide();
            //获取父容器
            if(this.options.parent){
                this._parentContainer = this.options.parent ;
            }else if(this.options.awaysOnTop){
                this._parentContainer = wyHelper.getTopBody() ;
            }else{
                this._parentContainer = $("body");
            }

            this._createUI();
        },
        _createUI:function(){
            switch (this.options.type){
                case "ring" :{
                    this._createRing();
                    break;
                }
            }
        },
        _createRing:function(){
            this.element.addClass(this.parts.ring);
            if(this.options.size){
                this.element.css({
                    width:this.options.size,
                    height:this.options.size
                });

                if(this.options.type === "ring"){
                    this.element.find(":before").css({
                        "border-radius":this.options.ringWidth,
                    });
                    this.element.find(":after").css({
                        "border-radius":this.options.ringWidth
                    });
                }
            }

            if(this.options.ringWidth && this.options.type === "ring"){
                this.element.find(":before").css({
                    "border-width":this.options.ringWidth,
                });
                this.element.find(":after").css({
                    "border-width":this.options.ringWidth
                });
            }
        },
        _destroy:function(){
            this._super("_destroy");
        },
        show:function(){
            this.element.show();
        },
        hide:function(){
            this.element.hide();
        }
    });
});


$.wyLoader = {

    show:function($parent){

    }

};
/**
 * Created by hexb on 15/5/6.
 */

$(function(){
    $.widget("wy.wyNotification",{
        options:{
            autoDie:true,//是否自动消失
            life:100000,//自动消失延迟时间,单位ms
            yPostion:"top", //通知显示y方向,可选值:top,bottom TODO:
            levelIcon:{
                normal:"zmdi zmdi-comment-outline",
                info:"zmdi zmdi-info-outline",
                warn:"zmdi zmdi-alert-triangle",
                error:"zmdi zmdi-notifications-active"
            } //为不同的通知级别定义图标class
        },
        //临时变量，存储控件内部件快捷方式
        preNotifiTime:0,//上一个通知的发出时间，
        _create:function(){
            var body = $("body");//wyHelper.getTopBody();
            this.element.addClass("wy-notification").appendTo(body).css({
                position:"fixed",
                "z-index":wyHelper.WY_BASE_INDEX + 50
            });
        },
        /**
         * message对象{
     *  detail
     *  level
     * }
         * */
        _renderNotification:function(message){
            var style = "none";
            if(message.level){
                style = message.level ;
            }
            var icons = "";
            if(message.level){
                icons = this.options.levelIcon[message.level] ;
            }
            if(message.life){
                this.options.life = message.life ;
            }
            if(!message.effect){
                message.effect = "bounceIn";
            }

            var msgHtml = "<div style='z-index:"+ (wyHelper.WY_BASE_INDEX + 50 )+"' class='animated "+ message.effect +" wy-notification-item wy-notification-" + style + "'>" ;
            msgHtml += "<div class='wy-notification-icon'><i class='" ;
            msgHtml += icons;
            msgHtml += "'></i></div>" ;

            msgHtml += "<div class='wy-notification-content'>"

            msgHtml += "<div>" + (message.detail ? message.detail : "") + "</div>";

            msgHtml += "</div>";

            msgHtml += "<div class='wy-ui-colse'><i class='zmdi zmdi-close'></i></div>"

            msgHtml += "</div>" ;

            var message = $(msgHtml);
            this._bindMessageEvents(message);
            var now = new Date().getTime() ;
            var interval = now - this.preNotifiTime;
            message.appendTo(this.element).fadeIn("normal");
        },
        _bindMessageEvents:function(message){
            var _self = this ;
            message.find(".wy-ui-colse>i").click(function(){
                _self._removeNotification(message);
            });

            if(this.options.autoDie){
                _self._autoDieTimeout(message);
            }
        },
        _removeNotification:function(message){
            var autoDie = this.options.autoDie;
            message.remove();
            if(autoDie){
                window.clearTimeout(message.data('timeout'));
            }
        },
        _autoDieTimeout:function(message){
            var _self = this;
            var timeout = window.setTimeout(function() {
                _self._removeNotification(message);
            }, this.options.life);
            message.data('timeout', timeout);
        },
        addNotification:function(detail,level,life,effect){
            if(!life){
                life = this.options.life;
            }
            this._renderNotification({
                detail:detail,
                level:level,
                life:life,
                effect:effect
            });
        },
        addNotificationObj:function(message){
            this._renderNotification(message);
        },
        addaddNotifications:function(messages){

        }
    })
});

/**
 * Created by hexb on 15/2/2.
 */
/**
 * 前端分页控件
 * 依赖于wyButton,wyDropdown
 * */

$(function () {
    $.widget("wy.wyPaginator", {
        options: {
            spanAlign: "center", //可选：left,rigth,center
            pageSize:20,//分页大小
            nowPage:1,
            recordTotal:1,
            pageSizeList:[10,20,30,40,50],//分页大小选择列表
            pageGotoRange:10,//显示在转到页时以前页为基准的范围，如果为0则全部显示

            pageLinksNum:5,//快速页面连接数最大数量
            height: "auto",
            width: "100%",
            textTemplate:"共<span>{RecordTotal}</span>条记录,共<span>{PageTotal}</span>页,每页<span>{PageSize}</span>条,当前第<span>{NowPage}</span>页",
            controlTemplate:"{PageInfo}{FirstPage}{PreviousPage}{PageLinks}{NextPage}{LastPage}{GoToPage}{pageSize}",
            spanStyle:"iconOnly", //按钮显示方式iconOnly只显示图标，textOnly只显示文字,both二者均显示
            theme:""

        },
        //私用变量
        _NowPage:1,
        _RecordTotal:0,
        _PageTotal:1,
        _PageSize:1,
        _changeTarget:null,
        _gotoSelect:null,
        _pageSizeSelect:null,
        _create:function(){
            //this._updateParams();
            if(!this.element.hasClass("wy-paginator")){
                this.element.addClass("wy-paginator");
            }
            this.element.addClass(this.options.theme);
            this._createUI();
            this._initEvent();
        },
        _init:function(){
            //在_create调用后调用
            this._updateParams();
            this._setPage(this.options.nowPage);
        },
        _createUI:function(){
            var pageSizeList = "";
            if(this.options.pageSizeList){
                for(var i=0;i<this.options.pageSizeList.length;i++){
                    pageSizeList += "<option value='"+this.options.pageSizeList[i]+"'>"+this.options.pageSizeList[i]+"</option>"
                }
            }

            var PageInfo = "<div class='wy-paginator-pageinfo'></div>";
            var FirstPage = "<div class='wy-paginator-firstpage wy-paginator-pagespan'><a class='iconOnly'><i class='fa fa-angle-double-left'></i></a><a class='textOnly'>首页</a><a class='both'><i class='fa fa-step-backward'></i>首页</a></div>";
            var PreviousPage = "<div class='wy-paginator-previouspage wy-paginator-pagespan'><a class='iconOnly'><i class='fa fa-angle-left'></i></a><a class='textOnly'>上一页</a><a class='both'><i class='fa fa-backward'></i>上一页</a></div>";
            var PageLinks = "<div class='wy-paginator-pagelinks wy-paginator-pagelinks"+ this.options.spanStyle +"'></div>";
            var NextPage = "<div class='wy-paginator-nextpage wy-paginator-pagespan'><a class='iconOnly'><i class='fa fa-angle-right'></i></a><a class='textOnly'>下一页</a><a class='both'><i class='fa fa-forward'></i>下一页</a></div>";
            var LastPage = "<div class='wy-paginator-lastpage wy-paginator-pagespan'><a class='iconOnly'><i class='fa fa-angle-double-right'></i></a><a class='textOnly'>末页</a><a class='both'><i class='fa fa-step-forward'></i>末页</a></div>";
            var GoToPage = "<div class='wy-paginator-gotopage'><span class='text'>转到</span><select style='min-width: 40px;'></select><span class='text'>页</span></div>";
            var pageSize = "<div class='wy-paginator-pagesizelist'><span class='text'>每页显示</span><select>"+pageSizeList+"</select></div>" ;


            var uiHtml = this.options.controlTemplate
                .replace("{PageInfo}",PageInfo)
                .replace("{FirstPage}",FirstPage)
                .replace("{PreviousPage}",PreviousPage)
                .replace("{PageLinks}",PageLinks)
                .replace("{NextPage}",NextPage)
                .replace("{LastPage}",LastPage)
                .replace("{GoToPage}",GoToPage)
                .replace("{pageSize}",pageSize);
            this.element.html(uiHtml);

            //初始化goto下拉列表
            this._gotoSelect = this.element.find(".wy-paginator-gotopage>select") ;
            if( this._gotoSelect){
                this._gotoSelect.wyDropdown({
                    theme:"simple"
                });
            }
            this._pageSizeSelect = this.element.find(".wy-paginator-pagesizelist>select") ;

            if( this._pageSizeSelect){
                this._pageSizeSelect.wyDropdown({
                    theme:"simple"
                });
                if(this.options.pageSize){
                    this._pageSizeSelect.wyDropdown("selectValue",this.options.pageSize,true);
                }
            }

            //创建UI完成
            this.element.find(".wy-paginator-pagespan a").hide();
            this.element.find("." + this.options.spanStyle).show();
        },
        //刷新UI,根据当前页面情况刷新
        _updateUI:function(){
            this._updatePageInfo();
            this._updatePageNaviButton();
            this._updatePageLinks();
            this._updatePageGoToList();
        },
        //更新分页信息
        _updatePageInfo:function(){
            var $pageLinks = this.element.children(".wy-paginator-pageinfo") ;
            if($pageLinks){
                this.element.children(".wy-paginator-pageinfo").html(this.options.textTemplate
                    .replace("{RecordTotal}",this._RecordTotal+"")
                    .replace("{PageTotal}",this._PageTotal+"")
                    .replace("{PageSize}",this.options.pageSize+"")
                    .replace("{NowPage}",this._NowPage+""));
            }
        },
        //更新分页导航按钮
        _updatePageNaviButton:function(){
            var $firstpage = this.element.find(".wy-paginator-firstpage");
            var $previouspage = this.element.find(".wy-paginator-previouspage");
            var $nextpage = this.element.find(".wy-paginator-nextpage");
            var $lastpage = this.element.find(".wy-paginator-lastpage");

            //首页
            if($firstpage){
                if(this._NowPage<=1){
                    $firstpage.children("a").attr("disabled","disabled").addClass("disabled");
                }else{
                    $firstpage.children("a").removeAttr("disabled").removeClass("disabled");
                }
            }

            //上一页
            if($previouspage){
                if(this._NowPage<=1){
                    $previouspage.children("a").attr("disabled","disabled").addClass("disabled");;
                }else{
                    $previouspage.children("a").removeAttr("disabled").removeClass("disabled");;
                }
            }

            //下一页
            if($nextpage){
                if(this._NowPage>=this._PageTotal){
                    $nextpage.children("a").attr("disabled","disabled").addClass("disabled");;
                }else{
                    $nextpage.children("a").removeAttr("disabled").removeClass("disabled");;
                }
            }

            //末页
            if($lastpage){
                if(this._NowPage>=this._PageTotal){
                    $lastpage.children("a").attr("disabled","disabled").addClass("disabled");;
                }else{
                    $lastpage.children("a").removeAttr("disabled").removeClass("disabled");;
                }
            }
        },
        //更新分页快速页面链接
        _updatePageLinks:function(){
            var $pageLinks = this.element.find(".wy-paginator-pagelinks") ;
            if(!$pageLinks){
                return ;
            }

            var min = parseInt(this._NowPage) - parseInt(this.options.pageLinksNum /2) ;
            var max = parseInt(this._NowPage) + parseInt(this.options.pageLinksNum /2) ;

            min = min < 1 ? 1 : min ;
            max = max > this._PageTotal ? this._PageTotal : max ;

            var linkClass = "wy-paginator-pagelinks-default" ;
            var pageLinksHtml = "";

            for(var i=min;i<=max;i++){
                linkClass = i == this._NowPage ? "wy-paginator-pagelinks-current" : "wy-paginator-pagelinks-default" ;
                pageLinksHtml += "<span class='"+linkClass+"' page='"+i+"'>"+i+"</span>";
            }

            $pageLinks.html(pageLinksHtml);

            var _self = this ;

            //tag:因为快速链接是生成的，每次创建完成后需要再次注册事件
            var $pageLinksItem = this.element.find(".wy-paginator-pagelinks>span");
            $pageLinksItem.click(function(event){
                _self._setPage($(this).attr("page"));
                _self._triggerPageChange(event);
            });

        },
        //更新分页下拉列表
        //silent如果为true,则此控件不发出chnage事件
        _updatePageGoToList:function(){
            //TODO:当分页过多时，优化最多只显示20条，以当前页为基准，前后10条
            var $select = this.element.find(".wy-paginator-gotopage select") ;
            if(!$select){
                return ;
            }
            $select.wyDropdown("removeAllOptions");

            var startIndex=1,endIndex=this._PageTotal;
            var range = this.options.pageGotoRange ;
            if(range > 0){
                startIndex = this._NowPage - range < 1 ? 1 : this._NowPage - range ;
                endIndex = this._NowPage - 0 + range > this._PageTotal ?  this._PageTotal : this._NowPage - 0 + range ;
            }

            for(var i=startIndex;i<=endIndex;i++){
                $select.wyDropdown("addOption",i+"",i);
            }

            $select.wyDropdown("selectValue",this._NowPage);
        },
        _initEvent:function(){
            //tag:导航（上一页等按钮事件）
            var $firstpage = this.element.find(".wy-paginator-firstpage>a");
            var $previouspage = this.element.find(".wy-paginator-previouspage>a");
            var $nextpage = this.element.find(".wy-paginator-nextpage>a");
            var $lastpage = this.element.find(".wy-paginator-lastpage>a");

            var _self = this ;

            $firstpage.click(function(event){
                _self._setPage(1);
                _self._triggerPageChange(event);
            });

            $previouspage.click(function(event){
                _self._setPage(_self._NowPage-1);
                _self._triggerPageChange(event);
            });

            $nextpage.click(function(event){
                _self._setPage(_self._NowPage+1);
                _self._triggerPageChange(event);
            });

            $lastpage.click(function(event){
                _self._setPage(_self._PageTotal);
                _self._triggerPageChange(event);
            });

            //tag:跳转页面事件
            _self._gotoSelect.wyDropdown({
                change:function(event,d){
                    if(d.changeFromUI){
                        _self._setPage(d.value);
                        _self._triggerPageChange(event);
                    }
                }
            });

            //tag:分页大小修改事件
            this._pageSizeSelect.wyDropdown({
                change:function(event,d){
                    //改变除当前页之外的参数时，需要改变options值
                    _self.options.pageSize = d.value;
                    _self._updateParams();
                    _self._setPage(1);
                    _self._triggerPageChange(event);
                }
            });

        },
        //更新参数
        _updateParams:function(){
            this._PageSize = this.options.pageSize;
            this._NowPage = this.options.nowPage;
            this._RecordTotal = this.options.recordTotal;
            this._PageTotal = Math.floor(this.options.recordTotal / this.options.pageSize) + (this.options.recordTotal % this.options.pageSize > 0 ? 1 : 0) ;

            this._PageTotal = this._PageTotal == 0 ? 1 : this._PageTotal ;
        },
        _setPage:function(page){
            if(page<1){
                page = 1 ;
            }
            if(page>this._PageTotal){
                page = this._PageTotal ;
            }
            this._NowPage = page ;
            this._updateUI();
        },
        _triggerPageChange:function(event){
            this._trigger("pageChange",event,{
                nowPage:this._NowPage - 0,
                pageSize:this._PageSize
            });
        },
        updateData:function(page,recordTotal){
            this.options.nowPage = page ;
            this.options.recordTotal = recordTotal ;
            this._updateParams();
            this._setPage(this.options.nowPage);
        },
        setOption: function(key, value){
            if(key === 'nowPage') {
                this._setPage(value);
            }
            else {
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },
        getNowPage:function(){
            return this._NowPage ;
        },
        getPageSize:function(){
            return this._PageSize ;
        }
    });
});
//TODO:自定义标题栏上面的控件
//注：1.使用固定大小的panel时，需要指定max-heigth与height样式属性一致
// (heigh:值与百分比这间不能产生动画，替换方案为height设为auto,用maxheight之间数值替换动画过度，可在全屏时将maxHeight设置为一个很大的值)
//2.使用根据定位来决定高度的panel时，需要为其指定为onheight class
//TODO:css动画改为jquery动画效果
$(function(){
    $.widget("wy.wyPanel" ,{
        options:{
            vScroll:true, //是否有垂直滚动条
            hScroll:false,
            footer:false, //是否有底栏
            //默认按钮
            button:{
                refresh:true,
                close:true,
                fullscreen:true,
                toggle:true
            },
            dbfullscreen:false,//是否双击最大化
            theme:null,
            closing:null, //当panel关闭时触发，如果未绑定此事件处理函数，则直接关闭
            customer:[] //自定义控件,理论上任意html元素均可
        },
        fullscreenIcon:"zmdi-fullscreen",
        fullscreenExitIcon:"zmdi-fullscreen-exit",
        _container:null,
        _header:null,
        _content:null,
        _footer:null,
        _buttonbar:null,

        _btnRefresh:null,
        _btnClose:null,
        _btnFullscreen:null,
        _btnToggle:null,
        _create:function(){
            this._createUI();
            this._adjustContainer();
            this._createHeaderButtons();
            this._createCustomerButtons();
            this._bindEvent();
            this._trigger("created");
        },
        _createUI:function(){
            this._container = this.element ;
            this.element.addClass("wy-panel").contents().wrapAll("<div class='wy-panel-content'></div>");
            if(this.options.theme){
                this.element.addClass(this.options.theme);
            }
            //header
            this._header = $("<div class='wy-panel-header user-select-none'><div class='wy-panel-header-left'></div><div class='wy-panel-header-text'></div><div class='wy-panel-header-right'></div></div>").prependTo(this.element);
            this._content = this.element.children(".wy-panel-content");
            //footer
            //如果在定义的DIV中有，class=wy-sidepanel-footer的元素，以此元素做为footer(优先)
            var cusFooter = this.element.find(".wy-panel-footer");
            if(cusFooter){
                this._content.addClass("has-footer");
                this._footer = cusFooter.appendTo(this._container);
            }else if(this.options.footer){
                this._footer = $("<div class='wy-panel-footer'></div>").appendTo(this._container);
                this._content.addClass("has-footer");
            }

            //创建滚动条
            if(this.options.vScroll && !this.options.hScroll){
                this._content = wyHelper.scroll(this._content);
            }

            if(!this.options.vScroll && this.options.hScroll){
                this._content = wyHelper.scroll(this._content,{
                    axis:"x",
                    theme:"dark",
                    scrollInertia:0
                });
            }

            if(this.options.vScroll && this.options.hScroll){
                this._content = wyHelper.scroll(this._content,{
                    axis:"xy",
                    theme:"dark",
                    scrollInertia:0
                });
            }

            this._header.children(".wy-panel-header-text").html(this.element.prop("title"));
            this.element.removeAttr("title");
        },
        _createHeaderButtons:function(){
            var $headerRight =  this._header.children(".wy-panel-header-right");
            //TODO:按钮文本由全局配置中获取
            if(this.options.button.refresh){
                this._btnRefresh = $("<i title='刷新' class='fa fa-refresh'></i>").appendTo($headerRight);
            }

            if(this.options.button.fullscreen){
                this._btnFullscreen = $("<i title='全屏' class='zmdi zmdi-fullscreen'></i>").appendTo($headerRight);
            }

            if(this.options.button.toggle){
                this._btnToggle = $("<i title='收起' class='fa fa-chevron-down'></i>").appendTo($headerRight);
            }

            if(this.options.button.close){
                this._btnClose = $("<i title='关闭' class='fa fa-times'></i>").appendTo($headerRight);
            }
        },
        _createCustomerButtons:function(){
            //TODO:创建用户自定义
            var $headerRight =  this._header.children(".wy-panel-header-right");
            if(this.options.customer){
                for(var i=0;i<this.options.customer.length;i++){
                    $headerRight.prepend(this.options.customer[i]);
                }
            }
        },
        _bindEvent:function(){
            var _self = this;
            if(this._btnClose){
                this._btnClose.click(function(event){
                    if(!_self.options.closing){
                        _self.element.remove();
                    }else{
                        _self._trigger("closing",event,null);
                    }
                    event.stopPropagation();
                });
            }

            if(this._btnRefresh){
                this._btnRefresh.click(function(event){
                    _self._trigger("refresh",event,null);
                    event.stopPropagation();
                });
            }

            if(this._btnToggle){
                this._btnToggle.click(function(event){
                    var miniClass = _self.element.hasClass("noheight") ? "noheight-mini" : "mini" ;
                    _self.element.toggleClass(miniClass);
                    _self._btnToggle.toggleClass("fa-chevron-down").toggleClass("fa-chevron-up");
                    _self._trigger("toggle",event,null);
                    event.stopPropagation();
                });
            }

            if(this._btnFullscreen){
                this._btnFullscreen.click(function(event){
                    _self.element.toggleClass("fullscreen");
                    _self._btnFullscreen.toggleClass(_self.fullscreenIcon).toggleClass(_self.fullscreenExitIcon);
                    _self._trigger("fullscreen",event,null);
                    event.stopPropagation();
                });
            }

            this._header.find(".wy-panel-header-right").dblclick(function(event){
                event.stopPropagation();
            });

            this._header.dblclick(function(event){
                if(!_self.options.dbfullscreen){
                    return;
                }
                _self.element.toggleClass("fullscreen");
                if(_self._btnFullscreen){
                    _self._btnFullscreen.toggleClass(_self.fullscreenIcon).toggleClass(_self.fullscreenExitIcon);
                }
                _self._trigger("fullscreen",event,null);
            });
        },
        //根据设置调整位置
        _adjustContainerSize:function(){
            var _contentHeight = this._container.height();
            if(this._header){
                _contentHeight -= this._header.outerHeight(); //边框宽度
            }
            if(this._footer){
                _contentHeight -= this._footer.outerHeight();
            }
            this._container.children(".wy-panel-content").height(_contentHeight);
        },
        _adjustContainer:function(){
            if(this._header){
                this._container.children(".wy-panel-content").css("top",this._header.outerHeight());
            }
            if(this._footer){
                this._container.children(".wy-panel-content").css("bottom",this._footer.outerHeight());
            }
        }
    });
});

/**
 *  wySidepanel
 *  侧边栏窗口
 *  @require 需要滚动条控件（mCustomerScroll），
 *  @require 大小改变事件组件(jquery.ba-resize)
 *  @param {Object} options
 *  @param options.parent:null 窗口显示的父对象，默认空为body
 *  @param float "right", 位置可选：rigth,left,top,bottom
 *  @param buttonAlign: "right" 可选：left,rigth,center
 *  @param vScroll: true, 是否需要滚动条(垂直)
 *  @param hScroll: false, 是否需要滚动条(水平)
 *  @param theme:"" 主题样式
 */

/*
(function(factory){
    if (typeof define === "function" && define.cmd ) {
        define(function(require){
            var $ = require("$");
            require("jqueryui");
            require("./base");
            factory($);
        });
    } else {
        $(function(){
            factory(jQuery);
        });
    }
}(function($){

*/

    //TODO:自定义标题栏元素

    $.widget("wy.wySidepanel",{
        options:{
            parent:null, //窗口显示的父对象，默认空为body
            float: "right", //位置可选：rigth,left,top,bottom
            footerAlign: "right", //可选：left,rigth,center
            hasHeader:true,
            captionAlign:"left", //可选：left,rigth,center
            initialVisible:true, //初始时是否显示
            buttons:{
                //全屏
                full:true,
                //最大化
                max:true,
                //刷新
                refresh:true,
                //关闭
                close:true,
                //切换
                toggle:false
            },
            scroll:null //可选null,x,y,xy
        },
        parts:{
            base:"wy-sidepanel",
            header:"wy-sidepanel-header",
            caption:"wy-sidepanel-caption",
            headerButtonBar:"wy-sidepanel-header-bottons",
            customerBar:"wy-sidepanel-header-customer",

            content:"wy-sidepanel-content",

            close:"wy-sidepanel-close",
            full:"wy-sidepanel-full",
            max:"wy-sidepanel-max",
            refresh:"wy-sidepanel-refresh",
            toggle:"wy-sidepanel-toggle",

            footer:"wy-sidepanel-footer",
            noHeader:"no-header"
        },
        icons:{
            close : icoDef.close,
            full : icoDef.full,
            fullOff : icoDef.fullOff,
            max : icoDef.max,
            maxOff : icoDef.maxOff,
            refresh : icoDef.refresh,
            toggle:{
                left : icoDef.chevronLeft,
                right : icoDef.chevronRight,
                top : icoDef.chevronUp,
                bottom: icoDef.chevronDown
            }
        },
        header:null,
        content:null,
        footer:null,
        caption:null,
        full:null,
        max:null,
        refresh:null,
        close:null,
        toggle:null,
        //可见时定位样式
        visibleStyle:null,
        //隐藏时定位样式
        hideStyle:null,
        isShowing:null,
        //隐藏时动画移动量
        hideToValue:0,
        _create:function(){
            this.element.css("z-index",gConfig.baseIndex);
            this._readClassOptions();

            this.element.addClass(this.parts.base).addClass(this.options.float);
            if(!this.options.hasHeader && !this.element.hasClass("no-header")){
                this.element.addClass(this.parts.noHeader);
            }

            this._createUI();
            this._bindEvents();
        },
        //从class中读取设置属性
        _readClassOptions:function(){
            if(this.element.hasClass("left")) this.options.float = "left" ;
            if(this.element.hasClass("right")) this.options.float = "right" ;
            if(this.element.hasClass("top")) this.options.float = "top" ;
            if(this.element.hasClass("bottom")) this.options.float = "bottom" ;
            if(this.element.hasClass("no-header")) this.options.hasHeader = false ;

        },
        _createUI:function(){
            var title ;
            var htmlHeader ;
            var htmlHeaderButtonBar ;
            var htmlFooter;
            var htmlContent;
            var htmlToggle ;

            //标题文本
            title = this.element.attr("title") ? this.element.attr("title") : "";
            this.element.removeAttr("title");

            //标题buttonbar
            htmlHeaderButtonBar = "<div class='" + this.parts.headerButtonBar +"'>" ;
            for(var k in this.options.buttons){
                if(this.options.buttons[k] && k!="toggle"){
                    htmlHeaderButtonBar += "<a class='"+ this.parts[k] +"'><i class='"+ this.icons[k] +"'></i></a>"
                }
            }
            htmlHeaderButtonBar += "</div>";
            //标题
            htmlHeader = "<div class='" + this.parts.header + "'><div style='text-align: " + this.options.captionAlign + "' class='" + this.parts.caption + "'>" + title + "</div><div class='" + this.parts.customerBar + "'></div>"+ htmlHeaderButtonBar +"</div>";
            //内容
            htmlContent = "<div class='" + this.parts.content + "'></div>";

            var toggleIcon = this.icons.toggle[this.options.float];
            if(!this.options.initialVisible){
                switch (this.options.float){
                    case "left" : {
                        toggleIcon = this.icons.toggle["right"];
                        break;
                    }
                    case "right" : {
                        toggleIcon = this.icons.toggle["left"];
                        break;
                    }
                    case "top" : {
                        toggleIcon = this.icons.toggle["bottom"];
                        break;
                    }
                    case "bottom" : {
                        toggleIcon = this.icons.toggle["top"];
                        break;
                    }
                }
            }

            htmlToggle = "<a class='"+ this.parts.toggle + " " + this.options.float + "'><i class='"+ toggleIcon +"'></i></a>";



            this.toggle = $(htmlToggle);
            this.header = $(htmlHeader);
            this.element.contents().wrapAll(htmlContent);
            this.content = this.element.find("." + this.parts.content);

            //页脚
            //TODO:用统一class来标识footer
            this.footer = this.element.find("." + this.parts.footer);
            if(this.footer){
                this.footer.addClass(this.options.footerAlign);
            }else{
                htmlFooter = "<div class='" + this.parts.footer + "' style='text-align: " + this.options.footerAlign + "'></div>";
                this.footer = $(htmlFooter);
            }

            this.content.before(this.header).after(this.footer);
            if(this.options.buttons.toggle){
                this.element.append(this.toggle);
            }

            //操作部件
            this.refresh = this.header.find("." + this.parts.refresh) ;
            this.max = this.header.find("." + this.parts.max) ;
            this.close = this.header.find("." + this.parts.close) ;
            this.full = this.header.find("." + this.parts.full) ;


            //添加到父容器
            if(this.options.parent){
                this.element.css("position","absolute").appendTo(this.options.parent);
                this.options.parent.css("overflow","hidden");
            }else{
                this.element.css("position","fixed");
            }

            this._adjustUI();
        },
        //调整各部分位置
        _adjustUI:function(){
            //计算content位置
            this.content.css({
                top:this.options.hasHeader ? this.header.outerHeight() : 0 ,
                bottom:this.footer.outerHeight()
            });

            this._adjustPostion();
            this.element.css(this.options.initialVisible ? this.visibleStyle : this.hideStyle);
            this.isShowing = this.options.initialVisible ;

        },
        //调整组件位置
        _adjustPostion:function(){
            this.visibleStyle = {};
            this.hideStyle = {};
            this.visibleStyle[this.options.float] = 0 ;
            //定位初始位置
            if(this.options.float == "left" || this.options.float == "right"){
                this.hideStyle[this.options.float] = 0 - this.element.width();
                this.hideToValue = this.element.width() ;
            }
            if(this.options.float == "top" || this.options.float == "bottom"){
                this.hideStyle[this.options.float] = 0 - this.element.height();
                this.hideToValue = this.element.height() ;
            }
        },
        _switchToggle:function(){
            if(!this.options.buttons.toggle){
                return;
            }
            if(this.options.float == "top" || this.options.float == "bottom"){
                this.toggle.children("i").toggleClass(this.icons.toggle.top).toggleClass(this.icons.toggle.bottom);
            }
            if(this.options.float == "left" || this.options.float == "right"){
                this.toggle.children("i").toggleClass(this.icons.toggle.left).toggleClass(this.icons.toggle.right);
            }
        },
        //绑定事件
        _bindEvents:function(){
            var _self = this ;
            this.toggle.click(function(){
                if(_self.isShowing){
                    _self.hide();
                }else{
                    _self.show();
                }
            });


            //关闭事件
            if(this.close){
                this.close.click(function(){
                    _self.hide();
                });
            }

            //刷新事件
            if(this.refresh){
                this.refresh.click(function(){
                    this._trigger("refresh");
                });
            }

            //最大化事件
            if(this.max){
                this.max.click(function(){
                    _self.maxToggle();
                });
            }

            //全屏事件
            //最大化事件
            if(this.full){
                this.full.click(function(){
                    _self.fullToggle();
                });
            }
        },
        maxToggle:function(){
            if(this.element.hasClass("max-size")){
                this.maxOff();
            }else{
                this.maxOn();
            }
        },
        fullToggle:function(){
            if(this.element.hasClass("full-size")){
                this.fullOff();
            }else{
                this.fullOn();
            }
        },
        //最大化
        maxOn:function(){
            this.element.removeClass("full-size");
            this.element.addClass("max-size");
            this.max.find("i").removeClass(this.icons.max).addClass(this.icons.maxOff);
            this._trigger("maxOn");
        },
        //还原
        maxOff:function(){
            this.element.removeClass("full-size");
            this.element.removeClass("max-size");
            this.max.find("i").removeClass(this.icons.maxOff).addClass(this.icons.max);
            this._trigger("maxOff");
        },
        //最大化
        fullOn:function(){
            this.element.removeClass("max-size");
            this.element.addClass("full-size");
            this.full.find("i").removeClass(this.icons.full).addClass(this.icons.fullOff);
            this._trigger("fullOn");
        },
        //还原
        fullOff:function(){
            this.element.removeClass("max-size");
            this.element.removeClass("full-size");
            this.full.find("i").removeClass(this.icons.fullOff).addClass(this.icons.full);
            this._trigger("fullOff");
        },
        //显示面板
        show:function(){
            if(this.isShowing){
                return;
            }
            this._switchToggle();
            $("body").css("overflow","hidden");
            this.element.show();
            var animateData = {};
            animateData[this.options.float] = 0 ;
            this.element.animate(animateData, 500);
            this.isShowing = true;
            this._trigger("showing");
        },
        //隐藏面板
        hide:function(){
            if(!this.isShowing){
                return;
            }
            //隐藏重置为原始状态
            this.element.removeClass("max-size").removeClass("full-size");
            this._switchToggle();
            //TODO:如果为最大化或者全屏,先复位
            var animateParam = {};
            animateParam[this.options.float] = - 1 - this.hideToValue ;
            this.element.animate(animateParam, 300);
            this.isShowing = false;
            this._trigger("closing");
        }
    });

/*
}));
    */
//TODO:1.垂直方向tab
//TODO:2.加载更多tab下拉列表
//TODO:3.样式调整
//TODO:4.结合sidepanel-toggle方式创建新组件,side-tabview

/*
(function(factory){
    if (typeof define === "function" && define.cmd ) {
        define(function(require){
            var $ = require("$");
            require("jqueryui");
            require("./base");
            factory($);
        });
    } else {
        $(function(){
            factory(jQuery);
        });
    }
}(function($){
*/


    $.widget("wy.wyTabview",{
        parts:{
            name:"wy-tabview",
            content:"wy-tabview-content",
            header:"wy-tabview-header",
            tab:"wy-tabview-tab",
            navButton:"wy-tabview-navbuttons",
            previousTab:"wy-tabview-previous-tab",
            nextTab:"wy-tabview-next-tab",
            closeTab:"wy-tabview-tabclose",
            //有导航组件
            naviable:"wy-tabview-naviable"
        },
        options:{
            //默认激活的tab
            activeIndex : 0
            //是否固定高度，内容超出部分会自动添加垂直滚动条 否则会根据内容改变适应高度
            ,fixed : false
            //被隐藏tab页展示方式 可选 list以下拉列表方式选择被隐藏的列表标签 none 无导航
            ,navMode : "none"
            ,sortable : false
        },
        header:null,
        content:null,
        navButton:null,//导航按钮组

        _create:function(){
            var _self = this ;
            this.element.addClass(this.parts.name);
            if(this.options.fixed){
                this.element.addClass("fixed");
            }

            //content
            this.content = this.element.children("div").addClass(this.parts.content);
            this.content.children("div").hide();
            //header
            this.element.children("ul").children("li").addClass(this.parts.tab);
            this.element.children("ul").wrap("<div class="+ this.parts.header +"></div>");
            this.header = this.element.children("." + this.parts.header);
            this.header.children("ul").children("li").removeClass(classDef.state.selected);
            //设置默认活动页
            this.content.children("div:eq("+ this.options.activeIndex +")").show();
            this.header.children("ul").children("li:eq("+ this.options.activeIndex +")").addClass(classDef.state.selected);


            //导航buttons
            if(this.options.navMode==="button"){
                this.navButton = this._createNavButton();
                this.element.append(this.navButton);
                this.element.addClass(this.parts.naviable);
            }
            //生成页签关闭按钮
            this.header.find("." + this.parts.tab).each(function(){
                _self._createTabTrigger($(this));
            });
            this._bindEvents();

            if(this.options.sortable){
                this.header.find("ul").sortable({
                });
            }
        },
        //绑定事件
        _bindEvents:function(){
            var _self = this ;
            //页签事件
            this.header.find("." + this.parts.tab).each(function(){
                _self._bindTabEvent($(this));
            });

            if(this.options.navMode==="button"){
                this._bindNavEvent();
            }
        },
        //页签事件
        _bindTabEvent:function(tab){
            var _self = this ;
            tab.click(function(){
                _self._selectTab(tab);
            });
        },
        //导航按钮事件
        _bindNavEvent:function(){
            var _self = this ;
            //前一页签
            this.navButton.children("." + this.parts.previousTab).click(function(){
                var index = _self._getSelectIndex();
                if(index==0){
                    _self.selectTab( _self.header.find("." + _self.parts.tab).length - 1);
                    return ;
                }
                _self.selectTab(--index);
            });
            //后一页签
            this.navButton.children("." + this.parts.nextTab).click(function(){
                var index = _self._getSelectIndex();
                if(index >= _self.header.find("." + _self.parts.tab).length - 1){
                    _self.selectTab(0);
                    return ;
                }
                _self.selectTab(++index);
            });
        },
        //创建导航按钮
        _createNavButton:function(){
            return $("<div class='"+ this.parts.navButton +"'><i class=' "+ this.parts.previousTab + " "  + icoDef.previous +"'></i><i class='"+ this.parts.nextTab + " " + icoDef.next +"'></i></div>");
        },
        //创建页签导航下拉
        _createNavCombobox:function(){
            //TODO:以下拉方式切换多余页签
        },
        //为设置为closable标签页添加关闭按钮
        _createTabTrigger:function(tab){
            var _self = this ;
            var html = tab.html();
            tab.html("");
            if(tab.hasClass(classDef.closable)){
                tab.append("<div>" + html + "</div><i class='"+ this.parts.closeTab + " " + icoDef.close +"'></i>");
                console.log(4)
                //页签关闭事件
                tab.children("." + this.parts.closeTab).click(function(e){
                    var index = _self.header.find("." + _self.parts.tab).index(tab);
                    var tabData = tab.data("data");

                    //触发自定义事件
                    _self._trigger("remove",e,{
                        index:index,
                        tabNumber:_self.getTabNumber(),
                        data:tabData
                    });

                    _self.content.children("div:eq("+ index +")").remove();
                    tab.remove();
                    if(!tab.hasClass(classDef.state.selected)){
                        _self.header.find("." + _self.parts.tab+":eq(" + _self._getSelectIndex() + ")").click()
                        return;
                    }

                    if(index > 0){
                        _self.header.find("." + _self.parts.tab+":eq(" + --index + ")").click();
                    }else if(_self.getTabNumber() > 0){
                        _self.header.find("." + _self.parts.tab+":eq(" + index + ")").click();
                    }
                    e.stopPropagation();
                });
            }else{
                tab.append("<div>" + html + "</div>");
            }

        },
        //获取当前选中的页签
        _getSelectIndex:function(){
            var tab = this.header.find("." + classDef.state.selected);
            return this.header.find("." + this.parts.tab).index(tab);
        },
        //选中页签,支持页签和索引
        //@param tab
        //@param index
        _selectTab:function(tab,index){
            if(!tab){
                tab = this.header.find("." + this.parts.tab + ":eq("+index+")");
            }
            if(!index){
                index = this.header.find("." + this.parts.tab).index(tab);
            }
            this.header.find("." + this.parts.tab).removeClass(classDef.state.selected);
            tab.addClass(classDef.state.selected);
            this.content.children("div").hide();
            this.content.children("div:eq("+ index +")").show();

            //当导航按钮遮住页签时
            //TODO:
            if(this.options.navMode==="button"){
                var tabPosition = tab.position() ;
                if(!tabPosition){
                    return;
                }
                var left = tabPosition.left ;
                var navLeft = this.navButton.position().left ;
                var first = this.header.find("." + this.parts.tab + ":first");
                if(left + tab.outerWidth() > navLeft){
                    this.header.children("ul").animate({
                        left:first.position().left - left + (this.header.innerWidth() - tab.outerWidth() - 7)
                    },100);
                }else{
                    this.header.children("ul").animate({left:0 }, 100);
                }
            }

            this._trigger("select",null,{
                index:index,
                data:tab.data("data")
            });
        },
        _destroy:function(){
            _super("_destroy");
        },
        //添加一个页签
        //tab.title 页签标题
        //tab.closable 是否可以关闭
        //tab.content 页签内容
        //tab.contentType html/url url时采用load方式 为空以html方式添加
        //tab.index 添加位置,如果为空则添加到最后,-1添加到最前
        //tab.data 绑定的自定义数据
        _appendNewTab:function(tab){
            //页签
            var $tab = $("<li class='"+ this.parts.tab +"'>" + tab.title + "</li>");
            if(tab.data){
                $tab.data("data",tab.data);
            }
            //是否能关闭
            if(tab.closable !=false){
                $tab.addClass(classDef.closable);
            }
            var $content = $("<div></div>");

            //插入到最后
            if(!tab.index || tab.index < 1){
                this.header.children("ul").append($tab);
                this.content.append($content);
            }else{
                //tag:根据index选择添加位置
                if(tab.index>0){
                    this.header.find("ul>li").eq(tab.index - 1).after($tab);
                    this.content.children("div:eq("+ (tab.index - 1) +")").after($content);
                }
            }

            //TODO:添加到最前

            this._createTabTrigger($tab) ;
            this._bindTabEvent($tab);


            if(tab.scroll && tab.contentType != "iframe"){
                $content = wyHelper.scroll($content);
            }

            //添加内容
            if(!tab.contentType || tab.contentType=="html"){
                $content.html(tab.content);
            }
            if(tab.contentType=="url"){
                $content.load(tab.content);
            }
            if(tab.contentType=="iframe"){
                $content.html("<iframe src='"+ tab.content +"' frameborder='0' scrolling='no' marginheight='0' marginwidth='0'></iframe>");
            }

            this._selectTab($tab);
        },
        //选中指定index的页签
        selectTab:function(index){
            this._selectTab(null,index);
        },
        //添加一个页签
        //ignoreSame 为true则忽略已有页签,强制添加新的
        add:function(tab,ignoreSame){
            //强制添加新页签
            if(ignoreSame){
                this._appendNewTab(tab);
                return;
            }
            var _self = this ;
            var tabExist = false ;
            //判断当前标题的页签是否存在
            this.header.find("." + this.parts.tab).each(function(){
                if($.trim(tab.title) === $.trim($(this).children("div").text())){
                    //TODO:1\实现是否刷新已有tab
                    //TODO:2\实现新添加的位置与原位置一致,需要更改_appendNewTab方法响应index参数
                    if(tab.reload){
                        var index = _self.header.find("." + _self.parts.tab).index($(this));
                        tab.index = index ;//插入到原来位置
                        _self.content.children("div:eq("+ index +")").remove();
                        $(this).remove();
                        _self._appendNewTab(tab);
                        tabExist = true ;
                    }else{
                        _self._selectTab($(this));
                        tabExist = true ;
                    }
                    return false;
                }
            });
            if(!tabExist){
                this._appendNewTab(tab);
            }
        },
        getTabNumber:function(){
            return this.header.find("." + this.parts.tab).length ;
        }
    });




/*

}));

*/
//TODO:节点路径问题
var AppendType = {
    inner : "inner",
    after : "after",
    before : "before"
}

$(function(){
    $.widget("wy.wyTree",{
        options:{
            hasToggler:true,//是否有展开/收缩按钮
            keyId:"ID",//
            keyPid:"PID",//
            //check相关设置
            hasCheck:true,
            checkPropertyName:"ID",//从data中获取checkbox值属性名
            checkBindChild:true,//父子节点check时是否联动 TODO:checkbox等三种属性表现方式
            checkBindParent:true,
            //
            vScroll:true,
            hScroll:false,
            theme:"",
            dataSource:null,
            simpleData:true,//是否为线性数据结构，为true时，需要将线性数据结构转为tree
            itemRenderer:function(data,$node){
                return data.text ; //$node = li>span
            } ,//节点渲染函数，fn(data,$node) data:节点数据，$node:节点元素，可通过data改变$node样式
            mutilple:false ,//是否可以选择多个节点
            filter:null ,//节点过滤函数
            accept:null, //拖动时判断是否可以接收此节点
            draggable:true //节点是否可以被拖动
        },
        _content:null,//节点容器
        _dsTree:null,
        _checkBind:true,
        _create:function(){
            this.element.addClass("wy-tree").addClass(this.options.theme);
            this._content = this.element ;
            //滚动条
            // TODO:水平滚动条bug
            if(this.options.vScroll && this.options.hScroll){
                this._content = wyHelper.scroll(this._content,{
                    axis:"xy",
                    theme:"dark",
                    scrollInertia:0
                });
            }else if(this.options.vScroll){
                this._content = wyHelper.scroll(this._content);
            }else if(this.options.hScroll){
                this._content = wyHelper.scroll(this._content,{
                    axis:"y",
                    theme:"dark",
                    scrollInertia:0
                });
            }
        },
        _init:function(){
            this._content.html("");
            //根据ds创建
            if(this.options.dataSource){
                this._dsTree = this.options.simpleData ? wyHelper.list2Tree(this.options.dataSource,{
                    idname:this.options.keyId,
                    pidname:this.options.keyPid
                }) : this.options.dataSource;
                this._content.append(this._createTree(this._dsTree,1));
            }

            this._initDrag();
        },
        _initDrag:function(){
            //=======================================================
            //drag
            //TODO:初始化tree时数据限定可拖动的节点
            var _self = this ;
            if(this.options.draggable){
                this._content.find("li").draggable({
                    helper: "clone",
                    revert: "valid",
                    distance : 10,
                    scroll: true ,
                    handle:"span",
                    appendTo:_self._content,
                    start:function(event,ui){

                        if($(this).hasClass("opened")){
                            $(this).children(".wy-tree-toggler").click();
                        }
                    },
                    drag:function(event,ui){
                        _self._getNodeByXy(ui.helper);
                    },
                    stop:function(event,ui){
                        $(".move-unacceptable").removeClass("move-unacceptable");
                        //删除前需要检测此节点父节点
                        if($(".move-inner").length > 0){
                            var $oldpul = $(ui.helper.context).closest("li").closest("ul");
                            var oldData = $oldpul.closest("li").data("data");
                            if(oldData && oldData["children"]){
                                oldData["children"].remove($(this).data("data"));
                            }

                            //2.处理节点移动到新节点下
                            var $ul = $(".move-inner").closest("li").children("ul");
                            var $pul = $(".move-inner").closest("ul"),
                                level = $pul ? $pul.attr("level") - 0 + 1 : 1;
                            if($ul.length < 1){
                                $ul = $("<ul level='"+ level +"'></ul>");
                                $(".move-inner").closest("li").append($ul);
                            }

                            $ul.append($(this));
                            var newData = $ul.closest("li").data("data");
                            if(!newData["children"]){
                                newData["children"] = [];
                            }
                            newData["children"].push($(this).data("data"));

                            //1.处理源节点
                            if($oldpul.children("li").length < 1){
                                $oldpul.closest("li").children(".wy-tree-toggler").hide();
                            }

                            //处理数据源
                            $ul.closest("li").children(".wy-tree-toggler").show();
                            var data = $(this).data("data");
                            data[_self.options.keyPid] =  $ul.closest("li").data("data")[_self.options.keyId];
                            $(this).data("data",data);

                            //3.恢复
                            $(".move-inner").removeClass("move-inner");
                        }
                        $(".node-drag-pt").hide();
                        $(this).children(".wy-tree-toggler").click();
                        _self._trigger("nodeDraged",null,{
                            oldParentData:oldData,
                            newParentData:newData,
                            nodeData:data
                        });
                    }
                });
            }
        },
        //检测出接收此节点的组件
        _getNodeByXy:function(helper){
            var _self = this ;
            $(".move-inner").removeClass("move-inner");
            $(".move-unacceptable").removeClass("move-unacceptable");
            $(".node-drag-pt").hide();
            var $hlperSpan = helper.children(".wy-tree-span");
            var top = $hlperSpan.offset().top ;
            var left = $hlperSpan.offset().left ;

            this._content.find(".wy-tree-node:visible:not(.ui-draggable-dragging)").each(function(){
                if(helper.attr("nodeid")==$(this).attr("nodeid")){
                    return true ;
                }
                //inne
                var $span = $(this).children(".wy-tree-span");
                var t = $span.offset().top ;
                var l = $span.offset().left ;
                var diffY = t + $span.outerHeight() - top ;
                var diffX = l + $span.outerWidth() - left ;

                if(diffX > 0 && diffX > $span.outerWidth() * 0.4 && diffX <= $span.outerWidth()
                    && diffY > 0 && diffY > $span.outerHeight() * 0.4 && diffY < $span.outerHeight()){

                    //判断是否可以接收此节点
                    if(_self.options.accept){
                        var nowData = $(helper.context).data("data");
                        var nodeData = _self.getNodeData($(this));

                        var r = _self.options.accept.call(_self.options.accept,nodeData,nowData);
                        if(!r){
                            $span.addClass("move-unacceptable");
                            $(helper).children("span").css("cursor","no-drop");
                            return false ;
                        }
                    }

                    $(helper).children("span").css("cursor","pointer");
                    $span.addClass("move-inner");
                    $(this).children(".node-drag-pt").show();
                }

            });
        },
        _createTree:function(data,level){
            var $ul = $("<ul level='"+ level +"'></ul>");
            if(level==1){
                $ul.addClass("wy-tree-root");
            }
            for(var i=0;i<data.length;i++){
                this._createNode(data[i],$ul,level);
            }
            return $ul ;
        },
        _createRoot:function(data){
            var $ul = $("<ul level='1'></ul>").addClass("wy-tree-root");
            this._createNode(data,$ul,1);
            this._content.append($ul);
        },
        _bindNodeEvent:function($node){
            var _self = this ;
            //click
            $node.children("span").click(function(event){
                if(!_self.options.mutilple){
                    _self._content.find(".selected").removeClass("selected");
                    $(this).addClass("selected");
                }else{
                    $(this).toggleClass("selected");
                }
                _self._content.find(".current").removeClass("current");
                $(this).addClass("current");


                _self._trigger("nodeSelect",event,{
                    node:$(this),
                    data:_self.getNodeData($(this).closest("li")),
                    isLeaf:$(this).closest("li").hasClass("wy-tree-leaf")
                });
            });

            //展开/收缩
            $node.children(".wy-tree-toggler").click(function(){
                $(this).toggleClass("icon-minus-square").toggleClass("icon-plus-square");
                var $li = $(this).closest("li");
                if($li.hasClass("opened")){
                    $(this).nextAll("ul").slideUp("fast");
                }else{
                    $(this).nextAll("ul").slideDown("fast");
                }
                $li.toggleClass("opened").toggleClass("closed");
            });
        },
        _bindCheckEvent:function($check){
            var _self = this ;
            //check
            $check.wyCheckbox({
                change:function(e,d){
                    //TODO:对于check事件区别处理，联动时，其他被联动的不发送事件 :)
                    //_self._trigger("check",e,{value:$(this).val()});
                    //父子联动
                    var $li = $(this).closest("li").toggleClass("node-checked");
                    var $childChks = $li.find("ul .wy-tree-node-check") ;

                    //联动子节点
                    if(_self.options.checkBindChild && _self._checkBind){
                        if(d.checked){
                            $childChks.wyCheckbox("check");
                        }else{
                            $childChks.wyCheckbox("unCheck");
                        }
                    }

                    //联动父节点
                    var $ul = $li.closest("ul");
                    var $parentChk  = $ul.closest("li").find(">.wy-checkbox .wy-tree-node-check");


                    if(_self.options.checkBindParent){
                        if(d.checked){
                            var bortherNoCheckedNum = $ul.find("li:not([class~=node-checked])").length;
                            if(bortherNoCheckedNum==0){
                                $parentChk.wyCheckbox("check");
                            }
                        }else{
                            var bortherCheckedNum = $ul.find("li[class~=node-checked]").length;
                            var allCheckedNum = $ul.find("li").length;
                            if(bortherCheckedNum < allCheckedNum){
                                _self._checkBind = false;
                                $parentChk.wyCheckbox("unCheck");
                                _self._checkBind = true;
                            }
                        }
                    }
                }
            });
        },
        _createNode:function(data,$ul,level){
            var $li,$checkbox;
            $li = $("<li class='wy-tree-node opened'></li>").data("data",data).attr("nodeid",data[this.options.keyId]);
            //展开/收缩
            if(this.options.hasToggler){
                if( data.children){
                    $li.append("<i class='icon-minus-square wy-tree-toggler user-select-none' style='margin-right: 6px;'></i>");
                }else{
                    $li.append("<i class='icon-minus-square wy-tree-toggler user-select-none' style='margin-right: 6px;display: none;'></i>");
                }
            }
            //是否有check
            if(this.options.hasCheck){
                $checkbox = $("<input type='checkbox' class='wy-tree-node-check' value='"+ data[this.options.checkPropertyName] +"'/>").appendTo($li);
                $checkbox.wyCheckbox();
                this._bindCheckEvent($checkbox);
            }

            //拖拽指示
            $li.append("<i class='node-drag-pt zmdi zmdi-forward'></i>");

            $("<span class='wy-tree-span'></span>").append(this.options.itemRenderer(data,$li)).appendTo($li);
            if(data.children && data.children.length > 0){
                $li.append(this._createTree(data.children,level+1));
            }else{
                $li.addClass("wy-tree-leaf");
            }
            $ul.append($li);
            this._bindNodeEvent($li);
        },
        _nodeFilter:function(data,key){
            if(key==""){
                return true ;
            }
            if(data.text && data.text.indexOf(key)>-1){
                return true;
            }
            return false;
        },
        //获取当前选中节点数据，单选时为单个对像，可复选时为一个数组
        getSelectData:function(){
            var _self = this ;
            var nodes = this._content.find(".selected");
            if(!nodes){
                return null;
            }
            if(nodes.length<2){
                var data = nodes.closest("li").data("data");
                if(data){
                    var children = _self.getChildrenData(nodes.closest("li"));
                    if(children) data.children = children ;
                }
                return data;
            }
            var datas=[];
            nodes.each(function(){
                var data = $(this).closest("li").data("data");
                var children = _self.getChildrenData($(this));
                if(children) data.children = children ;
                datas.push(data);
            });
            return datas;
        },
        getNodeData:function($node){
            var _self = this ;
            var data = $node.data("data");
            var children = _self.getChildrenData($node);
            if(children) data.children = children ;
            return data;
        },
        getChildrenData:function($node){
            var _self = this ;
            var $ul = $node.children("ul");
            var children = null;
            if($ul && $ul.length>0){
                children = [];
                var data ;
                $ul.children("li").each(function(){
                    data = $(this).data("data");
                    data.children = _self.getChildrenData($(this));
                    children.push(data);
                });
            }
            return children;
        },
        getCheckData:function(){
            var chkeds = this._content.find("input[type=checkbox]:checked");
            if(!chkeds){
                return null;
            }
            if(chkeds.length<2){
                return chkeds.closest("li").data("data");
            }
            var datas=[];
            chkeds.each(function(){
                datas.push($(this).closest("li").data("data"));
            });
            return datas;
        },
        /**
         * 添加节点
         * @param data 要添加的节点数据
         * @param parent 要添加到的父节点(treeNode/String/null)
         * */
        append:function(data,parent){
            var $ul,
                $node,//当前数据要添加到的父节点
                isRoot=false;
            if(!parent){
                $node = this._content.find(".wy-tree-node[nodeid="+ data[this.options.keyPid] +"]");
            }else if(parent instanceof jQuery){
                $node = parent;
            }else if(!isNaN(parent)){
                $node = this._content.find(".wy-tree-node[nodeId="+ parent +"]");
            }

            //添加的节点无父节点，处理为另一个根节点
            if(!$node || $node.length==0){
                this._createRoot(data);
                return;
            }

            var $pul = $node.closest("ul"),
                level = $pul ? $pul.attr("level") - 0 + 1 : 1;

            $ul = $node.children("ul");
            //处理添加到原本无子节点的节点下
            if(!$ul || $ul.length<1){
                $ul = $("<ul level='"+ level +"'></ul>");
                //为原来的leaf节点添加toggler
                if($node.children(".wy-tree-toggler") && $node.children(".wy-tree-toggler").length < 1){
                    $node.append('<i class="icon-minus-square wy-tree-toggler user-select-none" style="margin-right: 6px;"></i>');
                }
                $node.children(".wy-tree-toggler").show();
                $node.removeClass("wy-tree-leaf").append($ul);
                //为原来为leaf的节点绑定事件
                $node.children(".wy-tree-toggler").click(function(){
                    $(this).toggleClass("icon-minus-square").toggleClass("icon-plus-square");
                    var $li = $(this).closest("li");
                    if($li.hasClass("opened")){
                        $(this).nextAll("ul").slideUp("fast");
                    }else{
                        $(this).nextAll("ul").slideDown("fast");
                    }
                    $li.toggleClass("opened").toggleClass("closed");
                });
            }
            this._createNode(data,$ul,level);

            //同步到datasource
            this.options.dataSource.push(data);
            //同步当前数据节点依附的父节点数据
            var nodeData = $node.data("data");
            if(!nodeData.children){
                nodeData.children = [];
            }
            nodeData.children.push(data);
            this._initDrag();
        },
        /**
         *删除节点
         * @param data 节点,可为以下三种类型中任意一种：(1)一个包含节点idKey的对象,(2)节点ID,(3)节点html对象
         * @parent parent 指定此属性，则操作的对象为此节点下的对象，可为一个jquery节点对象，或节点id
         * */
        remove:function(data,parent){
            var _self = this ;
            var $node ;
            var $parent ;
            var pid = data[this.options.keyPid];

            if(data instanceof jQuery){
                $node = data ;
                data = $node.data("data");
            }else if(parent){//如果指定了父节点
                if(parent instanceof jQuery){//如果指定节点是jquery节点对象，直接使用
                    $parent = parent;
                }else if(!isNaN(parent)){//如果为父节点ID
                    $parent = this._content.find(".wy-tree-node[nodeid="+ parent +"]");
                }
                $node = $parent.find(".wy-tree-node[nodeid="+ data[this.options.keyId] +"]");
            }else if(data[this.options.keyPid]){//查找PID节点
                $parent = this._content.find(".wy-tree-node[nodeid="+ data[this.options.keyPid] +"]");
                if($parent.length>0){//如果查找不到直接根节点，当前节点为一级节点
                    $node = $parent.find(".wy-tree-node[nodeid="+ data[this.options.keyId] +"]");
                }else{
                    $node = this._content.find(".wy-tree-node[nodeid="+ data[this.options.keyId] +"]");
                }
            }else{
                $node = this._content.find(".wy-tree-node[nodeid="+ data[this.options.keyId] +"]");
            }


            if(!$node){
                return;
            }

            //console.info(data);

            $node.each(function(){
                if($(this).data("data")[_self.options.keyPid] == pid){
                    _self._remove($(this),$parent,data);
                }


            });
        },

        _remove:function($node,$parent,data){
            var _self = this;
            var $pul = $node.closest("ul"),$pli = $pul.closest("li");

            if($pul.children().length < 1){
                $pul.remove();
                $pli.children(".wy-tree-toggler").remove();
            }

            //同步到datasource
            //删除子数据
            $node.find(".wy-tree-node").each(function(){
                for(var i=0;i<_self.options.dataSource.length;i++){
                    if(_self.options.dataSource[i][_self.options.keyId]==$(this).data("data")[_self.options.keyId]){
                        _self.options.dataSource.splice(i,1);
                    }
                }
            });
            //删除自身数据
            for(var i=0;i<_self.options.dataSource.length;i++){
                if(_self.options.dataSource[i][_self.options.keyId]==data[_self.options.keyId]){
                    _self.options.dataSource.splice(i,1);
                }
            }
            //同步父节点data
            var $parentNodeData = null;
            if($parent && $parent.length>0){
                $parentNodeData = $parent.data("data");
                //console.info(JSON.stringify($parentNodeData));
                if($parentNodeData["children"]){
                    $parentNodeData["children"].remove(data,function(d,d2){
                        if(d[_self.options.keyId]==d2[_self.options.keyId]){
                            return true;
                        }
                        return false;
                    });
                }
                //console.info(JSON.stringify($parentNodeData));
            }
            $node.remove();
        },
        modify:function(data){
            var pid = data[this.options.keyPid];
            var $node ;
            var _self = this ;
            if(data instanceof jQuery){
                $node = data ;
                data = $node.data("data");
            }else{
                $node = this._content.find(".wy-tree-node[nodeid="+ data[this.options.keyId] +"]");
            }

            if(!$node){
                return;
            }

            $node.each(function(){
                if($(this).data("data")[_self.options.keyPid] == pid){
                    $(this).children(".wy-tree-span").html("").append(_self.options.itemRenderer(data,$(this)));
                    $(this).data("data",data);
                    //同步到datasource
                    for(var i=0;i<_self.options.dataSource.length;i++){
                        if(_self.options.dataSource[i][_self.options.keyId]==data[_self.options.keyId]){
                            _self.options.dataSource[i]=data;
                        }
                    }
                }
            });
        },
        disableCheck:function(id,pid){
            var checks ;
            if(!id){
                checks = this._content.find("input[type=checkbox]");
            }
            checks.wyCheckbox("disable");
        },
        enableCheck:function(id,pid){
            var checks ;
            if(!id){
                checks = this._content.find("input[type=checkbox]");
            }
            checks.wyCheckbox("enable");
        },
        filterTree:function(key){
            //TODO:树状结构过滤
            var temp = [];
            var filterFn = this.options.filter ? this.options.filter : this._nodeFilter ;
            if(this.options.dataSource){
                for(var i=0;i<this.options.dataSource.length;i++){
                    if(filterFn(this.options.dataSource[i],key)){
                        temp.push(this.options.dataSource[i]);
                    }
                }
            }
            this._content.html("");
            this._dsTree = wyHelper.list2Tree(temp);
            this._content.append(this._createTree(this._dsTree,1));
        }
    });
});
/**
 * Created by hexb on 16/3/8.
 */

$(function(){
    $.widget("bm.bmPanel", $.wy.wyPanel ,{});
    $.widget("bm.bmListbox", $.wy.wyListbox ,{});
    $.widget("bm.bmListview", $.wy.wyListview ,{});
    $.widget("bm.bmLoader", $.wy.wyLoader ,{});
    $.widget("bm.bmNotification", $.wy.wyNotification ,{});
    $.widget("bm.bmPaginator", $.wy.wyPaginator ,{});
    $.widget("bm.bmSidepanel", $.wy.wySidepanel ,{});
    $.widget("bm.bmTabview", $.wy.wyTabview ,{});
    $.widget("bm.bmTree", $.wy.wyTree ,{});
    $.widget("bm.bmButton", $.wy.wyButton ,{});
    $.widget("bm.bmCheckbox", $.wy.wyCheckbox ,{});
    $.widget("bm.bmDatatable", $.wy.wyDatatable ,{});
    $.widget("bm.bmDialog", $.wy.wyDialog ,{});
    $.widget("bm.bmDropdown", $.wy.wyDropdown ,{});
    $.widget("bm.bmGroupButton", $.wy.wyGroupButton ,{});
    $.widget("bm.bmInputtext", $.wy.wyInputtext ,{});
    $.bmAlert = $.wyAlert ;
});




