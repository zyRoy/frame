define(['jquery','underscore'], function ($,_) {
	var ORM = window.ORM || {};
	//获取资源

	ORM.getRes = function (callback, errorBack) {
        $.ajax({
            type: "get",
            async: false,
            url: window.AppConfig.RemoteApiUrl + "/common/orm/getOrmMenu",
            success: function(data){
                var result = ORM.frmAuth(data);
                callback && callback(result);
                window.AppConfig.authors = result;
            },
            error: function(error){
                errorBack && errorBack(error);
            }
        });
	}

	ORM.frmAuth = function(data) {
		var result;
        var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
            + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
            + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
            + '|' // 允许IP和DOMAIN（域名）
            + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
            + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
            + '[a-z]{2,6})' // first level domain- .com or .museum
            + '(:[0-9]{1,6})?' // 端口- :80
            + '((/?)|' // a slash isn't required if there is no file name
            + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
        var re=new RegExp(strRegex);
        if ($.isArray(data)) {
			result = [];
			for (var i = 0; i < data.length; i ++) {
				var tmpObj = data[i], desc = {};

                if (data[i].children && data[i].children.length > 0) {
                    desc.children = this.frmAuth(data[i].children);
                }

				desc.text = tmpObj.resourceName;
				desc.code = tmpObj.resourceCode;
				desc.id = tmpObj.resourceId;
                desc.key = tmpObj.resourceId;
				desc.pid = tmpObj.parentResId;
                if(tmpObj.resourceUrl!=null){
                    if(tmpObj.resourceUrl.indexOf("http")==-1){
                        desc.page = window.AppConfig.RemoteApiUrl + tmpObj.resourceUrl;
                    }else{
                        desc.page = tmpObj.resourceUrl.replace("/http","http");
                    }
                }


                desc.level = tmpObj.resourceLevel;
                desc.iframe = true;
                desc.isDefault = false;
                desc.icon = 'icon-diqiu';
                desc.baseIcon = tmpObj.resourceIconBase64;
                desc.reload = true;
                result.push(desc);

			}
		} else {
			result = {};

            result.text = data.resourceName;
            result.code = data.resourceCode;
            result.id = data.resourceId;
            result.key = data.resourceId;

            if(data.resourceUrl!=null&&data.resourceUrl.indexOf("http")==-1){
                result.page = window.AppConfig.RemoteApiUrl + data.resourceUrl;
            }else{
                //result.page = data.resourceUrl;
                result.page = data.resourceUrl.replace("/http","http");
            }
            result.level = data.resourceLevel;
            result.iframe = true;
            result.isDefault = false;
            result.icon = 'icon-diqiu';
            result.baseIcon = data.resourceIconBase64;
            result.reload = true;
			if (data.children && data.children.length > 0) {
				result.children = this.frmAuth(data.children);
			}
		}
		return result;

	}


	ORM.getUserInfo = function(callback, errorBack) {
		$.ajax({
			type: "post",
			async: false,
			url: window.AppConfig.RemoteApiUrl + "/common/orm/getUserInfo",
			success: function(data){
				window.loginUser = data;
				callback && callback(data);
			},
			error: function(error){
				errorBack && errorBack(error);
			}
		});

	}

	ORM.userInfo = function() {
		return window.loginUser || parent.window.loginUser;
	}

	ORM.logout = function(service) {
		service = service || window.AppConfig.RemoteApiUrl;
		window.location = window.AppConfig.NRemoteApiUrl+"/logout";
	};

	ORM.toMenuData = function(data) {
		var tempData = [];
		for (var key in data) {
			var tmpObj = data[key];
			//if (tmpObj.code && userAuth[tmpObj.code]) {
			tmpObj.text = data[key].NAME;
			tmpObj.code = data[key].CODE;
			tmpObj.level = data[key].PARENTID == 'ROOT' ? 1 : 2;
			tmpObj.page = data[key].URL;
			tmpObj.iframe = true;
			tmpObj.isDefault = false;
			tmpObj.icon = 'icon-diqiu';
			tmpObj.baseIcon = data[key].BASE64ICON;
			tempData.push(tmpObj);
			//}
		}
		return ORM.getTree(tempData, "ROOT", "ID", "PARENTID");
	}

	ORM.getTree = function(data,pid,idname,pidname) {
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
	};
	ORM.getAuthors = function(code) {
		var result = window.AppConfig.authors;
		if (parent && parent.window && parent.window.AppConfig && parent.window.AppConfig.authors) {
			result = parent.window.AppConfig.authors;
		}
		var tmp;
		if (code) {
			tmp = _.findWhere(result, {code: code});
			if (tmp) {
				result = _.where(result, {pid: tmp.id});
			}
		}
		return result;
	}

		window.ORM = ORM;
	return ORM;
});