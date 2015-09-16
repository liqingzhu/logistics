/**
 * Created by LQZ on 2015/8/29.
 */
var directiveModule = angular.module("Directive", []);
directiveModule.directive("youhuiMapOrder", function () {
    return {
        restrict: "E",
        replace: true,
        template: "<div id='allMap'></div>",
        controller:['$state','$scope','$stateParams','$http','UserService','OrderListService',function($state,$scope,$stateParams,$http,UserService,OrderListService){
            var obj = {id:$stateParams.orderid};
            OrderListService.getOrderDetail(obj)
                .then(
                function(data){
                    if(angular.isObject(data)){
                        var order = data;
                        var map = new BMap.Map("allMap") ;
                        map.addControl(new BMap.ZoomControl());
                        // 创建地址解析器实例
                        var myGeo = new BMap.Geocoder();
                        //设置百度地图图标
                        var houseicon = new BMap.Icon(
                            "http://121.199.37.124/flj_sz/static/images/ud.png",
                            new BMap.Size(100,120),{
                                imageOffset: new BMap.Size(8,15)
                            }
                        );
                        var stufficon = new BMap.Icon(
                            "http://121.199.37.124/flj_sz/static/images/uo.png",
                            new BMap.Size(100,120),{
                                imageOffset: new BMap.Size(8,15)
                            }
                        );
                        var manicon = new BMap.Icon(
                            "http://121.199.37.124/flj_sz/static/images/up.png",
                            new BMap.Size(100, 120),{
                                imageOffset: new BMap.Size(8,15)
                            }
                        );
                        /*console.log(orders);
                         console.log(orders.length);*/
                        //获取派送员地理位置信息
                        var manlocation = JSON.parse(localStorage.getItem('deliverymanlocation'));
                        var manpoint = new BMap.Point(manlocation.longitude,manlocation.latitude);
                        //添加一个Mark节点给快递员进行添加
                        var manmark = new BMap.Marker(manpoint,{icon:manicon});
                        map.addOverlay(manmark);

                        //商家坐标
                        var sellpoint = new BMap.Point(order.sellerlongitude,order.sellerlatitude);
                        //添加一个Mark节点给快递员进行添加
                        var sellmark = new BMap.Marker(sellpoint,{icon:stufficon});
                        map.addOverlay(sellmark);
                        //买家坐标
                        var buypoint = new BMap.Point(order.buyerlongitude,order.buyerlatitude);
                        //添加一个Mark节点给快递员进行添加
                        var buymark = new BMap.Marker(buypoint,{icon:houseicon});
                        map.addOverlay(buymark);

                        var frommantostuffline = new BMap.Polyline([
                            manpoint,
                            sellpoint
                        ], {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});
                        map.addOverlay(frommantostuffline);

                        var fromsutfftohouseline = new BMap.Polyline([
                            sellpoint,
                            buypoint
                        ], {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});
                        map.addOverlay(fromsutfftohouseline);

                        //设置地图中心点以及比例尺
                        map.centerAndZoom(manpoint,15);
                    }
                }
            );
        }],
        link: function (scope, element, attrs) {
            //编辑指令信息
        }
    }
});

directiveModule.directive("youhuiMap", function () {
    return {
        restrict: "E",
        replace: true,
        template: "<div id='allMap'></div>",
        controller:function($state,$scope,$stateParams,$http,UserService,TaskService){
            var obj = {id:$stateParams.taskid};
            TaskService.queryTaskForDetail(obj)
                .then(
                function(data){
                    if(data.success){
                        var orders = data.result;
                        var map = new BMap.Map("allMap") ;
                        map.addControl(new BMap.ZoomControl());
                        // 创建地址解析器实例
                        var myGeo = new BMap.Geocoder();
                        //设置百度地图图标
                        var stufficon = new BMap.Icon(
                            "http://121.199.37.124/flj_sz/static/images/uo.png",
                            new BMap.Size(100,120),{
                                imageOffset: new BMap.Size(8,15)
                            }
                        );
                        var manicon = new BMap.Icon(
                            "http://121.199.37.124/flj_sz/static/images/up.png",
                            new BMap.Size(100, 120),{
                                imageOffset: new BMap.Size(8,15)
                            }
                        );
                        /*console.log(orders);
                        console.log(orders.length);*/
                        //获取派送员地理位置信息
                        var manlocation = JSON.parse(localStorage.getItem('deliverymanlocation'));
                        var manpoint = new BMap.Point(manlocation.longitude,manlocation.latitude);
                        //添加一个Mark节点给快递员进行添加
                        var manmark = new BMap.Marker(manpoint,{icon:manicon});
                        map.addOverlay(manmark);
                        //便利运单信息添加点到地图上面
                        angular.forEach(orders,function(order,obj){
                            var address = order.selleraddr;
                            myGeo.getPoint(address, function(point){
                                if (point) {
                                    //画线
                                    var polyline = new BMap.Polyline([
                                        manpoint,
                                        point
                                    ], {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});
                                    map.addOverlay(new BMap.Marker(point,{icon:stufficon}));
                                    map.addOverlay(polyline);
                                }
                            }, "");
                        });
                        //添加地图描述
                        var opts = {
                            width : 100,    // 信息窗口宽度
                            height: 30,     // 信息窗口高度
                            title : "", // 信息窗口标题
                            enableAutoPan : true //自动平移
                        }
                        var msg = "地图上有"+orders.length+"个运单!";
                        var infoWindow = new BMap.InfoWindow(msg, opts);  // 创建信息窗口对象
                        manmark.addEventListener("click", function(){
                            map.openInfoWindow(infoWindow,manpoint); //开启信息窗口
                        });
                        setTimeout(function(){
                            map.openInfoWindow(infoWindow,manpoint);
                        },200);
                        //设置地图中心点以及比例尺
                        map.centerAndZoom(manpoint,15);
                    }
                }
            );
        },
        link: function (scope, element, attrs) {
            //编辑指令信息
        }
    }
});

directiveModule.directive('youhuiTimeCal',
    function(){
        var obj = {
            restrict:'EA',
            replace:true,
            transclude:true,
            scope:{
                timeInfo:'=timedetail'
            },
            template:'<span>{{timeInfo}}</span>',
            link:function(scope,element,attrs){
                var convert2Time = function(timeInfo){
                    var starttime = new Date(timeInfo.replace(/-/g,'/'));
                    var endtime = new Date();
                    var millseconds = parseInt(Math.abs(endtime-starttime));
                    var str = "";
                    var info = parseFloat(millseconds/(1000*3600*24*365));
                    if(info>1){
                        str = Math.floor(info) +"年前";
                    }else{
                        info = parseFloat(millseconds/(1000*3600*24*30));
                        if(info>1){
                            str = Math.floor(info)+"月前";
                        }else{
                            info = parseFloat(millseconds/(1000*3600*24*7));
                            if(info>1){
                                str = Math.floor(info)+"周前";
                            }else{
                                info=parseFloat(millseconds/(1000*3600*24));
                                if(info>1){
                                    str = Math.floor(info) + "天前";
                                }else{
                                    info = parseFloat(millseconds/(1000*3600));
                                    if(info>1){
                                        str = Math.floor(info) +"小时前";
                                    }else{
                                        info = parseFloat(millseconds/(1000*60));
                                        if(info>1){
                                            str = Math.floor(info)+"分钟前";
                                        }else{
                                            str = "刚刚";
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return str;
                };
                scope.timeInfo = convert2Time(scope.timeInfo);
            }
        };
        return obj;
    }
);