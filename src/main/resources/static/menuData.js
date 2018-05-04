define([],function() {

    var menuData = [
        {
            text: "两客一危",
            code: "01",
            level: "1",
            image: "resources/commons/css/imgs/sidebar-1.png",
            icon:"icon-gongjiaoche green",
            isDefault: false,
            children: [
                {
                    key: '0111',
                    text: "客运实时分布",
                    code: "0101",
                    level: "2",
                    page: "dynamic-monitor/controlLayer/index.html?industry=011,012",
                    isDefault: false,
                    iframe: true
                },
                {
                    key: '0112',
                    text: "货运实时分布",
                    code: "0101",
                    level: "2",
                    page: "dynamic-monitor/controlLayer/index.html?industry=021,030",
                    isDefault: false,
                    iframe: true
                }
            ]
        },

        {
            text: "行业总体",
            code: "02",
            level: "1",
            image: "resources/commons/css/imgs/sidebar-1.png",
            icon:"icon-gongjiaoche green",
            isDefault: false,
            //
            children: [
                {
                    key: '0201',
                    text: "实时分布",
                    code: "0101",
                    level: "2",
                    page: "dynamic-monitor/controlLayer/index.html?industry=011,012,030,021,080,090&layer=SP_KYQY,SP_HYQY,SP_WXQY,SP_JPQY,SP_KYZ,SP_ZXCTKD",
                    isDefault: false,
                    iframe: true
                },
                {
                    key: '0202',
                    text: "车辆查询",
                    code: "0110",
                    level: "2",
                    page: "dynamic-monitor/query-one-car/index.html?industry=010,011,012,021,030,031,032",
                    isDefault: false,
                    iframe: true
                },
                {
                    key: '0203',
                    text: "多车跟踪",
                    code: "0110",
                    level: "2",
                    page: "dynamic-monitor/query-more-car/index.html?industryType=010,011,012,030,031,032",
                    isDefault: false,
                    iframe: true
                }
            ]
        },

        {
            text: "出租车",
            code: "03",
            level: "1",
            image: "resources/commons/css/imgs/sidebar-1.png",
            icon:"icon-gongjiaoche green",
            isDefault: false,
            children: [
                {
                    key: '0301',
                    text: "实时分布",
                    code: "0101",
                    level: "2",
                    //page: "dynamic-monitor/dynamicData/index.html?industry=090",
                    page: "dynamic-monitor/dynamicData/index.html?industry=090",

                    isDefault: false,
                    iframe: true
                },
                {
                    key: '0302',
                    text: "车辆查询",
                    code: "0110",
                    level: "2",
                    page: "dynamic-monitor/query-one-car/index.html?industry=090",
                    isDefault: false,
                    iframe: true
                },
                {
                    key: '0303',
                    text: "多车跟踪",
                    code: "0110",
                    level: "2",
                    page: "dynamic-monitor/query-more-car/index.html?industryType=090",
                    isDefault: false,
                    iframe: true
                },
                {
                    key: '0305',
                    text: "定时定位",
                    code: "0110",
                    level: "2",
                    page: "dynamic-monitor/taxi-dsdw/dsdw.html",
                    isDefault: false,
                    iframe: true
                },
                {
                    key: '0306',
                    text: "异常聚集",
                    code: "0110",
                    level: "2",
                    page: "dynamic-monitor/abnormalTogether/index.html",
                    isDefault: false,
                    iframe: true
                }
            ]
        },

        {
            text: "公交车",
            code: "04",
            level: "1",
            image: "resources/commons/css/imgs/sidebar-1.png",
            icon:"icon-gongjiaoche green",
            isDefault: false,
            children: [
                {
                    key: '0401',
                    text: "城市公交车",
                    code: "0401",
                    level: "2",
                    // page: "http://172.16.100.253:38182/dynamic-monitor/DynamicMonitor/monitor/page/busmap.html",
                    page: "dynamic-monitor/city-bus/index.html",
                    isDefault: false,
                    iframe: true
                },
                {
                    key: '0402',
                    text: "车辆查询",
                    code: "04",
                    level: "2",
                    page: "dynamic-monitor/query-one-car/index.html?industry=080",
                    isDefault: false,
                    iframe: true
                }
            ]
        },

        {
            text: "自行车",
            code: "05",
            level: "1",
            image: "resources/commons/css/imgs/sidebar-1.png",
            icon:"icon-gongjiaoche green",
            isDefault: false,
            children: [
                {
                    key: '0501',
                    text: "公共自行车",
                    code: "0501",
                    level: "2",
                    page: "dynamic-monitor/public-bicycle/index.html",
                    isDefault: false,
                    iframe: true
                }
            ]
        },

        {
            text: "嘉兴",
            code: "09",
            level: "1",
            image: "resources/commons/css/imgs/sidebar-1.png",
            icon:"icon-gongjiaoche green",
            isDefault: false,
            children: [
                {
                    key: '0901',
                    text: "入嘉",
                    code: "0202",
                    level: "2",
                    icon: "iconfont icon-xieyi",
                    page: "dynamic-monitor/new-monitor/index.html",
                    isDefault: false,
                    iframe: true
                },
                {
                    key: '0902',
                    text: "异常处理",
                    code: "0102",
                    level: "2",
                    page: "dynamic-monitor/exception-handling/index.html?industyType=010,011,012,030",
                    isDefault: false,
                    iframe: true
                },
                {
                    key: '0904',
                    text: "异常处理结果",
                    code: "0104",
                    level: "2",
                    page: "dynamic-monitor/exception-handling-result/index.html?industyType=010,011,012,030",
                    isDefault: false,
                    iframe: true
                },
                {
                    key: '0905',
                    text: "异常处理统计",
                    code: "0105",
                    level: "2",
                    page: "dynamic-monitor/exception-handling-statistical/index.html",
                    isDefault: false,
                    iframe: true
                },
                {
                    key: '0907',
                    text: "异常处理(厦门)",
                    code: "0107",
                    level: "2",
                    page: "dynamic-monitor/exception-query/index.html",
                    isDefault: false,
                    iframe: true
                },
                {
                    key: '0908',
                    text: "异常统计(厦门)",
                    code: "0108",
                    level: "2",
                    page: "dynamic-monitor/exception-statistical/index.html",
                    isDefault: false,
                    iframe: true
                },
                {
                    key: '0909',
                    text: "一辆车追踪",
                    code: "0109",
                    level: "2",
                    page: "dynamic-monitor/track-one-car/index.html",
                    isDefault: false,
                    iframe: true
                }
            ]
        },
        {
            text: "系统配置",
            code: "10",
            level: "1",
            image: "resources/commons/css/imgs/sidebar-1.png",
            icon:"icon-gongjiaoche green",
            isDefault: false,
            children: [
                {
                    key: '0901',
                    text: "参数配置",
                    code: "0202",
                    level: "2",
                    icon: "iconfont icon-xieyi",
                    page: "dynamic-monitor/paramConfig/paramConfig.html",
                    isDefault: false,
                    iframe: true
                }
            ]
        }
    ];

    return menuData || [];
})



