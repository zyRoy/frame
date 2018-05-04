define(['jquery', 'jqueryui', 'uibase'],function() {
    var wyHelper = window.wyHelper;
    $.widget("bm.bmOrgchart",{
        options:{
            itemRenderer:null, //节点显示渲染
            dataSource:null, //数据源
            simpleData:true ,//是否为线性数据结构，为true时需要先转换为tree数据结构
            vScroll:false, //滚动条配置
            hScroll:false
        },
        _content:null,
        _dsTree:null,//tree数据
        _create:function(){
            this.element.addClass("wy-orgchart");
            this._content = this.element ;

            this._content = wyHelper.scroll(this._content,{
                axis:"xy",
                theme:"dark",
                scrollInertia:0,
                advanced:{
                    autoExpandHorizontalScroll: true,
                    updateOnBrowserResize: true,
                    updateOnContentResize: true
                }
            });

        },
        _init:function(){
            this._content.html("");
            this._dsTree = this.options.simpleData ? wyHelper.getTree(this.options.dataSource) : this.options.dataSource;
            if(this._dsTree && this._dsTree.length==1){
                this._content.append(this._createChartContent(this._dsTree[0],1));
            }else if(!this._dsTree){
                throw new Error("orgchart init error : illegal datasource!");
            }else{
                throw new Error("orgchart init error : datasource must only one root!");
            }
        },
        _bindEvents:function(){

        },
        _createChartContent:function(data,level, pdata){
            var children = data.children ;
            pdata = pdata || {};

            var $table = $('<table cellspacing="0" cellpadding="0" border="0"></table>');
            var $title = $("<div wy-level='" +level+ "' class='orgchart-item wy-ts-bgcolor'></div>");
            if (data.content) {
                $title.html(data.content);
            }
            if(!children || children.length==0){
                $title.addClass("leaf");
            }
            //$title.append(this._getChartItem(data,$title,level));
            var $tr = $("<tr></tr>");
            $("<td></td>").append($title).appendTo($tr);
            $tr.appendTo($table);

            //创建子节点
            if(children && children.length>0){
                var len = children.length ;
                //----1.创建向下的画线
                var downLine;
                $table.find("td").attr("colspan",len * 2);
                if (level !== 1) {
                    downLine = $('<tr><td colspan="' + (len * 2) +'"><div class="orgchart-line down"></div></td></tr>');
                    if (pdata.cl) {
                        downLine.find(".orgchart-line").css("background-color", data.cl)
                    }
                } else {
                    downLine = '<tr><td colspan="' + (len * 2) +'"></td></tr>';
                }
                $table.append(downLine);

                //----2.创建子节点连线
                var nodeLine = $('<tr></tr>');
                //2-1.创建最左侧连线
                var leftLine;
                if(len==1){
                    leftLine = $('<td class="orgchart-line right only-one-child"></td>') ;
                }else{
                    leftLine = $('<td class="orgchart-line right"></td>') ;
                }
                if (data.cl) {
                    leftLine.css("border-color",data.cl);
                }
                nodeLine.append(leftLine);

                //2-2.创建中间连线
                var midLine;
                for(var i=1;i<len*2-1;i++){
                    if(i%2==1){
                        midLine = $('<td class="orgchart-line left top"></td>') ;
                    }else{
                        midLine = $('<td class="orgchart-line right top"></td>') ;
                    }
                    if (data.cl) {
                        midLine.css("border-color",data.cl);
                    }
                    nodeLine.append(midLine);
                }


                //2-3.创建最右侧连线
                var rightLine;
                if(len==1){
                    rightLine = $(' <td class="orgchart-line left only-one-child"></td>') ;
                }else{
                    rightLine = $(' <td class="orgchart-line left"></td>');
                }
                if (data.cl) {
                    rightLine.css("border-color", data.cl);
                }
                nodeLine.append(rightLine);

                $table.append(nodeLine);

                if (level === 1) {
                    nodeLine.css({
                        height: "88px"
                    });
                    nodeLine.addClass("posLine");
                }

                //-----3.创建子节点
                var $tr = $("<tr></tr>");
                var $td;
                for(var i=0;i<len;i++){
                    $td = $("<td colspan='2' class='orgchart-container'></td>");
                    $td.append(this._createChartContent(children[i],level+1, data));
                    $tr.append($td);
                }
                $table.append($tr);
            }

            return $table ;
        },
        _getChartItem:function(data,$item,level){
            return this.options.itemRenderer ? this.options.itemRenderer(data,$item,level) : data["ID"] ;
        }
    });
    return $;
});