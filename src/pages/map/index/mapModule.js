import axios from 'axios'
import _ from 'lodash'

var PROVINCECITY = {
    '新疆维吾尔自治区': '乌鲁木齐',
    '西藏自治区': '拉萨',
    '内蒙古自治区': '呼和浩特',
    '青海省': '西宁',
    '四川省': '成都',
    '黑龙江省': '哈尔滨',
    '甘肃省': '兰州',
    '云南省': '昆明',
    '广西壮族自治区': '南宁',
    '湖南省': '长沙',
    '陕西省': '西安',
    '广东省': '广州',
    '吉林省': '长春',
    '河北省': '石家庄',
    '湖北省': '武汉',
    '贵州省': '贵阳',
    '山东省': '济南',
    '江西省': '南昌',
    '河南省': '郑州',
    '辽宁省': '沈阳',
    '山西省': '太原',
    '安徽省': '合肥',
    '福建省': '福州',
    '浙江省': '杭州',
    '江苏省': '南京',
    '重庆市': '重庆',
    '宁夏回族自治区': '银川',
    '海南省': '海口',
    '台湾省': '台北',
    '北京市': '北京',
    '天津市': '天津',
    '上海市': '上海',
    '香港特别行政区': '香港',
    '澳门特别行政区': '澳门',
}

var PROVINCES = {
    '新疆维吾尔自治区': Math.random() * 70,
    '西藏自治区': Math.random() * 70,
    '内蒙古自治区': Math.random() * 70,
    '青海省': Math.random() * 70,
    '四川省': Math.random() * 70,
    '黑龙江省': Math.random() * 70,
    '甘肃省': Math.random() * 70,
    '云南省': Math.random() * 70,
    '广西壮族自治区': Math.random() * 70,
    '湖南省': Math.random() * 70,
    '陕西省': Math.random() * 70,
    '广东省': Math.random() * 70,
    '吉林省': Math.random() * 70,
    '河北省': Math.random() * 70,
    '湖北省': Math.random() * 70,
    '贵州省': Math.random() * 70,
    '山东省': Math.random() * 70,
    '江西省': Math.random() * 70,
    '河南省': Math.random() * 70,
    '辽宁省': Math.random() * 70,
    '山西省': Math.random() * 70,
    '安徽省': Math.random() * 70,
    '福建省': Math.random() * 70,
    '浙江省': Math.random() * 70,
    '江苏省': Math.random() * 70,
    '重庆市': Math.random() * 70,
    '宁夏回族自治区': Math.random() * 70,
    '海南省': Math.random() * 70,
    '台湾省': Math.random() * 70,
    '北京市': Math.random() * 70,
    '天津市': Math.random() * 70,
    '上海市': Math.random() * 70,
    '香港特别行政区': Math.random() * 70,
    '澳门特别行政区': Math.random() * 70,
}

var baiduMapModule = {
    map: null,
    removeMap: function () {
        if (this.map) {
            this.map.removeEventListener('zoomend', this.zoomEnd, true)
            this.map = null
        }
    },
    changeMapType: function (type) {
        this.map.clearOverlays()
        if (type == 'init') {
            this.map.setMinZoom(5)
            this.map.setMaxZoom(6)
            return
        }
        if (type == 'province') {
            this.map.setMinZoom(6)
            this.map.setMaxZoom()
        }
    },
    init: function (myLevel) {
        var level = myLevel || 5
        // 百度地图API功能
        this.removeMap()
        var map = new BMap.Map("map", {
            minZoom: 5,
            maxZoom: 6,
            enableMapClick: false
        });
        this.map = map
        // 创建Map实例
        map.centerAndZoom(new BMap.Point(106.962497, 38.208726), level); // 初始化地图,设置中心点坐标和地图级别
        map.enableScrollWheelZoom(false); // 开启鼠标滚轮缩放
    },
    changeProvinceView: function (provinceName) {
        var self = this;
        var cityCenter = mapv.utilCityCenter.getCenterByCityName(PROVINCECITY[provinceName]);
        if (!cityCenter) {
            return
        }
        this.removeMap()
        var map = new BMap.Map("map", {
            minZoom: 6
        });
        this.map = map
        map.centerAndZoom(new BMap.Point(cityCenter.lng, cityCenter.lat), 8); // 初始化地图,设置中心点坐标和地图级别
        map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
        map.addEventListener("zoomend", this.zoomEnd);
        setTimeout(function () {
            self.getProvinceBoundary(provinceName)
        }, 1000);
    },
    zoomEnd: function (e) {
        var level = e.target.Oa
        if (level == 6) {
            baiduMapModule.backToInit()
        }
        console.log(level)
    },
    getProvinceBoundary: function (province) {
        var bdary = new BMap.Boundary();
        var map = this.map
        bdary.get(province, function (rs) { //获取行政区域
            map.clearOverlays(); //清除地图覆盖物       
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                alert('未能获取当前输入行政区域');
                return;
            }
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {
                    strokeWeight: 3,
                    strokeColor: "#ff0000",
                    fillColor: null
                }); //建立多边形覆盖物
                ply.setFillColor()
                map.addOverlay(ply); //添加覆盖物
            }
        });
    },
    backToInit: function () {
        // this.init(6)
        this.changeMapType('init')
        countryModule.init()
    }
}

