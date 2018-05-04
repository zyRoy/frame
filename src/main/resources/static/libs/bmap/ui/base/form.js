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
                //$(this).wyDropdown("selectValue",eval("data."+field+"_VALUE"));
            } else if(eval("data."+field)){
                //$(this).wyDropdown("selectText",eval("data."+field));
            }else{
                //$(this).wyDropdown('selectValue', "");
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
            //$(this).wyDropdown('selectValue', "");
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

