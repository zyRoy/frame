define(['jquery', 'menuData', 'bmapui'],function($, MenuData) {

    var menuCreator= {
        m1s :'<li mid="m-{{code}}" class="sidebar-items"><div class="items-sec"><span class="items-sec-ico ico-arrow"></span><span title="{{text}}">{{text}}</span></div><div class="items-sub"></div></li>',
        m1  :'<li mid="m-{{code}}" class="sidebar-items"><div class="items-sec"><span class="items-sec-ico ico-arrow"></span><span title="{{text}}" class="list-content">{{text}}</span></div><div class="items-sub"></div></li>',
        m2  :'<li mid="m-{{code}}" class="items-sub-list"><span class="menu-icon {{icon}}"></span><span title="{{text}}" class="list-content">{{text}}</span></li>',
        m1f : '<li class="sidebar-items" title="{{text}}"><div class="items-sec" title="{{text}}"><span class="items-sec-ico ico-arrow"></span></div><div class="items-sub"></div></li>',
        m2f : '<li class="items-sub-list" title="{{text}}"><span class="menu-icon {{icon}}"><div class="sublist-tips"><span>{{text}}</span></div></li>',
        // <img src="resources/css/imgs/side-tip-arr.png" alt="" class="sublist-tips-arrow">
        size : 3 ,//最大load页面数,设置为1,每次打开页面将覆盖上次已load页面
        target : $(".main-wrap"),//load页面目标容器
        childrenSelector:".items-sub",

        views:null,
        vIndex:0,
        activeView:null,
        defaultMenu:null,
        create:function($menuContainer,options,userdata){
            var _self = this;
            var md =options["menuDef"] ;
            this.$tabs = {};
            this.typeFunc = {
                "iframe" : _self.onIframe,
                "tabs-frame": _self.onTabsFrame,
                "tabs" : _self.onTabs,
                "load" : _self.onTheLoad
            }[options.menuType] || _self.onErrors;
            if(options["size"] ){
                menuCreator.size = options["size"];
            }
            if(options["target"]){
                menuCreator.target = options["target"];
            }
            if(userdata){
                md = menuCreator.createUserMenu(userdata);
            }
            if(md){
                var $ul = $menuContainer;
                for(var i=0;i<md.length;i++){
                    if(!menuCreator.createItem(md[i])){
                        continue;
                    }
                    menuCreator.createItem(md[i]).appendTo($ul);
                }

                menuCreator.m1 = menuCreator.m1f ;
                menuCreator.m1s = menuCreator.m1f ;
                menuCreator.m2 = menuCreator.m2f ;

                if(options.foldContainer){
                    for(var i=0;i<md.length;i++){
                        if(!menuCreator.createItem(md[i])){
                            continue;
                        }
                        menuCreator.createItem(md[i]).appendTo(options.foldContainer);
                    }
                }
                if(menuCreator.defaultMenu){
                    $menuContainer.find("[mid=m-"+ menuCreator.defaultMenu["code"] +"]").click();
                } else {

                }
                //$(".items-sub-list").first().trigger("click");
            }
        },
        onIframe: function(data) {
            if ($(".page-view iframe").length < 1) {
                menuCreator.target.find(".page-view").html('<iframe src="'+ data["page"] +'" frameborder="0" id="f_" scrolling="auto" marginheight="0" marginwidth="0"></iframe>');
            } else {
                menuCreator.target.find(".page-view iframe").attr("src", data["page"]);
            }
        },
        onTabsFrame: function(data) {
            data = this.initTabs(data);
            var tabLen = $("#menu-tabs").wyTabview("getTabNumber");
            if (tabLen <= 1) {
                $("#menu-tabs").wyTabview("add",data);
            } else {

            }
            $("#menu-tabs").wyTabview("add",data);
        },
        onTabs: function(data) {
            data = this.initTabs(data);
            var tabLen = $("#menu-tabs").wyTabview("getTabNumber");
            if (tabLen <= 1) {
                $("#menu-tabs").wyTabview("add",data);
            } else {

            }
            $("#menu-tabs").wyTabview("add",data);
        },
        onTheLoad: function(data) {
            this.showView(data);
        },
        onErrors: function() {
            alert("菜单配置的问题");
        },
        initTabs: function(data) {
            if (data && data.page) {
                if (data.page.indexOf("?")<=0) {
                    data.page += "?";
                };
                if (data.code) {
                    data.page += "&code="+data.code;
                }
            }
            if ($.isEmptyObject(this.$tabs)) {
                menuCreator.target && menuCreator.target.find(".page-view").html('<div id="menu-tabs"><ul><li data-id="'+ data["key"] +'">'+ data["text"] +'</li></ul><div><div><iframe src="'+ data["page"] +'" frameborder="0" id="f_" scrolling="auto" marginheight="0" marginwidth="0"></iframe></div></div></div>');
                this.$tabs = {
                    id: "menu-tabs"
                }
                $("#menu-tabs").wyTabview({
                    navMode:"button"
                });
                $("#menu-tabs .wy-tabview-content").height($("#menu-tabs").height() - $("#menu-tabs .wy-tabview-header").height()-26);
                // $(window).resize(function() {
                //     $("#menu-tabs .wy-tabview-content").height($("#menu-tabs").height() - $("#menu-tabs .wy-tabview-header").height()-6);
                // });
            }
            var tabParam = {
                id: new Date().getTime() + "s",
                title: "默认标签",
                contentType: "iframe",
                content: "",
                closable: true
            };
            if (data && data.page) {
                data = $.extend({},tabParam, {
                    title: data["text"] || "",
                    content: data["page"],
                    id: data["id"],
                    key: data["key"],
                    reload: data["reload"],
                    code: data["code"]
                })
            }

            return data;
        },
        createItem:function(data){
            if(!data){
                return;
            }
            var $item;
            if(data.level && data.level=="1"){
                var children = data.children;
                if(children && children.length > 0){
                    $item = $(menuCreator.fill(menuCreator.m1,data));
                    var $childrenContainer = $item.find(this.childrenSelector);
                    for(var i=0;i<children.length;i++){
                        menuCreator.createItem(children[i]).appendTo($childrenContainer);
                        if(!menuCreator.defaultMenu){
                            if(data["isDefault"] && children[i]["isDefault"]){
                                menuCreator.defaultMenu = children[i] ;
                            }
                        }
                    }
                }else{
                    $item = $(menuCreator.fill(menuCreator.m1s,data));
                }
            }

            if(data.level && data.level=="2"){
                $item = $(menuCreator.fill(menuCreator.m2,data));
            }

            $item.data("data",data);
            menuCreator.bindItemEvent($item);
            return $item ;
        },
        fill:function(html,data){
            for(var k in data){
                html = html.replace(new RegExp("\{\{"+ k +"\}\}","ig"),data[k]);
            }
            return html;
        },
        bindItemEvent:function($item){
            var _self = this;
            var data =$item.data("data");
            if(data.level=="2"){
                $item.click(function(){
                    data = $(this).data("data");
                    if ($.inArray( data.code, window.AppConfig.tabToBrower) > -1) {
                        window.open(data.content || data.page,  "_blank");
                        return;
                    }
                    $(".items-sub-list-active").removeClass("items-sub-list-active");
                    $(this).addClass('items-sub-list-active');
                    //类型分发调用
                    _self.typeFunc.call(_self, data);
                });
            }
            return $item ;
        },
        createUserMenu:function(userdata){
            //TODO:根据用户权限菜单生成

            return menuCreator.options.menuDef ;
        },
        showView:function(data){
            var view = menuCreator.createView(data);

            var destroy = destroy || function() {};
            if(menuCreator.size <= 1){
                if(menuCreator.activeView){
                    if(destroy && typeof destroy == 'function'){
                        destroy();
                    }
                }
                view.attr("vid","v" + data["code"]).load(data["page"]+"?t="+new Date().getTime(), function() {
                    //页面加载完毕时处理页面按钮权限
                    var ibmap = view.find(".ibmap").addClass("not-have");
                    var buttons = data["buttons"];
                    ibmap.each(function(key, element) {
                        for (var ind in buttons) {
                            $(element).hasClass(buttons[ind]) && $(element).removeClass("not-have");
                        }
                    })
                    view.find(".ibmap.not-have").remove();
                });
            }else if(!view.attr("vid")){
                if(menuCreator.activeView)menuCreator.activeView.hide();
                view.attr("vid","v" + data["code"]).load(data["page"]);
            }else if(menuCreator.activeView.attr("vid") != "v"+data["code"]){
                if(menuCreator.activeView)menuCreator.activeView.hide();
                view.show();
            }
            menuCreator.activeView = view ;
        },
        createView:function(data){
            var view ;
            var css = {
                position: "absolute",
                left: "0px",
                bottom: "0px",
                top: "0px",
                right: "0px"
            };
            if(menuCreator.size <= 1){
                view = $(".main-wrap").children(".page-view");
                if(view && view.length > 0){
                    return view ;
                }
                return $("<di class='page-view'></di>").css(css).appendTo(menuCreator.target).load(data["page"],
                    function(responseTxt,statusTxt,xhr) {
                        //页面加载完毕时处理页面按钮权限
                        var ibmap = menuCreator.target.find(".ibmap").addClass("not-have");
                        var buttons = data["buttons"];
                        ibmap.each(function(key, element) {
                            for (var ind in buttons) {
                                $(element).hasClass(buttons[ind]) && $(element).removeClass("not-have");
                            }
                        });
                        menuCreator.target.find(".ibmap.not-have").remove();
                    });
            }


            view = menuCreator.target.find("[vid=v" + data["code"] + "]");
            if(view && view.length > 0){
                return view;
            }

            if(!menuCreator.views){
                menuCreator.views = [];
            }

            view = $("<div class='page-view'></div>").css(css).appendTo(menuCreator.target);

            if(menuCreator.views.length < menuCreator.size){
                menuCreator.views.push(view);
                return view ;
            }

            menuCreator.views[menuCreator.vIndex].remove();
            menuCreator.views[menuCreator.vIndex] = view ;

            menuCreator.vIndex ++ ;
            if(menuCreator.vIndex >= menuCreator.size) {
                menuCreator.vIndex = 0 ;
            }

            return view;
        }
    };

    $.fn.menu = function(options,userdata){
        menuCreator.create($(this),options,userdata);
        $(".items-sub-list").first().trigger("click");
    };

    window.addFrameTabs = function(options) {
        var param = "?";
        if (options.param) {
            for (var key in options.param) {
                param += key +"="+ options.param[key] + "&";
            }
        }
        options.page = options.page + param;
        menuCreator.onTabsFrame(options)
    }
    window.closeFrameTabs = function(options) {
        var options = options || {};
        if(options.key) {
            $("#menu-tabs .wy-tabview-header").find("[data-id='"+ options.key +"']").find(".wy-tabview-tabclose").trigger("click");
        }
    }

    return {
        create: menuCreator
    }
});