var countryModule = {
    init: function () {
        var map = baiduMapModule.map;
        var provinces = PROVINCES
        var provinceCities = PROVINCECITY
        axios.get('https://www.easy-mock.com/mock/5a4de8ddd15d983e1a86ef37/baiduMap/china').then(function(res) {
            return res.data
        }).then(function (geojson) {

            var dataSet = mapv.geojson.getDataSet(geojson);

            var data = dataSet.get({
                filter: function (item) {
                    if (!provinces[item.name]) {
                        return false;
                    }

                    item.count = provinces[item.name];
                    return true;
                }
            });

            dataSet = new mapv.DataSet(data);

            var options = {
                splitList: [{
                    start: 0,
                    end: 10,
                    value: '#f1eef6'
                }, {
                    start: 10,
                    end: 20,
                    value: '#d5bad9'
                }, {
                    start: 20,
                    end: 30,
                    value: '#cc97c7'
                }, {
                    start: 30,
                    end: 40,
                    value: '#e469af'
                }, {
                    start: 40,
                    end: 50,
                    value: '#ee3387'
                }, {
                    start: 50,
                    end: 60,
                    value: '#d61e53'
                }, {
                    start: 60,
                    value: '#960b3d'
                }],
                methods: {
                    click: function (item) {
                        provinceModule.chooseProvince(item)
                    },
                    mousemove: function (item) {
                        item = item || {};
                        var data = dataSet.get();
                        for (var i = 0; i < data.length; i++) {
                            if (item.id == data[i].id) {
                                data[i].fillStyle = 'yellow';
                            } else {
                                data[i].fillStyle = null;
                            }
                        }
                        dataSet.set(data);
                    }
                },
                globalAlpha: 0.5,
                draw: 'choropleth'
            }

            var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);

        });


        var cities = _.values(provinceCities)
        var data = [];
        var provinceName = [];

        for (var i = 0; i < cities.length; i++) {
            var key = cities[i]
            var cityCenter = mapv.utilCityCenter.getCenterByCityName(key);
            if (cityCenter) {
                data.push({
                    //   text: key,
                    text: (Math.random() * 300).toFixed(0),
                    geometry: {
                        type: 'Point',
                        coordinates: [cityCenter.lng, cityCenter.lat]
                    }
                });
            }
        }

        var dataSet = new mapv.DataSet(data);

        var options = {
            fillStyle: 'rgba(255, 255, 255, 0.4)',
            shadowColor: 'rgba(255, 255, 255, 0.5)',
            shadowBlur: 10,
            size: 23,
            zIndex: 10,
            draw: 'simple'
        }

        var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);

        var options = {
            fillStyle: 'rgba(55, 50, 50, 0.8)',
            shadowColor: 'rgba(55, 50, 50, 0.5)',
            //   offset: {
            //       x: 0,
            //       y: -10
            //   },
            shadowBlur: 10,
            size: 13,
            zIndex: 10,
            draw: 'text'
        }
        var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
    }
}

var provinceModule = {
    chooseProvince: function (item) {
        if (!item) {
            return
        }
        var map = baiduMapModule.map;
        baiduMapModule.changeProvinceView(item.name)
    }
}

export default {
    baiduMapModule: baiduMapModule,
    countryModule: countryModule,
    provinceModule: provinceModule
}