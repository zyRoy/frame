require([
	"jquery",
	"cache",
	'resources/js/menu/menu',
	'menuData',
	'orm_client',
	'mscrollbar'
], function($, Cache, Menu, menuData, ORM){
	ORM.getUserInfo(function(data){
		data = data || {};
		data.userName && $("#loginUserName").html(data.userName);
		if (data.userId && data.userId.toLocaleUpperCase() == 'SYSTEM') {
			data.userId = "";
		}
		data.userName && $("#user-name").html(data.userName);
		if (window.AppConfig.ormClientServer&&'false'!=window.AppConfig.ormClientServer) {
			ORM.getRes(function(data) {
				$("#sideMenu").menu({
					menuDef : data,
					size:1,
					menuType: 'tabs-frame',
					foldContainer:$(".sidebar-fold"),
					target:$(".main-wrap")
				});
			},{userId: data.userId}, function() {
				$("#sideMenu").menu({
					menuDef : menuData,
					size:1,
					menuType: 'tabs-frame',
					foldContainer:$(".sidebar-fold"),
					target:$(".main-wrap")
				});
			});
		} else {
			$("#sideMenu").menu({
				menuDef : menuData,
				size:1,
				menuType: 'tabs-frame',
				foldContainer:$(".sidebar-fold"),
				target:$(".main-wrap")
			});
		}
		$("#logout").click(function() {
			ORM.logout();
		})
	}, function() {
		$("#sideMenu").menu({
			menuDef : menuData,
			size:1,
			menuType: 'tabs-frame',
			foldContainer:$(".sidebar-fold"),
			target:$(".main-wrap")
		});
	});


	$.ajax(window.AppConfig.RemoteApiUrl + "common/codelibrary/getCodeMapData", {
		type: "POST",
		dataType: "json",
		success: function(data){
			if (data || data.data) {
				Cache.setItem("bmCode", data.data);
			}
		}
	});

	//超级管理员
	$(".user-info-admin").click(function(event) {

		$("#nav-more .sub-nav-container-white").hide();
		$("#nav-more").removeClass('nav-more-active');

		var spinner = $(this).find('.spinner'),
			isShow = spinner.css("display");

		if(isShow == "none"){
			spinner.show();
		}else{
			spinner.hide();
		}

	});

	//new Menu({trigger:'#nav-more'});

	$(".sub-nav-content").width($(".subnav-items").length * 160);

	//更多应用
	$("#nav-more").click(function(event) {

		$(".user-info-admin .spinner").hide();

		var sub_nav = $(this).find('.sub-nav-container-white'),
			sub_show = sub_nav.css("display");

		if(sub_show == "none"){

			$(this).addClass('nav-more-active');
			sub_nav.show();

		}else{

			$(this).removeClass('nav-more-active');
			sub_nav.hide();

		}

	});

	document.onclick = function(event){
		var e = event || window.event;
		var elem = e.srcElement || e.target;
		while(elem)
		{
			if(elem.className == "user-info-item user-info-admin" || elem.id == "nav-more"){
				return;
			}
			elem = elem.parentNode;
		}
		$(".spinner").hide();

		$("#nav-more .sub-nav-container-white").hide();
		$("#nav-more").removeClass('nav-more-active');
	}


	$("#sideMenu").on('click', '.items-sec', function(event) {
		var items_sub = $(this).parent().find('.items-sub'),
			items_sub_show = items_sub.css("display");
		if(items_sub_show == "none"){
			$(event.target).closest("li.sidebar-items").find(".items-sec-ico.active").removeClass("active");
			items_sub.show();
		}else{
			$(event.target).closest("li.sidebar-items").find(".items-sec-ico").addClass("active");
			items_sub.hide();
		}
	});

	//左侧菜单栏收缩与展开
	$(".sidebar-btn").click(function(event) {
		var active = $(this).attr("active");
		if(active == "0"){
			$(".sidebar-three").hide();
			$(".main-wrap").css({
				marginLeft:"50px"
			});
			$(this).parents(".col-main").addClass('col-fold');

			$(this).attr('active', '1');
			//$(".digitalplan-panel").css('width',$(".col-main").width() - 330);
			$(".items-sub-list .sidebar-icons").css("margin-left", "15px");
		}else if(active == "1"){
			if($(".menu-three").html()){
				$(".sidebar-three").show().css({
					left:"180px"
				});
				$(".main-wrap").css({
					marginLeft:"360px"
				});
			}else{
				$(".main-wrap").css({
					marginLeft:"180px"
				});
			}
			$(".items-sub-list .sidebar-icons").css("margin-left", "0px");
			$(this).parents(".col-main").removeClass('col-fold');

			$(this).attr('active', '0');
			//$(".digitalplan-panel").css('width',$(".col-main").width() - 460);
		}
	});

	$(".sidebar-items").find(".items-sec").trigger("click");
	$(".sidebar-items").first().find(".items-sec").trigger("click");
	//$(".sidebar-items").first().find(".items-sub-list").first().trigger("click");

	//new Tabs({
	//	element: '.frame-tabs',
	//   triggers: '.frame-tabs-nav li',
	//   panels: '.frame-tabs-content .content-panel',
	//   triggerType:"click",
	//   closeStatus:'&#xe61d;'
	//});

	//$(".content-panel iframe").css('height', $(".main-wrap").height() - 48);

	//$("#tab").wyTabview();

	//解决IE下左侧栏高度不为100%的问题
	if(window.ActiveXObject){
		$(".col-sub").height($(".col-main").height());
	}

	$(window).resize(function() {
		if(window.ActiveXObject){
			$(".col-sub").height($(".col-main").height());
		}
		$(".content-panel iframe").css('height', $(".main-wrap").height() - 48);
	});

	//左侧内容超出显示滚动条
	$(function(){
		$(document).ready(function(){
			$(".col-sub").mCustomScrollbar();
		});
	})

});