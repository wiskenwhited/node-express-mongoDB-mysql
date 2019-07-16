const _ = require('lodash');
const Q = require('q');

const getTestResult = param => {
    const deferred = Q.defer();
    let queryString = `select * from tms_car_test ct where ct.inventory_id = ${param}`;

    mysql.query(queryString, (err, data) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            let testResult = convert(data);
            deferred.resolve(testResult);
        }
    });
    
    return deferred.promise;
}

const meta = [
    {
        category: "排除重大事故检测",
        items: [
            "左前减震器座",
            "右前减震器座",
            "左前纵梁",
            "右前纵梁",
            "防火墙",
            "右A柱",
            "右B柱",
            "右侧顶边梁",
            "右C柱",
            "右D柱",
            "右后翼子板内衬",
            "左后翼子板内衬",
            "后备箱底板",
            "右后纵梁 ",
            "左后纵梁",
            "左D柱",
            "左C柱",
            "左侧顶边梁",
            "左B柱",
            "左A柱"
        ]
    },
    {
        category: "排除泡水火烧检测",
        items: [
            "机舱保险盒",
            "防火墙隔音棉",
            "发动机主线束",
            "座椅滑轨及固定螺丝",
            "车内线束",
            "安全带底部",
            "全车座椅座垫",
            "全车地毯地胶",
            "烟灰缸底座",
            "转向柱"
        ]
    },
    {
        category: "轻微碰撞检测",
        items: [
            "前防撞梁",
            "水箱框架",
            "左前大灯框架",
            "右前大灯框架",
            "左前翼子板内衬",
            "右前翼子板内衬",
            "右侧底大边",
            "右侧驾驶舱底板",
            "右侧尾灯框架",
            "左侧尾灯框架",
            "后围板",
            "后防撞梁",
            "左侧底大边",
            "左侧驾驶舱底板"
        ]
    },
    {
        category: "易损耗部件检测",
        items: [
            "左前减震器",
            "气门室盖垫",
            "发动机油底壳",
            "防冻液液面",
            "机油液面",
            "电瓶（极柱",
            "制动油壶",
            "助力油壶",
            "转向助力泵",
            "水箱水管",
            "水箱",
            "冷凝器",
            "发动机外围皮带",
            "发动机缸垫",
            "变速箱油底壳",
            "右前减震器",
            "右后减震器",
            "左后减震器"
        ]
    },
    {
        category: "安全系统检测",
        items: [
            "驾驶座安全气囊",
            "副驾驶安全气囊",
            "前排侧气囊",
            "后排侧气囊",
            "前排头部气囊",
            "后排头部气囊",
            "胎压监测",
            "中控锁",
            "儿童座椅接口",
            "无钥匙启动",
            "无钥匙进入系统",
            "遥控钥匙",
            "防抱死系统(ABS)",
            "车身稳定控制(ESP)",
            "电子驻车制动"
        ]
    },
    {
        category: "外部配置检测",
        items: [
            "左前轮毂",
            "左前轮胎",
            "前挡风玻璃",
            "右前轮毂",
            "右前轮胎",
            "右后轮毂",
            "右后轮胎",
            "后挡风玻璃",
            "左后轮毂",
            "左后轮胎",
            "全景天窗",
            "感应雨刷",
            "后雨刷",
            "前电动车窗",
            "后电动车窗",
            "后视镜电动调节",
            "后视镜电动折叠",
            "后视镜加热",
            "电动吸合门",
            "后排侧遮阳帘",
            "感应后备箱",
            "电动天窗"
        ]
    },
    {
        category: "内部配置检测",
        items: [
            "皮质座椅",
            "前排座椅加热",
            "座椅通风",
            "驾驶座座椅电动调节",
            "多功能方向盘",
            "定速巡航",
            "GPS导航",
            "倒车雷达",
            "倒车影像系统",
            "手动空调",
            "自动空调",
            "HUD抬头显示",
            "后排座椅加热",
            "空调"
        ]
    },
    {
        category: "灯光系统检测",
        items: [
            "近光灯",
            "远光灯",
            "前转向灯",
            "前雾灯",
            "后转向灯",
            "刹车灯",
            "倒车灯",
            "后雾灯",
            "室内顶灯",
            "氙气大灯",
            "LED大灯",
            "自动头灯",
            "前雾灯",
            "大灯高度可调",
            "大灯清洗"
        ]
    },
    {
        category: "高科技配置检测",
        items: [
            "车道偏离预警系统",
            "自动泊车",
            "盲点辅助系统",
            "全景摄像头",
            "发动机自动启停"
        ]
    },
    {
        category: "随车工具检测",
        items: [
            "千斤顶",
            "灭火器",
            "三角警示标",
            "维修工具包",
            "备胎"
        ]
    },
    {
        category: "仪表台指示灯检测",
        items: [
            "调表车",
            "制动系统指示灯",
            "安全气囊故障灯",
            "车身稳定系统故障灯",
            "发动机故障灯",
            "变速箱故障灯"
        ]
    },
    {
        category: "发动机状态检测",
        items: [
            "发动机总成",
            "启动",
            "怠速 ",
            "发动机抖动",
            "尾气"
        ]
    },
    {
        category: "变速箱及转向检测",
        items: [
            "变速箱总成",
            "变速箱挂挡",
            "转向"
        ]
    }
];

const convert = (data) => {
    delete data[0].id;
    delete data[0].inventory_id;
    
    let obj = data[0];
    let keys = Object.keys(obj);
    let index = 0;
    let testResult = meta.map((val) => {
        let categoryItems = val.items.map(val => {
            let cate = {
                testItemName: val,
                checked: obj[keys[index]] ? obj[keys[index]] : 0
            };
            index++;
            return cate;
        })
        return {
            testCategory: val.category,
            categoryItems: categoryItems
        }
    });
    // // let carStatus = 'http://47.93.99.187/yunce/statichome/images/cxq6.jpg';

    let carStatus = '';
    return {
        testResult,
        carStatus
    };
}

let service = {};
service.getTestResult = getTestResult;

module.exports = service;