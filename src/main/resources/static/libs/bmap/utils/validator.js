/**
 * Created by hexb on 14-9-20.
 * 改装validation为非form提交验证
 *
 * 如果添加自定义校验
 * 1、为messages添加默认错误时显示的消息
 * 2、添加对应的方法
 * 3、如果需要获取不规则参数，需要在getParam方法中添加自定义的获取参数代码块
 */
define([],function() {
    var wyValidator = {
        options:{
            validateAll:true,
            validatorName:"validator"
        },
        errors:[],
        messages: {
            required: "必填",
            ip:"请输入正确的IP地址",
            email: "邮件格式错误",
            url: "请输入合法的网址",
            now: "日期格式错误",
            date: "日期格式错误",
            number: "请输入数字",
            digits: "只能输入整数",
            mobile:"手机号码格式错误",//只能手机
            phone:"电话号码格式错误",//手机或座机
            creditcard: "请输入合法的信用卡号",
            equalTo: "请再次输入相同的值",
            idCard:"请输入正确的18位证件号",
            accept: "请输入拥有合法后缀名的字符串",
            maxlength: "请输入一个长度最多是 {0} 的字符串",
            minlength: "请输入一个长度最少是 {0} 的字符串",
            rangelength: "请输入一个长度介于 {0} 和 {1} 之间的字符串",
            range: "请输入一个介于 {0} 和 {1} 之间的值",
            max: "请输入一个最大为 {0} 的值",
            min: "请输入一个最小为 {0} 的值",
            format:"输入格式不正确"
        },
        validateSingle:function(target){
            this.errors = [];
            var $target = target instanceof jQuery ? target : $(target);
            var element = $target[0];
            $target.parent().find(".bm-validate-msg").remove();
            var _self = this;
            //1.先校验是否为必填项
            var isnotnull = _self.methods.required(_self.elementValue(element),element);
            if($target.attr("required")){
                //校验下一项 TODO:根据设置判断如果第一项不满足，是否继续检验其它的输入，当前默认为全部校验
                if(!isnotnull){
                    _self.addErrorMsg("required",$target,null);
                    if(this.errors.length>0){
                        for(var i=0;i<this.errors.length;i++){
                            this.showErrorMsg(this.errors[i]);
                        }
                        return false;
                    }
                    return true;
                }
            }
            //2.如果不是为必填项，且输入不为空，则需要检验填入格式
            if(isnotnull){
                var methodName = $target.attr(_self.options.validatorName);
                var method = _self.methods[methodName];
                if(!method){
                    return _self.options.validateAll;
                }
                if(!method(_self.elementValue($target),this,_self.getParam(element))){
                    _self.addErrorMsg($target.attr(_self.options.validatorName),element,_self.getParam(element));
                }
            }
            if(this.errors.length>0){
                for(var i=0;i<this.errors.length;i++){
                    if (this.errors[i].element == element) {
                        this.showErrorMsg(this.errors[i]);
                    }

                }
                return false;
            }
            return true;
        },
        validate:function(target, msgBox, color){
            var _self = this;
            //清除当前错误信息
            this.errors = [];

            if(!target){
                return false;
            }
            var $target = target instanceof jQuery ? target : $(target);
            var elements = $target.find("["+this.options.validatorName+"],[required]");
            this.errors = [];
            elements.each(function(){
                //1.先校验是否为必填项
                var isnotnull = _self.methods.required(_self.elementValue(this), this);
                if($(this).attr("required")){
                    //校验下一项 TODO:根据设置判断如果第一项不满足，是否继续检验其它的输入，当前默认为全部校验
                    if(!isnotnull){
                        _self.addErrorMsg("required",this,null);
                        return _self.options.validateAll;
                    }
                }
                //2.如果不是为必填项，且输入不为空，则需要检验填入格式
                if(isnotnull){
                    var methodName = $(this).attr(_self.options.validatorName);
                    var method = _self.methods[methodName];
                    if(!method){
                        return _self.options.validateAll;
                    }
                    if(!method(_self.elementValue($(this)),this,_self.getParam(this))){
                        _self.addErrorMsg($(this).attr(_self.options.validatorName),this,_self.getParam(this));
                    }
                }
            });

            msgBox && msgBox.html("");
            target.find("td ").removeClass("error-row");
            var msgTitles = target.find("[original-title]");
            msgTitles.css("border", "1px solid #d8d8d8");
            msgTitles.attr("original-title", "");
            msgTitles.tipsy("hide");

            if(this.errors.length>0){
                for(var i=0;i<this.errors.length;i++){
                    var errorElement = this.errors[i].element;
                    $(errorElement).removeClass("first-error-element");
                    this.showErrorMsg(this.errors[i],msgBox,color, target);
                    $(errorElement).blur(function(e) {
                        if (_self.validateSingle(this)) {
                            var msgTitles = $(this);
                            msgTitles.css("border", "1px solid #d8d8d8");
                            msgTitles.attr("original-title", "");
                            msgTitles.tipsy("hide");
                        }
                    });

                }
                $(this.errors[0].element).focus();
                $(this.errors[0].element).addClass("first-error-element");
                $(window).scrollTop(msgBox && msgBox.attr("id"));
                return false;
            }
            $(".bm-validate-msg").remove();
            return true;
        },
        showErrorMsg:function(error,msgBox,color, target){
            var _self = this;
            if(!color){
                color = "#ff0000";
            }
            var ele = $( error.element);
            ele.closest("td").addClass("error-row");
            var text = ele.attr("error-text") ? ele.attr("error-text") :  ele.attr("placeholder");
            var errorMsg = error.msg;
            if(errorMsg=="必填"){
                //original-title
                //errorMsg = (text ? "<span style='color: "+color+"'>"+text+"</span>" : "") + errorMsg ;
            }
            ele.css("border", "1px solid #ff0000");
            ele.attr("original-title", errorMsg);
            ele.tipsy({trigger: 'focus', gravity: 'w'});

            //msgBox && msgBox.append("<span class='bm-validate-msg'><i class='zmdi zmdi-alert-circle-o' style='margin-right: 4px;'></i>"+ errorMsg + "</span>");
            //msgBox || ele.closest("td").append("<span class='bm-validate-msg'><i class='zmdi zmdi-alert-circle-o' style='margin-right: 4px;'></i>"+ errorMsg + "</span>");
        },
        addErrorMsg:function(key,element,param){
            var error = {} ;
            error.key = key ;
            error.element = element ;
            error.param = param ;
            error.msg = $(element).attr("msg") ? this.format($(element).attr("msg"),param) : this.format(this.messages[key],param);
            this.errors.push(error);
        },
        cleanErrorMsg:function(target){
            var $target = target instanceof jQuery ? target : $(target);
            this.errors = [];
            //$target.find(".bm-validate-msg").remove();
            $target.css("border", "0px none");
            $target.attr("original-title", "");
            $target.tipsy("hide");
        },
        format:function( source, params ) {
            if ( arguments.length === 1 ) {
                return source;
            }

            if(!$.isArray(params)){
                var temp = params;
                params = [] ;
                params[0] = temp;
            }

            $.each( params, function( i, n ) {
                source = source.replace( new RegExp( "\\{" + i + "\\}", "g" ), function() {
                    return n;
                });
            });
            return source;
        },
        getParam:function(element){
            var param ;
            if(!element){
                return null;
            }
            var key = $(element).attr(this.options.validatorName);
            switch (key){
                case "rangelength":{
                    param = [];
                    param[0] = $(element).attr("minlength");
                    param[1] = $(element).attr("maxlength");
                    break;
                }
                case "range" :{
                    param = [];
                    param[0] = $(element).attr("min");
                    param[1] = $(element).attr("max");
                    break;
                }
                default :{
                    param = $(element).attr(key);
                }
            }
            return param ;
        },
        /**根据不同的元素获取value*/
        elementValue: function( element ) {
            var val,
                $element = $( element ),
                type = element.type;

            if ( type === "radio" || type === "checkbox" ) {
                return $( "input[name='" + element.name + "']:checked" ).val();
            } else if ( type === "number" && typeof element.validity !== "undefined" ) {
                return element.validity.badInput ? false : $element.val();
            }

            val = $element.val();
            if ( typeof val === "string" ) {
                return val.replace(/\r/g, "" );
            }
            return val;
        },
        checkable: function( element ) {
            return ( /radio|checkbox/i ).test( element.type );
        },
        getLength: function( value, element ) {
            var nodeName = element.nodeName || "";
            switch ( nodeName.toLowerCase() ) {
                case "select":
                    return $( "option:selected", element ).length;
                case "input":
                    if ( this.checkable( element ) ) {
                        return this.findByName( element.name ).filter( ":checked" ).length;
                    }
            }
            return value.length;
        },
        methods: {
            _self: this,
            //检验是否为空
            required: function( value, element ) {
                if ( element.nodeName.toLowerCase() === "select" ) {
                    var val = $( element ).val();
                    if(!val){
                        return false;
                    }
                    return val.length > 0;
                }
                //检验以容器包含的组件，如checkBox
                if($(element).hasClass("bm-check-group")){
                    var v = $(element).find("[name="+ $(element).attr("check-name")+"]:checked").val();
                    if(!v){
                        return false ;
                    }
                    return true ;
                }
                if ( wyValidator.checkable( element ) ) {
                    return wyValidator.getLength( value, element ) > 0;
                }
                return $.trim( value ).length > 0;
            },
            idCard:function(value,element){
                return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d{1}|X|x)$/.test(value);
            },
            email: function( value, element ) {
                return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
            },

            url: function( value, element ) {
                return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test( value );
            },
            mobile:function(value,element){
                return /^((0\d{2,3}\d{6,15})|(1[358]{1}\d{9}))$/.test(value);
            },
            ip:function(value,element){
                var re =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                return re.test(value);
            },
            phone:function(value,element){
                return /^((0\d{2,3})|(\(0\d{2,3}\)))?(-)?[1-9]\d{6,7}(([\-0-9]+)?[^\D]{1})?$/.test(value) || /^((0\d{2,3}\d{6,15})|(1[358]{1}\d{9}))$/.test(value);
            },
            now: function( value, element ) {
                return !/Invalid|NaN/.test( new Date( value ).toString() );
            },

            date: function( value, element ) {
                return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test( value );
            },

            number: function( value, element ) {
                return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
            },

            digits: function( value, element ) {
                return /^\d+$/.test( value );
            },

            creditcard: function( value, element ) {
                if ( /[^0-9 \-]+/.test( value ) ) {
                    return false;
                }
                var nCheck = 0,
                    nDigit = 0,
                    bEven = false,
                    n, cDigit;

                value = value.replace( /\D/g, "" );

                if ( value.length < 13 || value.length > 19 ) {
                    return false;
                }

                for ( n = value.length - 1; n >= 0; n--) {
                    cDigit = value.charAt( n );
                    nDigit = parseInt( cDigit, 10 );
                    if ( bEven ) {
                        if ( ( nDigit *= 2 ) > 9 ) {
                            nDigit -= 9;
                        }
                    }
                    nCheck += nDigit;
                    bEven = !bEven;
                }

                return ( nCheck % 10 ) === 0;
            },

            minlength: function( value, element, param ) {
                var length = $.isArray( value ) ? value.length : wyValidator.getLength( $.trim( value ), element );
                return length >= param - 0;
            },

            maxlength: function( value, element, param ) {
                var length = $.isArray( value ) ? value.length : wyValidator.getLength( $.trim( value ), element );
                return length <= param - 0;
            },

            rangelength: function( value, element, param ) {
                var length = $.isArray( value ) ? value.length : wyValidator.getLength( $.trim( value ), element );
                return ( length >= param[ 0 ] - 0 && length <= param[ 1 ] - 0 );
            },

            min: function( value, element, param ) {
                return value >= param - 0;
            },

            max: function( value, element, param ) {
                return value <= param - 0;
            },

            range: function( value, element, param ) {
                return ( value >= param[ 0 ] && value <= param[ 1 ] );
            },

            equalTo: function( value, element, param ) {
                var target = $( param );
                if ( this.settings.onfocusout ) {
                    target.unbind( ".validate-equalTo" ).bind( "blur.validate-equalTo", function() {
                        $( element ).valid();
                    });
                }
                return value === target.val();
            },
            format:function(value,element,param){
                if(param){
                    var regex = new RegExp(param);
                }
                return regex.test(value);
            }
        }
    };
    return wyValidator;
})

