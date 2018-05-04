/**
 * Created by mac-pc on 16/7/14.
 */
define(function (require, exports, module) {
    require('bmap');
    var $ = require('jquery');
    var defaultImgSrc = "http://beyondmap.cn/gisapi/resources/images/gis/icon/marker_large.png";

    var mapObj = {};
    var undoManager;
    var mapCenter =  window.AppConfig.mapCenter;
    //定义地图对象
    var options = {
        center: new beyond.geometry.MapPoint(mapCenter.x, mapCenter.y),
        zoom: 7
    }

    function initMap(containerId, callback) {
        //有些地方是地图底图服务用省运管局的或交通厅的，但是lbs服务是自己本地的，所有地址需要重新设置
        //重写gis平台里的lbs地址
        //if(window.AppConfig.lbsUrl!=null&&window.AppConfig.lbsUrl!=""){
        //    GISRequest.LBS_URL = window.AppConfig.lbsUrl;
        //}

        var map = new beyond.maps.Map(containerId, options, callback);
        //加载鹰眼控件
        //map.addControl(new beyond.maps.BOverview());
        //加载显示经纬度控件
        //map.addControl(new beyond.maps.BXYShowControl());
        ////加载显示状态栏控件
        map.addControl(new beyond.maps.BStatusWindow());
        return map;
    }

    function locationStationLine(map,geometryStr,layerid){
        var polylineArray = beyond.maps.GeometryUtil.parseGeometry(geometryStr);
        var polyline = new beyond.maps.BPolyline({
            points: polylineArray,//点对象数组
            strokeColor: "#298cef", //线颜色
            strokeOpacity: 0.6, //线透明度
            strokeWeight: 7, //线粗细度
            isZoomTo: true   //居中放大
        });
        map.addOverlay(polyline,layerid);
        map.setExtent(polyline.getExtent());
    }

    /**
     * 编辑颜色
     * @param map
     * @param geometryStr
     * @param layerid
     */
    function editStationLine(map,geometryStr,layerid){
        var polylineArray = beyond.maps.GeometryUtil.parseGeometry(geometryStr);
        var polyline = new beyond.maps.BPolyline({
            points: polylineArray,//点对象数组
            strokeColor: "#298cef", //线颜色
            strokeOpacity: 0.6, //线透明度
            strokeWeight: 7, //线粗细度
            isZoomTo: true   //居中放大
        });
        map.addOverlay(polyline,layerid);
        polyline.enableEditing();

    }

    function getRootPath(){

        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
        var curWwwPath=window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName=window.document.location.pathname;
        var pos=curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        var localhostPaht=curWwwPath.substring(0,pos);
        //获取带"/"的项目名，如：/uimcardprj
        var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
        return(localhostPaht+projectName);

    }

    /**
     * 导出历史
     * @param map
     * @param carNo
     * @param color
     * @param start
     * @param end
     */
    function historyExpert(map,carNo, color, start, end) {
        map.plugin("beyond.data.CarLbsService", function() {
            car = new beyond.data.CarLbsService();
            //car.setmap(this.$map);
            car.historyExpert(carNo,color, start, end);
        });
    }


    //地图加载完后执行的方法
    function mapLoaded() {
        cmap.plugin("beyond.maps.BOperatingLineComp",init);

        beyond.maps.Map.plugin(["beyond.UndoManager"], function() {
            undoManager = new beyond.UndoManager();
            undoManager.setMap(cmap);
        });
    }
    function init() {
        operatingLineComp = new beyond.maps.BOperatingLineComp();
        operatingLineComp.setMap(cmap);


        $("#setStart").click(function(){
            cmap.setMouseTool(DrawType.MAPPOINT, function (point) {
                operatingLineComp.setStartPoint(point.toGeo());
                cmap.setMouseTool(DrawType.PAN);
            });
        });
        $("#setEnd").click(function(){
            cmap.setMouseTool(DrawType.MAPPOINT, function (point) {
                operatingLineComp.setEndPoint(point.toGeo());
                cmap.setMouseTool(DrawType.PAN);
            });
        });

        $("#calPoint").click(function(){
            var carno = document.getElementById("zoomTxt").value;
            var carcolor = document.getElementById("plateColor").value;
            operatingLineComp.setPlateNo(carno);
            operatingLineComp.setPlateColor(carcolor);

            operatingLineComp.calPoint();
        });
    }




    /**
     * 车辆聚合相关
     * Begin
     */


    function cluster(cmap) {
        var markerClusterer = null;
        var isCustomStyle = true;//使用默认样式
        cmap.clear();
        cmap.plugin("beyond.maps.BCarClusterMarker", function () {
            var options = {};

            //参数为行业类型，0:全行业，1:DANGEROUS、2:PASSAGER、3:TAXI、4:公交、5:教练车，后续如有其它再依此增加
            options.industry = 0;
            options.scode = null;
            options.xcode = null;
            markerClusterer = new beyond.maps.BCarClusterMarker(options);
                markerClusterer.getSingleMarker = function (car) {
                    var html = '<div class="chepai">' + car["plateNo"] + '</div>';
                    //var text = new beyond.maps.BText({"htmlText":html,"offsetX":-34,"offsetY":-17});
                    var text = new beyond.maps.BComplexText({
                        "text": car["plateNo"],
                        "verticalAlign": "middle",
                        "textAlign": "center",
                        "width": 70,
                        "height": 16,
                        "offsetX": -34,
                        "offsetY": -14,
                        "fontSize": 12,
                        "backgroundColor": "#379082",
                        "fontColor": "#ffffff"
                    });
                    var angle = car["direction"];
                    var marker = new beyond.maps.Marker({
                        position: new beyond.geometry.MapPoint(car["X"], car["Y"]),//位置
                        icon: "../../resources/commons/css/imgs/car_blue.png",//图标
                        width: 12,//宽度
                        height: 22,//高度
                        angle: angle,
                        editEnable: true,
                        offsetX: 0,
                        offsetY: 0,
                        btext: text
                    });
                    return marker;
                }
                ////如果需要自定义的话，就重写此方法
                //markerClusterer.addClusterMarker = function (json) {
                //    var source;
                //    var iconSizes = [35, 25, 15, 78, 90];
                //    var width = 35;
                //    var height = 25;
                //    var num = json["NUM"];
                //    if (num < 10) {
                //        source = MapConstant["rootPath"] + "/resources/images/gis/cluster/01.png";
                //        width = 35;
                //        height = 25;
                //    } else if (num >= 10 && num < 100) {
                //        source = MapConstant["rootPath"] + "/resources/images/gis/cluster/02.png";
                //        width = 35;
                //        height = 25;
                //    } else {
                //        width = 35;
                //        height = 25;
                //        source = MapConstant["rootPath"] + "/resources/images/gis/cluster/03.png";
                //    }
                //
                //    var html = '<div style="position: absolute; padding: 0px; margin: 0px; border: 0px; width: 0px; height: 0px;">';
                //    html += '<div style="z-index:10;width:35px;font-weight:bold;position: absolute;color:#FFF;text-align:center;margin-top:1px;margin-left:1px">';
                //    html += num;
                //    html += '</div>';
                //    /*                    html+='<div style="position: absolute; margin: 0px; padding: 0px; width: 34px; height: 23px; overflow: hidden;">';
                //     html+='<img src="'+source+'" style="position:absolute;"/>';
                //     html+='</div>';*/
                //    html += '</div>';
                //
                //    var marker = new beyond.maps.Marker({
                //        "position": new beyond.geometry.MapPoint(json["X"], json["Y"], new beyond.geometry.SpatialReference(4326)),//位置
                //        "icon": source,//图标
                //        "width": width,//宽度
                //        "height": height,//高度
                //        "offsetX": 0,
                //        "offsetY": height / 2,
                //        "content": html
                //    });
                //    //marker.addEventListener();
                //    this.map.addOverlay(marker, "gpsClusterLayer");
                //};
            //}
            cmap.addOverlay(markerClusterer);
        });

        return markerClusterer;
    }



    function clearMarker() {
        if (markerClusterer != null) {
            cmap.removeOverlay(markerClusterer);
        }

    }
    function setIndustry(industry,map) {
        var markerClusterer = cluster(map);
        if (markerClusterer != null) {
            markerClusterer.setIndustry(industry);
        }
    }
    function setScode() {
        var scode = document.getElementById("scode").value;
        if (markerClusterer != null) {
            markerClusterer.setScode(scode);
        }
    }
    function showHandler()
    {
        if (markerClusterer != null) {
            markerClusterer.show();
        }
    }
    function hideHandler()
    {
        if (markerClusterer != null) {
            markerClusterer.hide();
        }
    }
    /**
     * 车辆集合相关
     * End
     */


    /**
     * 车辆聚合   全部车辆
     * vehicleType :
     *      '0':全部车辆
     *      '1':危货
     *      '2':两客
     *      '3':出租
     *      '6':挂车
     *
     */
    function vehicleCluster(vehicleType, map){
        setIndustry(vehicleType,map)
    }


    /**
     * 跟踪一辆车
     * @param carNO 跟踪的车牌号
     * @param map
     * @returns {beyond.maps.CarTrackPlay}
     */
    function trackOneCar(map,carNo, callback, color){
        var trackPlay = null;
        color = color || 2;
        map.plugin("beyond.maps.CarTrackPlay", function(){
            trackPlay = new beyond.maps.CarTrackPlay();
            trackPlay.setMap(map);
            if(trackPlay != null){
                trackPlay.oneTrack(carNo, color, callback);//开始跟踪车辆
            }
        });
        return trackPlay;
    }

   /**
     * 历史轨迹一辆车
     * @param carNO 跟踪的车牌号
     * @param map
     * @returns {beyond.maps.CarTrackPlay}
     */
    function tracePlay(map,carNo, start, end, callback, color){
        var trackPlay = null;
       color = color || 2;
        map.plugin("beyond.maps.CarTrackPlay", function(){
            trackPlay = new beyond.maps.CarTrackPlay();
            trackPlay.setMap(map);
            if(trackPlay != null){
                trackPlay.tracePlay(carNo, color, start, end, callback);//开始跟踪车辆
            }
        });

        return trackPlay;
    }


    /**
     *
     * 清除track中的所有跟踪
     * @param tarcks 数组类型
     * 元素类型为 beyond.maps.CarTrackPlay
     */
    function removeAllTrack(tarcks){

        if(tarcks != null){
            for(var i=0;i<tarcks.length;i++){
                tarcks[i].removeOneTrack();
            }
        }
    }


    /**
     * 向地图添加一个图标
     * @param car
     * @param map
     * @returns {beyond.maps.Marker}
     */
    function addMarker(car,map){

        var marker = new beyond.maps.Marker({
            position: new beyond.geometry.MapPoint(car.x, car.y),//位置,102113
            icon: defaultImgSrc,//图标
            width: 15,//宽度
            height: 24,//高度
            editEnable: true,
            offsetX: 0,
            offsetY: 17,
            data: {"test": "选择点"}
        });
        marker.setDraggable(false);
        map.addOverlay(marker);
        map.setCenter(marker.getPosition());
        return marker;

    }

    /**
     * 打开一个车辆跟踪和轨迹的窗口
     */
    function openTrackWin(options) {
        options = options || {};
        var page = window.AppConfig.RemoteApiUrl + "dynamic-monitor/track-car/index.html";
        var param = "?";
        if (options.data) {
            for (var key in options.data) {
                param += key +"="+ options.data[key] + "&";
            }
        }
        options.page = options.page || page;

        var opts = {
            page: options.page + param,
            text: options.title
        }

        if (options.type == 'tabs' && parent.window.addFrameTabs) {
            parent.window.addFrameTabs(opts);
        } else {
            parent.window.open("../../"+options.page + param, "_blank");
        }
    }

    //行政区划面定位
    function regionArea(map,regionCode,callback){
        var region = new beyond.data.RegionService();
        var name = "";
        var pcode = "";
        var code = regionCode;
        region.regionArea(function(result){
            if (result.getReturnFlag() == 1) {
                var data = result.getData();
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        _addRegion(map,obj);
                    }
                } else {
                    alert(result.getReturnInfo());
                }
            } else {
                alert(result.getReturnInfo());
            }
        }, name, code, pcode);
    }

    function _addRegion(cmap,obj) {
        var polygon = null;
        if (obj.geometryStr) {
            var geometry = decodePoints(obj.geometryStr);
            polygon = new beyond.maps.BPolygon({
                points: geometry,//点对象数组
                strokeColor: "#F33", //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 3, //线粗细度
                fillColor: "#ee2200", //填充颜色
                fillOpacity: 0.1,
                isZoomTo: true
                //填充透明度
            });
            if (cmap && cmap.addOverlay) {
                cmap.addOverlay(polygon);
            }

        }
    }












    return {
        initMap: initMap,
        locationStationLine: locationStationLine,
        editStationLine: editStationLine,
        rootPath: getRootPath(),
        config: options,
        vehicleCluster:vehicleCluster,
        trackOneCar:trackOneCar,
        tracePlay: tracePlay,
        removeAllTrack:removeAllTrack,
        addMarker:addMarker,
        openTrackWin: openTrackWin,
        region: regionArea,
        historyExpert:historyExpert

    }





});