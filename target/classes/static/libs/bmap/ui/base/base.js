
/**
 * wyUI基础方法
 * @class wyHelper
 * @static
 */
define([],function() {
    ;(function(window) {
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
            },
            inArray: function(target, item) {
                $.isArray(target) && target.push(item);
                return target;
            }
        };

        /** 数节点的插入类型 */
        var AppendType = {
            inner : "inner",
            after : "after",
            before : "before"
        }

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

        //设置为全局变量
        window.wyHelper = wyHelper;
        window.icoDef = icoDef;
        window.gConfig = gConfig;
        window.AppendType = AppendType;
        window.classDef = classDef;
    })(window)

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

    /*** js基础函数的扩展 **/
    ;(function(window) {
        window.Array.prototype.remove = function(item,comparator){
            var fn = comparator ? comparator :  function(d1,d2){
                return d1 == d2 ;
            }
            for(var i=0;i<this.length;i++){
                if(fn(item,this[i])){
                    this.splice(i,1);
                }
            }
        }

        window.Array.prototype.isContains = function(item){
            return wyHelper.inArray(this,item);
        }

        window.String.prototype.fill = function(obj){
            return wyHelper.fillString(obj,this);
        }
    })(window,undefined);

    return {};
});






