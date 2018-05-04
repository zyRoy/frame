require([
     "jquery"
    ,"resources/js/nav"
    ,"layer"
],function(){
    // layer.config({
    //     path: '/libs/core/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
    // });
    this.lcdMapCode = null;
    Date.prototype.Format = function(fmt) {
        var o = {
           "M+" : this.getMonth()+1,                    //�·�
           "d+" : this.getDate(),                       //��
           "h+" : this.getHours(),                     //Сʱ
           "m+" : this.getMinutes(),                  //��
           "s+" : this.getSeconds(),                  //��
           "q+" : Math.floor((this.getMonth()+3)/3), //����
           "S"  : this.getMilliseconds()             //����
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
         for(var k in o){
             if(new RegExp("("+ k +")").test(fmt))
                 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
        return fmt;
    }

    var url = document.URL;
    var temp1 = url.indexOf("/", 9);
    var temp2 = url.indexOf("/", temp1 + 1);
    var gisRootPath = url.substr(0, temp2 + 1);
    window.AppConfig.NRemoteApiUrl = gisRootPath;
    window.AppConfig.RemoteApiUrl = gisRootPath;
    $.ajax({
        type:"post",
        url:gisRootPath+"/common/orm/getUserInfo",
        success:function(data){
            window.$userInfo=data;
            $(".user-info-admin>span").html(data.userName);
        },
        error:function(err){
            layer.msg("获取登录信息失败")
        }

    })
    if (window.AppConfig.title) {
        $(".header .logo h1").html(window.AppConfig.title);
        $("title").html(window.AppConfig.title);
    }
    // 退出
      $("#loginout").click(function() {
        ORM.logout();
/*        $.ajax({
            url:window.AppConfig.RemoteApiUrl+'userInfo/exit',
            type:'post',
            success:function(result){
                if(result&&result.returnFlag=='1'){
                    window.location.replace('./logout');
                }else{
                    window.location.replace('./logout');
                }
            },
            error:function(){
                window.location.replace('./logout');
            }
        })*/
    })
    $.ajax({
        type:"post",
        url:gisRootPath+"/common/orm/getUserInfo",
        success:function(data){
            window.$userInfo=data;
            $(".user-info-admin>span").html(data.userName);
        },
        error:function(err){
            layer.msg("获取登录信息失败")
        }

    })
});