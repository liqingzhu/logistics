//window.baseUrl = 'http://127.0.0.1/easygo';
// console.log("111111111111===========");
window.baseUrl = 'http://www.qhdsx.com:9876/yougo';
// 友惠URL
window.YOU_HUI_BaseUrl = 'http://joke.qhdsx.com/logistics';
//window.YOU_HUI_BaseUrl = 'http://127.0.0.1:8081/logistics';
//window.YOU_HUI_BaseUrl = 'http://172.27.35.1:8081/youhui';
//window.YOU_HUI_BaseUrl = 'http://192.168.1.107:8081/youhui';
angular.module('ionic.ion.autoListDivider',[]).directive('autoListDivider', ['$timeout',function($timeout) {
    var lastDivideKey = "";
    return {
        link: function(scope, element, attrs) {
            var key = attrs.autoListDividerValue;

            var defaultDivideFunction = function(k){
                return k.slice( 0, 1 ).toUpperCase();
            }
            var doDivide = function(){
                var divideFunction = scope.$apply(attrs.autoListDividerFunction) || defaultDivideFunction;
                var divideKey = divideFunction(key);

                if(divideKey != lastDivideKey) {
                    var contentTr = angular.element("<div class='item item-divider'>"+divideKey+"</div>");
                    element[0].parentNode.insertBefore(contentTr[0], element[0]);
                }

                lastDivideKey = divideKey;
            }
            $timeout(doDivide,0);
        }
    }
}]);
var app = angular.module('starter', [
  'ionic',
  'LogisticModule',
  'UserModule',
  'TasksModule',
  'Directive',
  'services.lp',
  'services.taskservice',
  'services.user',
  'ngCordova'
  ]);
app.run(['$ionicPlatform','$interval','UserService',function($ionicPlatform,$interval,UserService) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
    $interval(function () {
        //每五秒钟检查一次快递员的定位,同步至数据库
        UserService.setPostManLocation();
    }, 1000*60*5);


  });
}]).config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider','$httpProvider',
    function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider) {
         $ionicConfigProvider.setPlatformConfig('android',{
      tabs:{
        style:'standard',
        position:'bottom'
      }
    });
}]);

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
//console.log('prodive');

var logisticModule = angular.module("LogisticModule", []);
logisticModule.controller('MainMenuCtrl',['$state','$scope','$http','UserService',
	function($state,$scope, $http,UserService){
		var vm = $scope.vm = {};
		vm.checkuserinfo = function(){
			console.log("在主菜单中调用数据信息!");
			var user = UserService.getDeliveryMan();
			//alert('useris = '+JSON.stringify(user));
			//console.log('useris = '+user);
			if(user==null||!user){
				console.log('useris = '+user);
				$state.go('signin');
			}
		};
		vm.checkuserinfo();
	}
]);
logisticModule.controller('SignInCtrl',['$state','$scope','$http','UserService',
	function($state,$scope, $http,UserService){
		var vm = $scope.vm = {};
		vm.btnsendsms = {
			disabled:false,
			text:'获取验证码',
			count:60
		};
		vm.user = {
			phone:'',
			password:'',
			verfcode:''
		};
		vm.signin = function(){
			vm.vaildatetext = '';
			var tel = vm.user.phone; //获取手机号
			if(tel==null||tel==''){
				vm.vaildatetext = '请您填写手机号码!';
				return;
			}
			var telReg = !!tel.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
			//如果手机号码不能通过验证
			if(telReg == false){
				vm.vaildatetext = '手机号码不正确!';
				return;
			}
			if(vm.user.password==null||vm.user.password==''){
				vm.vaildatetext = '请您填写注册密码!';
				return;
			}
			if(vm.user.password.length>=8){
				vm.vaildatetext = '密码字符长度不能超过8位!';
				return;
			}
			UserService.signIn(vm.user)
				.then(function(data){
					if(data.success){
						//console.log('登陆成功 跳转到登陆界面进行登陆');
						localStorage.setItem("deliveryman",JSON.stringify(data.result));
						$state.go('app.needlist');
						//$state.go('app.mydeliverylist');
						console.log('登陆成功 跳转到登陆界面进行登陆');
						//var man = UserService.getDeliveryMan();
						//console.log('======登陆后查看对应的man====');
						//console.log(man);
						//$state.go('app');
						//页面跳转 保存localstorage
					}else{
						vm.vaildatetext = '用户名或密码不正确,请重试!';
						//console.log('登陆失败 弹窗对话框 告诉用户具体原因');
					}
				}
			);
		}
	}
]);
logisticModule.controller('SignUpCtrl',['$cordovaAppVersion','$interval','$state','$scope','$http','UserService',
	function($cordovaAppVersion,$interval,$state,$scope, $http,UserService){
		var vm = $scope.vm = {};
		vm.btnsendsms = {
			disabled:false,
			text:'获取验证码',
			count:60
		};
		vm.user = {
			phone:'',
			password:'',
			verifycode:''
		}
		vm.sendSms = function(){
			vm.vaildatetext = '';
			if(vm.user.phone==null||vm.user.phone==''){
				vm.vaildatetext = '请您填写手机号码!';
				return;
			}
			var tel = vm.user.phone; //获取手机号
			var telReg = !!tel.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
			//如果手机号码不能通过验证
			if(telReg == false){
				vm.vaildatetext = '手机号码不正确!';
				return;
			}
			vm.btnsendsms.disabled = true;
			UserService.findPhoneOnly(vm.user)
				.then(function(data){
					//console.log('验证电话是否存在！');
					if(data.success&&data.code=='101'){
						//console.log(data);
						UserService.sendSms(vm.user)
							.then(function(data){
								//console.log("是否收到验证码");
								//console.log(data);
								if(data.success){
									var promise = $interval(function(){
											vm.btnsendsms.count --;
											vm.btnsendsms.text = vm.btnsendsms.count+'秒后重新发送';
											if(vm.btnsendsms.count==0){
												vm.btnsendsms = {
													disabled:false,
													text:'获取验证码',
													count:60
												};
												$interval.cancel(promise);
											}
										},
										1000
									);
									$scope.$on('$destroy',function(){
										$interval.cancel(promise);
									});
								}else{
									if(data.code=='101'){
										vm.vaildatetext = '该用户已经存在!';
									}else{
										vm.vaildatetext = '系统问题，请联系客服!';
									}
									vm.btnsendsms.disabled = false;
								}
						});
					}else{
						vm.vaildatetext = '该用户手机已经注册!';
					}
				});
		};
		vm.signup = function(){
			var tel = vm.user.phone; //获取手机号
			if(tel==null||tel==''){
				vm.vaildatetext = '请您填写手机号码!';
				return;
			}
			var telReg = !!tel.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
			//如果手机号码不能通过验证
			if(telReg == false){
				vm.vaildatetext = '手机号码不正确!';
				return;
			}
			if(vm.user.password==null||vm.user.password==''){
				vm.vaildatetext = '请您填写注册密码!';
				return;
			}

			if(vm.user.password.length>=8){
				vm.vaildatetext = '密码字符长度不能超过8位!';
				return;
			}
			if(vm.user.verifycode==null||vm.user.verifycode==''){
				vm.vaildatetext = '请您填写验证码!';
				return;
			}
			$cordovaAppVersion.getAppVersion().then(function (version) {
				//如果本地与服务端的APP版本不符合
				vm.user.appversion = version;
				UserService.signUp(vm.user)
					.then(function(data){
						if(data.success){
							console.log('注册成功 跳转到登陆界面进行登陆');
							vm.vaildatetext = '系统注册成功!';
							UserService.signIn(vm.user).then(
								function(data){
									localStorage.setItem("deliveryman",JSON.stringify(data.result));
									$state.go('signin');
								}
							);
						}else{
							console.log('注册失败');
							console.log(data);
						}
					}
				);
			});
		}
	}
]);
logisticModule.controller('FindPassCtrl',['$interval','$state','$scope','$http','UserService',
	function($interval,$state,$scope, $http,UserService){
		var vm = $scope.vm = {};
		vm.btnsendsms = {
			disabled:false,
			text:'获取验证码',
			count:60
		};
		vm.user = {
			phone:'',
			password:'',
			verfcode:''
		};
		vm.sendSms = function(){
			vm.vaildatetext = '';
			if(vm.user.phone==null||vm.user.phone==''){
				vm.vaildatetext = '请您填写手机号码!';
				return;
			}
			var tel = vm.user.phone; //获取手机号
			var telReg = !!tel.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
			//如果手机号码不能通过验证
			if(telReg == false){
				vm.vaildatetext = '手机号码不正确!';
				return;
			}
			vm.btnsendsms.disabled = true;
			UserService.findPhoneOnly(vm.user)
				.then(function(data){
					//console.log('找回密码-验证电话是否存在！');
					//console.log(data);
					if(data.success&&data.code=='100'){
						//验证手机号是否已经注册
						UserService.sendSms(vm.user)
							.then(function(data){
								//console.log("是否收到验证码");
								//console.log(data);
								if(data.success){
									//发送成功,延迟60秒可以填写验证码
									var promise = $interval(function(){
											vm.btnsendsms.count --;
											vm.btnsendsms.text = vm.btnsendsms.count+'秒后重新发送';
											if(vm.btnsendsms.count==0){
												vm.btnsendsms = {
													disabled:false,
													text:'获取验证码',
													count:60
												};
												$interval.cancel(promise);
											}
										},
										1000
									);
									$scope.$on('$destroy',function(){
										$interval.cancel(promise);
									});
								}else{
									if(data.code=='101'){
										vm.vaildatetext = '该用户已经存在!';
									}else{
										vm.vaildatetext = '系统问题，请联系客服!';
									}
									vm.btnsendsms.disabled = false;
								}
							});
					}else{
						vm.vaildatetext = '该用户手机没有注册过!';
						vm.btnsendsms.disabled = false;
					}
				});
		};
		vm.findpass = function(){
			vm.vaildatetext = '';
			if(vm.user.password==null||vm.user.password==''){
				vm.vaildatetext = '请您填写注册密码!';
				return;
			}
			if(vm.user.password.length>=8){
				vm.vaildatetext = '密码字符长度不能超过8位!';
				return;
			}
			UserService.getPassWord(vm.user)
				.then(function(data){
					if(data.success){
						// 更新密码成功跳转到页面进行登陆
						vm.vaildatetext = '修改密码成功，请登陆系统!';
						$state.go('signin');
					}else{
						vm.vaildatetext = '修改手机密码失败,请联系客服!';
					}
				}
			);
		}
	}
]);
logisticModule.controller('MineDetailCtrl', ['$scope','$http','OrderListService','DeliveryMenService','UserService',
	function($scope, $http,OrderListService,DeliveryMenService,UserService){
		//派送员个人资料
		var user = UserService.getConsumer();
		var delivermanid = user.deliverymanid;
		var obj = {delmanid:delivermanid};
		var vm = $scope.vm = {};
		vm.man = {};
		vm.showDetail = function(obj){
			DeliveryMenService.findDeliveryManDetail(obj)
				.then(
				function(data){
					vm.man = angular.extend(user,data);
				}
			);
		};
		vm.showDetail(obj);
	}
]);
logisticModule.controller('LogisticListCtrl',
	['$scope','$state','$http','$ionicPopup','OrderListService','UserService',
	function($scope,$state,$http,$ionicPopup,OrderListService,UserService) {
		//console.log("待抢单列表界面!");
		var obj = {
			start:0,
			flowstate:0,
			limit:5
		};
		var vm = $scope.vm = {};
		vm.noMoreItemsAvailable = false;
		OrderListService.clear();
		vm.loadMore = function() {
			OrderListService.findAllNeedOrder(obj)
				.then(
				function(data){
					if(data.length!=0){
						vm.items = OrderListService.all(data);
						if(data==undefined){
							//返回的结果不在加载数据
							vm.noMoreItemsAvailable = true;
						}
					}else{
						vm.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
					obj.start +=2;
				}
			);
			$scope.$broadcast('scroll.infiniteScrollComplete');
	    };
		$scope.$on('$stateChangeSuccess', function() {
		    vm.loadMore();
		});
		var user = UserService.getDeliveryMan();
		if(user==null){
			//user = {delmanid:'29422141550'};
			console.log('用户没有登陆跳转到登陆界面去登陆');
			$state.go('signin');
		}
		vm.grab = function(id,bzj,seller,buyerid){
			var confirmPopup = $ionicPopup.confirm({
				title: '系统提示',
				template: '确定要派送此订单?',
				okText:'确定',
				cancelText:'取消'
			});
			confirmPopup.then(function(res) {
				if(res) {
					var orderobj = {
						id       :id,
						deliverymanid:user.delmanid,
						bzj      :bzj,
						sellerid :seller,
						buyerid  :buyerid
					};
					OrderListService.grapOrderInfo(orderobj)
						.then(
						function(data){
					 		OrderListService.remove(id);
							var alertPopup = $ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '抢单成功!抓紧时间派送赚钱吧!'
							});

						}
					);
				}
			});
		}
	}
  ]
);
logisticModule.controller('MyLogisticListCtrl', ['$state','$scope','$http','OrderListService','UserService',
		function($state,$scope, $http,OrderListService,UserService) {
			//我的运单列表界面,对我的运单进行操作
			var user = UserService.getDeliveryMan();
			var vm = $scope.vm = {};
			if(!user){
				console.log('跳到登陆界面');
				$state.go('signin');
			}
			var obj = {
				start:0,
				limit:5,
				deliverystate:0,
				deliverymanid:user.delmanid
			};
			//console.log(obj);
			vm.orderstate = 3;
			vm.shouldShowDelete = false;
			vm.shouldShowReorder = false;
			vm.listCanSwipe = true;
			vm.noMoreItemsAvailable = false;
			vm.items = [];
			vm.flag = false;
			vm.showDetailInfo = function(id){
				$state.go('app.detail', {orderid:id});
				//return;
			};
			OrderListService.clear();
			vm.newReceived = function(){
				vm.noMoreItemsAvailable = false;
				vm.items = [];
				obj.start = 0;
				obj.deliverystate = 0;
				delete obj.finishstate;
				vm.orderstate = 3;
				OrderListService.clear();
				//console.log("未取货列表=====>清空数据");
				vm.loadMore(3);
			};
			vm.hasReceived = function(){
				vm.noMoreItemsAvailable = false;
				//console.log("hasReceived vm.noMoreItemsAvailable = "+vm.noMoreItemsAvailable);
				vm.items = [];
				obj.start = 0;
				obj.finishstate = 0;
				obj.ids = '1,4';
				delete obj.deliverystate;
				//delete obj.finishstate;
				vm.orderstate = 4;
				OrderListService.clear();
				vm.loadMore();
				console.log("配送中列表=====>清空数据");
			};
			vm.hasDone = function(){
				vm.noMoreItemsAvailable = false;
				console.log("hasDone vm.noMoreItemsAvailable = "+vm.noMoreItemsAvailable);
				vm.items = [];
				obj.start = 0;
				delete obj.deliverystate;
				delete obj.ids;
				obj.finishstate = 1;
				vm.orderstate = 5;
				OrderListService.clear();
				vm.loadMore();
				console.log("已完成列表=====>清空数据");
			};
			vm.loadMore = function() {
				//console.log('----111----'+obj.start);
				OrderListService.findMineDeliveryOrder(obj)
					.then(
					function (data) {
						//obj.start += 5;
						//console.log(data);
						//console.log("---431----"+data.length);
						if (data.length!=0) {
							//返回的结果存在则加载数据
							vm.items = OrderListService.all(data);
						}else{
							vm.noMoreItemsAvailable = true;
						}
						$scope.$broadcast('scroll.infiniteScrollComplete');
						obj.start += 5;
					}
				);
			}
			$scope.$on('$stateChangeSuccess', function() {
				//console.log("最开始加载界面的时候===触发该事件？");
				//OrderListService.clear();
				vm.loadMore(3);
			});
		}
	]
);

logisticModule.controller('DeliveryDetailCtrl', [
		'$state','$stateParams','$ionicPopup','$scope','$http','OrderListService','OrderFlowService','UserService',
		function($state,$stateParams,$ionicPopup,$scope, $http,OrderListService,OrderFlowService,UserService) {
			//运单详情页面对运单进行业务操作!
			var user = UserService.getDeliveryMan();
			var vm = $scope.vm = {};
			var obj = {
				id:$stateParams.orderid,
				deliverymanid:user.delmanid
			};
			vm.obj = obj;
			vm.qrcode = {};
			OrderListService.getOrderDetail(obj)
				.then(
					function(data){
						vm.qrcode.version = 4;
						vm.qrcode.level = 'M';
						vm.qrcode.size = 274;
						//vm.qrcode.foo = data.verifycode;
						vm.datainfo = data;
					}
				);
			vm.arriveStore = function(){
				OrderFlowService.arriveStore(obj)
					.then(
					function(data){
						if(data.success===true){
							var alertPopup = $ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '操作成功!已经系统记录,请快速处理后续业务!'
							});
							$state.go('app.mydeliverylist');
						}else{
							var alertPopup = $ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '操作失败!请稍后重试或联系客服!'
							});
							$state.go('app.mydeliverylist');
						}
					}
				);
			};
			vm.getStuffSuccess = function(){
				OrderFlowService.getStuffSuccess(obj)
					.then(
					function(data){
						if(data.success===true){
							var alertPopup = $ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '操作成功!已经系统记录,请快速处理后续业务!'
							});
							$state.go('app.mydeliverylist');
						}else{
							var alertPopup = $ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '操作失败!请稍后重试或联系客服!'
							});
							$state.go('app.mydeliverylist');
						}
					}
				);
			};
			vm.getStuffFailure = function(){
				OrderFlowService.getStuffFailure(obj)
					.then(
					function(data){
						if(data.success===true){
							var alertPopup = $ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '操作成功!已经系统记录,请快速处理后续业务!'
							});
							$state.go('app.mydeliverylist');
						}else{
							var alertPopup = $ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '操作失败!请稍后重试或联系客服!'
							});
							$state.go('app.mydeliverylist');
						}
					}
				);
			};
			vm.finishSuccess = function(){
				OrderFlowService.finishSuccess(obj)
					.then(
					function(data){
						if(data.success===true){
							var alertPopup = $ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '操作成功!已经系统记录,请快速处理后续业务!'
							});
							$state.go('app.mydeliverylist');
						}else{
							var alertPopup = $ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '操作失败!请稍后重试或联系客服!'
							});
							$state.go('app.mydeliverylist');
						}
					}
				);
			};
			vm.finishFailure = function(){
				OrderFlowService.finishFailure(obj)
					.then(
					function(data){
						if(data.success===true){
							var alertPopup = $ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '操作成功!已经系统记录,请快速处理后续业务!'
							});
							$state.go('app.mydeliverylist');
						}else{
							var alertPopup = $ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '操作失败!请稍后重试或联系客服!'
							});
							$state.go('app.mydeliverylist');
						}
					}
				);
			};
			vm.storeTakeStuffSuccess=function(){
				OrderFlowService.storeTakeStuffSuccess(obj)
					.then(
					function(data){
						if(data.success===true){
							var alertPopup = $ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '操作成功!已经系统记录,请快速处理后续业务!'
							});
							$state.go('app.mydeliverylist');
						}else{
							var alertPopup = $ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '操作失败!请稍后重试或联系客服!'
							});
							$state.go('app.mydeliverylist');
						}
					}
				);
			};
			vm.takeOwnStuff = function(){
				// 一个精心制作的自定义弹窗
				var myPopup = $ionicPopup.show({
					template: '<input type="text" ng-model="vm.datainfo.verifycodenew">',
					title: '系统提示',
					subTitle: '请输入妥投失败理由',
					scope: $scope,
					buttons: [
						{ text: '取消' },
						{
							text: '<b>确定</b>',
							type: 'button-positive',
							onTap: function(e) {
								if (!vm.datainfo.verifycodenew) {
									//不允许用户关闭，除非他键入wifi密码
									e.preventDefault();
								} else {
									return vm.datainfo.verifycodenew;
								}
							}
						},
					]
				});
				myPopup.then(function(res) {
					//console.log('Tapped11111!', res);
					if(res==vm.datainfo.verifycode){
						//1.进行妥投操作
						var objinfo = {
							id:vm.datainfo.id,
							orderstate:5
						};
						OrderListService.deliverySuccess(objinfo)
							.then(
								function(data){
									if(typeof data === 'object'){
										var alertPopup = $ionicPopup.alert({
											title: '系统提示',
											okText:'确定',
											template: '操作成功!已经系统记录,请快速处理后续业务!'
										});
										$state.go('app.mydeliverylist');
									}
								}
						);
					}else{
						var alertPopup = $ionicPopup.alert({
							title: '系统提示',
							okText:'确定',
							template: '验证码不对，不能妥投！'
						});
					}
				});

			}
		}
	]
);

angular.module('services.lp', [])
.factory('OrderFlowService',['$http','$q',function($http,$q){
        var items = {};
        var mainMethod = function(base_url,obj){
            var transform = function(data){
                return $.param(data);
            };
            return $http.post(base_url,obj,{
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Access-Control-Allow-Origin': '*'
                },
                transformRequest:transform
            }).then(
                function(response){
                    if(angular.isObject(response.data)){
                        items = response.data;
                        return items;
                    }else{
                        return $q.reject(response.data);
                    }
                },
                function(response){
                    return $q.reject(response.data);
                }
            );
        };
        return {
            getOrdersForTaskId:function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/orderconsole/queryordersbytaskid.jspx";
                return mainMethod(base_url,obj);
            },
            grapOrderInfo:function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/orderconsole/graborder.jspx";
                return mainMethod(base_url,obj);
            },
            arriveStore : function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/orderconsole/arrivestore.jspx";
                return mainMethod(base_url,obj);
            },
            getStuffSuccess : function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/orderconsole/getstuffsuccess.jspx";
                return mainMethod(base_url,obj);
            },
            getStuffFailure : function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/orderconsole/getstufffailure.jspx";
                return mainMethod(base_url,obj);
            },
            finishSuccess : function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/orderconsole/deliverysuccess.jspx";
                return mainMethod(base_url,obj);
            },
            finishFailure : function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/orderconsole/deliveryfail.jspx";
                return mainMethod(base_url,obj);
            },
            storeTakeStuffSuccess:function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/orderconsole/deliverygoodback.jspx";
                return mainMethod(base_url,obj);
            },
            obeyFinish:function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/orderconsole/obeyfinish.jspx";
                return mainMethod(base_url,obj);
            }
        }
    }])

.factory('OrderListService',['$http','$q',function($http,$q){
        var items = {};
        var mainMethod = function(base_url,obj){
            var transform = function(data){
                return $.param(data);
            };
            return $http.post(base_url,obj,{
                headers:{
                    //'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                transformRequest:transform
            }).then(
                function(response){
                    if(typeof response.data === 'object'){
                        items = response.data.result;
                        return items;
                    }else{
                        return $q.reject(response.data);
                    }
                },
                function(response){
                    return $q.reject(response.data);
                }
            );
        };
        var lporders = [];
        return {
            clear:function(){
                lporders.splice(0,lporders.length);
                lporders = [];
                return lporders;
            },
            remove:function(id){
                angular.forEach(lporders,
                    function(data,index){
                        if(data.id == id){
                            lporders.splice(index, 1);
                            return;
                        }
                    }
                );
            },
            all: function(arrayorders) {
                //console.log("arrayorders======>"+arrayorders);
                /*console.log(arrayorders != undefined);
                console.log("arrayorders is orders");*/
                if(arrayorders != undefined){
                    if(arrayorders.length!=0&&lporders.length!=0){
                        for (var i = arrayorders.length - 1; i >= 0; i--) {
                            lporders.push(arrayorders[i]);
                        };
                    }else if(lporders.length==0){
                        lporders = arrayorders;
                    }
                }
                return lporders;
            },


            getOrderDetail:function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/orderconsole/orderdetail.jspx";
                return mainMethod(base_url,obj);
            },
            deliverySuccess:function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/orderconsole/deliverysuccess.jspx";
                return mainMethod(base_url,obj);
            },
            grapOrderInfo:function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/orderconsole/graborder.jspx";
                return mainMethod(base_url,obj);
            },
            findAllNeedOrder:function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/orderconsole/queryorderformobile.jspx";
                return mainMethod(base_url,obj);
            },
            findMineDeliveryOrder:function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/orderconsole/querymyorderformobile.jspx";
                return mainMethod(base_url,obj);
            }
        };
}])
.factory('DeliveryMenService',['$http','$q',function($http,$q){
        var items = {};
        var mainMethod = function(base_url,obj){
            var transform = function(data){
                return $.param(data);
            };
            return $http.post(base_url,obj,{
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Access-Control-Allow-Origin': '*'
                },
                transformRequest:transform
            }).then(
                function(response){
                    if(typeof response.data === 'object'){
                        items = response.data.result;
                        return items;
                    }else{
                        return $q.reject(response.data);
                    }
                },
                function(response){
                    return $q.reject(response.data);
                }
            );
        };
        return {
            findDeliveryManDetail:function(obj){
                var base_url = window.YOU_HUI_BaseUrl+"/lp/delivery/personaldetail.jspx";
                return mainMethod(base_url,obj);
            }
        };
}]);

app.config(
    [
        '$stateProvider','$urlRouterProvider','$ionicConfigProvider','$httpProvider',
        function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider){
             //$httpProvider.interceptors.push('userInterceptor');

             $stateProvider
                .state('app', {
                    url: '/app',
                    abstract: true,
                    templateUrl: 'templates/ground/deliverymenu.html',
                    controller:'MainMenuCtrl'
                })
                .state('app.needlist', {
                    url: '/needlist',//待抢任务包
                    views: {
                        'todo-tab': {
                            templateUrl: 'templates/logistics/lpneedlist.html',
                            controller:'ToDoListCtrl'
                            //controller : 'LogisticListCtrl'
                        }
                    }
                })

                .state('app.map', {
                     url: '/map/:taskid',//待抢单地图
                     views: {
                         'todo-tab': {
                             templateUrl: 'templates/logistics/map.html',
                             controller : 'MapInfoCtrl'
                             /*resolve: {
                                 deps: ['uiLoad',
                                     function( uiLoad ){
                                         return uiLoad.load( [
                                             'http://api.map.baidu.com/api?type=quick&ak=lKOuzeYcfl44cDGR6rlQG1jZ&v=1.0'
                                         ]);
                                     }
                                 ]
                             }*/
                         }
                     }
                })


                 .state('app.ordermap', {
                     url: '/ordermap/:orderid',//待抢任务运单地图
                     views: {
                         'todo-tab': {
                             templateUrl: 'templates/logistics/ordermap.html'
                         }
                     }
                 })

                 .state('app.taskorderlist',{
                     url:'/taskorderlist/:taskid/:option',//获取运单明细信息
                     views:{
                         'todo-tab':{
                             templateUrl:'templates/logistics/orderlist.html',
                             controller:'OrderForTaskIdListCtrl'
                         }
                     }
                 })

                .state('app.mydeliverylist', {
                    url: '/mydeliverylist',//已抢订单
                    views: {
                        'doing-tab': {
                            templateUrl: 'templates/logistics/mydeliverylist.html',
                            controller : 'MyLogisticListCtrl'
                        }
                    }
                })


                .state('app.detail', {
                    url: '/deliverydetail/:orderid',//运单详情
                    views: {
                        'doing-tab': {
                            templateUrl: 'templates/logistics/detail.html',
                            controller:'DeliveryDetailCtrl'
                        }
                    }
                })

                .state('app.mytasks',{
                     url:'/mytask',//我的任务单信息
                     views:{
                         'mytask-tab':{
                             templateUrl:'templates/logistics/mytasks.html',
                             controller:'MyTasksCtrl'
                         }
                     }
                 })


                .state('app.mine', {
                    url: '/minepanel',//我的
                    views: {
                        'minedelv-tab': {
                            templateUrl: 'templates/logistics/mine.html',
                            controller:'MineCtrl'
                        }
                    }
                })

                /*.state('app.minedetail', {
                    url: '/minedetail',//个人资料
                    views: {
                        'minedelv-tab': {
                            templateUrl: 'templates/logistics/minedetail.html',
                            controller:'MineDetailCtrl'
                        }
                    }
                })*/

                .state('app.mineinfo', {
                     url: '/mineinfo',//个人资料
                     views: {
                         'minedelv-tab': {
                             templateUrl: 'templates/personal/mydetail.html',
                             controller:'MineInfoCtrl'
                         }
                     }
                })

                .state('app.account', {
                     url: '/account',//个人账户
                     views: {
                         'minedelv-tab': {
                             templateUrl: 'templates/personal/accountinfo.html',
                             controller:'AccountInfoCtrl'
                         }
                     }
                })

                .state('app.companymessage', {
                     url: '/companymessage',//公司消息
                     views: {
                         'minedelv-tab': {
                             templateUrl: 'templates/personal/companymessage.html',
                             controller:'CompanyMessageInfoCtrl'
                         }
                     }
                })

                .state('app.changecompany', {
                     url: '/changecompany',//更换公司
                     views: {
                         'minedelv-tab': {
                             templateUrl: 'templates/personal/changecompany.html',
                             controller:'ChangeCompanyCtrl'
                         }
                     }
                })

                .state('app.signoutcompany', {
                     url: '/signoutcompany',//申请离职
                     views: {
                         'minedelv-tab': {
                             templateUrl: 'templates/personal/signoutcompany.html',
                             controller:'SignOutCompanyCtrl'
                         }
                     }
                })

                .state('signin',{
                     url:'/signin',
                     templateUrl:'templates/logistics/login.html',
                     controller:'SignInCtrl'
                 })

                 .state('signup',{
                     url:'/signup',
                     templateUrl:'templates/logistics/register.html',
                     controller:'SignUpCtrl'
                 })

                 .state('findpassword',{
                     url:'/findpass',
                     templateUrl:'templates/logistics/findpassword.html',
                     controller:'FindPassCtrl'
                 })

            $urlRouterProvider.otherwise('/app/needlist');
        }
    ]
);

var tasksModule = angular.module("TasksModule", []);
tasksModule.controller('MyTasksCtrl',['$stateParams','$state','$scope','UserService','OrderFlowService','TaskService','OrderListService',
	function($stateParams,$state,$scope,UserService,OrderFlowService,TaskService,OrderListService) {
		var vm = $scope.vm = {};
		var deliveryman = UserService.getDeliveryMan();
		console.log("我的任务单信息!");
		var obj = {
			start:0,limit:5,delmanid:deliveryman.delmanid,status:0
		}
		vm.noMoreItemsAvailable = false;
		vm.loadMore = function(){
			//加载抢单数据
			TaskService.queryMyTask(obj)
				.then(
				function(data){
					if(data.success){
						vm.items = TaskService.all(data.result);
					}else{
						vm.noMoreItemsAvailable = true;
					}
					obj.start +=5;
				}
			);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}
		vm.showDoingTasks = function(){
			TaskService.clear();
			obj = {
				start:0,
				limit:5,
				delmanid:deliveryman.delmanid,
				status:0
			};
			if(angular.isArray(vm.items)){
				vm.items.splice(0,vm.items.length);
			};
			vm.loadMore();
		}
		vm.showFinishTasks = function(){
			TaskService.clear();
			obj = {
				start:0,limit:5,
				delmanid:deliveryman.delmanid,
				status:1
			};
			if(angular.isArray(vm.items)){
				vm.items.splice(0,vm.items.length);
			};
			vm.loadMore();
		}
		$scope.$on('$stateChangeSuccess', function() {
			console.log('当进入到该窗体后,调用vm.loadMore数据信息');
			TaskService.clear();
			vm.loadMore();
		});

		vm.showTaskDetail = function(id){
			$state.go('app.taskorderlist', {taskid:id,option:1});
		}

	}
]);
tasksModule.controller('OrderForTaskIdListCtrl',['$ionicPopup','$stateParams','$state','$scope','UserService','OrderFlowService','TaskService','OrderListService',
	function($ionicPopup,$stateParams,$state,$scope,UserService,OrderFlowService,TaskService,OrderListService){
		console.log('进入到根据任务ID获取运单信息列表界面');
		//alert('根据运单任务ID');
		var vm = $scope.vm = {};
		vm.id = $stateParams.taskid;
		console.log('-进入到根据任务ID获取运单信息列表界面------------------>'+vm.id);
		vm.option = $stateParams.option;
		vm.loadOrderByTaskId = function(){
			var manlocal = UserService.getDeliveryManLocation();
			var taskid = $stateParams.taskid;
			var option = $stateParams.option;
			console.log('option======>'+option);
			var obj = {
				id:taskid,
				longitude:manlocal.longitude,  //经度
				latitude:manlocal.latitude     //纬度
			}
			OrderFlowService.getOrdersForTaskId(obj)
				.then(function(data){
					if(data.success){
						vm.orders = data.result;
					}
				}
			);
		}
		vm.loadOrderByTaskId();
		vm.isShow = function(id,index){
			var obj = {id:id};
			OrderListService.getOrderDetail(obj).then(
				function(data){

					vm.orders[index].goods = data.goods;
					if(angular.isUndefined(vm.orders[index].show)){
						vm.orders[index].show = true;
					}else{
						vm.orders[index].show = !vm.orders[index].show;
					}
					return data;
				}
			);
		}
		vm.showOrderMap = function(id){
			$state.go('app.ordermap', {orderid:id});
		}
		vm.finishOrder = function(id){
			var man = UserService.getDeliveryMan();
			var undones = 0;
			angular.forEach(vm.orders,function(obj,index){
				if(obj.finishstate==0){
					undones++;
				}
			});
			if(undones>0){
				$ionicPopup.alert({
					title: '系统提示',
					okText:'确定',
					template: '还有'+undones+'个未完成的运单,无法结束此任务!'
				});
				return;
			}else{
				var fintaskobj = {
					delmanid:man.delmanid,
					id:id
				};
				TaskService.finishTask(fintaskobj)
					.then(
					function(data){
						if(data.success){
							console.log('进行完成运单操作!');
							$ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '此任务成功结束!'
							});
							$state.go('app.mytasks');
							return;
						}
					}
				);
			}
		}
		vm.grabOrder = function(id){
			var man = UserService.getDeliveryMan();
			var taskobj = {
				id:id,
				delmanid:man.delmanid
			}
			TaskService.grabTask(taskobj)
				.then(
				function(data){
					if(data.success){
						$ionicPopup.alert({
							title: '系统提示',
							okText:'确定',
							template: '抢单成功!到已抢单中去查看具体运单任务吧!'
						});
					}else{
						if(data.code=='10'){
							$ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '该任务已经被其他人领取!'
							});
						}else if(data.code=='-1'){
							$ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '您对该任务已经领取成功!'
							});
						}else{
							$ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '抢单失败,请稍后重试!'
							});
						}
					}
				}
			);
		}
	}
]);
tasksModule.controller('ToDoListCtrl',['$ionicPopup','$state','$scope','$http','UserService','TaskService',
	function($ionicPopup,$state,$scope, $http,UserService,TaskService){
		console.log('我要抢单数据!');
		//alert('我要抢单数据数据列表!');
		var userlocation = UserService.getDeliveryManLocation();
		var vm = $scope.vm = {};
		var obj = {
			start:0,
			limit:5,
			latitude:userlocation.latitude,
			longitude:userlocation.longitude
		};
		vm.noMoreItemsAvailable = false;
		TaskService.clear();
		vm.loadMore = function(){
			//加载抢单数据
			//alert('-----------------进入到loadmore');
			TaskService.queryTaskForMobile(obj)
				.then(
				function(data){
					/*alert('------------------');
					alert(JSON.stringify(data));
					alert('------------------');*/
					if(data.success){
						vm.items = TaskService.all(data.result);
					}else{
						vm.noMoreItemsAvailable = true;
					}
					//$scope.$broadcast('scroll.infiniteScrollComplete');
					obj.start +=5;
				}
			);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}
		$scope.$on('$stateChangeSuccess', function(obj) {
			//alert('-----加载信息 $stateChangeSuccess '+79+'-----');
			TaskService.clear();
			vm.loadMore();
		});

		vm.getDetail = function(id){
			$state.go('app.map', {taskid:id});
		}

		vm.showOrderList = function(id){
			$state.go('app.taskorderlist', {taskid:id,option:0});
			//$state.go('app.taskorderlist', {taskid:id});
		};

		vm.grabOrder = function(id){
			var man = UserService.getDeliveryMan();
			var taskobj = {
				id:id,
				delmanid:man.delmanid
			}
			TaskService.grabTask(taskobj)
				.then(
				function(data){
					if(data.success){
						$ionicPopup.alert({
							title: '系统提示',
							okText:'确定',
							template: '抢单成功!到已抢单中去查看具体运单任务吧!'
						});
					}else{
						if(data.code=='10'){
							$ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '该任务已经被其他人领取!'
							});
						}else if(data.code=='-1'){
							$ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '您对该任务已经领取成功!'
							});
						}else{
							$ionicPopup.alert({
								title: '系统提示',
								okText:'确定',
								template: '抢单失败,请稍后重试!'
							});
						}
					}
				}
			);
		}
	}
]);
tasksModule.controller('MapInfoCtrl',['$timeout','$state','$scope','$stateParams','$http','UserService','TaskService',
	function($timeout,$state,$scope,$stateParams,$http,UserService,TaskService){
		console.log('地图信息!');
		var vm = $scope.vm = {};

	}
]);

angular.module('services.taskservice', [])
	.factory('TaskService',['$http','$q',function($http,$q){
		var items = {};
		var mainMethod = function(base_url,obj){
			var transform = function(data){
				return $.param(data);
			};
			return $http.post(base_url,obj,{
				headers:{
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'Access-Control-Allow-Origin': '*'
				},
				transformRequest:transform
			}).then(
				function(response){
					if(angular.isObject(response.data)){
						items = response.data;
						return items;
					}else{
						return $q.reject(response.data);
					}
				},
				function(response){
					return $q.reject(response.data);
				}
			);
		};
		var tasks = [];
		return {
			finishTask:function(obj){
				var base_url = window.YOU_HUI_BaseUrl + "/lp/orderconsole/finishtask.jspx";
				return mainMethod(base_url,obj);
			},
			queryMyTask:function(obj){
				var base_url = window.YOU_HUI_BaseUrl + "/lp/orderconsole/querymytask.jspx";
				return mainMethod(base_url,obj);
			},
			grabTask:function(obj){
				var base_url = window.YOU_HUI_BaseUrl + "/lp/orderconsole/grabtask.jspx";
				return mainMethod(base_url,obj);
			},
			setTasks:function(task){
				task = task;
			},
			clear:function(){
				tasks.splice(0,tasks.length);
				tasks = [];
				return tasks;
			},
			all: function(array) {
				if(array != undefined){
					if(array.length!=0&&tasks.length!=0){
						for (var i = array.length - 1; i >= 0; i--) {
							tasks.push(array[i]);
						};
					}else if(tasks.length==0){
						tasks = array;
					}
				}
				return tasks;
			},
			queryTaskForDetail:function(obj){
				//console.log('查询taskdetail');
				var base_url = window.YOU_HUI_BaseUrl + "/lp/orderconsole/queryordersbytaskid.jspx";
				return mainMethod(base_url,obj);
			},
			queryTaskForMobile:function(obj){
				var base_url = window.YOU_HUI_BaseUrl + "/lp/orderconsole/querytaskformobile.jspx";
				return mainMethod(base_url,obj);
			},
			setUserInfo:function(obj){
				var base_url = window.YOU_HUI_BaseUrl+"/lp/delivery/updatemaninfo.jspx";
				return mainMethod(base_url,obj);
			}
		};
	}]);

/**
 * Created by LQZ on 2015/8/27.
 */
var userModule = angular.module("UserModule", []);
userModule.controller('MineCtrl',['$state','$scope','$timeout','$cordovaAppVersion',
    '$cordovaFile','$cordovaFileOpener2','$cordovaFileTransfer',
    '$ionicPopup','$ionicLoading','UserService',
    function($state,$scope,$timeout,$cordovaAppVersion,
             $cordovaFile,$cordovaFileOpener2,$cordovaFileTransfer,
             $ionicPopup,$ionicLoading,UserService){
        var vm = $scope.vm = {};
        var user = UserService.getDeliveryMan();
        vm.user = {};
        vm.user.name = user.phone;
        vm.signOut = function(){
            localStorage.removeItem("deliveryman");
            var user = UserService.getDeliveryMan();
            if(!user){
                $state.go('signin');
            }
        };
        window.checkUpdate =  function() {   // 检查更新
            var serverAppVersion = "0.0.5"; //从服务端获取最新版本
            //获取版本
            //alert('----25-----');
            //console.log($cordovaAppVersion);
            var obj = {};
            UserService.getVersion(obj).then(function(data){
                if(data.success){
                    serverAppVersion = data.result.name;
                    $cordovaAppVersion.getAppVersion().then(function (version) {
                        //如果本地与服务端的APP版本不符合
                        //alert(version);
                        if (version != serverAppVersion) {
                            //alert('29');
                            var content = data.result.content;
                            showUpdateConfirm(content);
                        }else{
                            alert('已经是最新的'+serverAppVersion+'版本');
                        }
                    });
                }else{
                    alert('未发现新版本!');
                }
            });

        };

        // 显示是否更新对话框
        window.showUpdateConfirm = function(content) {
            var confirmPopup = $ionicPopup.confirm({
                title: '版本升级',
                template:content,
                //template: '1.新增运单地图查看功能;</br>2.拨打电话功能;</br>3.优化了运单接口;</br>4.新增任务功能', //从服务端获取更新的内容
                cancelText: '取消',
                okText: '升级'
            });
            //alert(45);
            confirmPopup.then(function (res) {
                if (res) {
                    $ionicLoading.show({
                        template: "已经下载：0%"
                    });
                    var url = "http://joke.qhdsx.com/youhuicms/android-debug.apk"; //可以从服务端获取更新APP的路径
                    var targetPath = "file:///storage/sdcard0/Download/lpog.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
                    var trustHosts = true
                    var options = {};
                    //alert($cordovaFileTransfer);
                    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                        .then(function (result) {
                        //alert('57');
                        // 打开下载下来的APP
                        $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                        ).then(function () {
                                // 成功
                                //alert('打开成功');
                            }, function (err) {
                                // 错误
                                //alert('打开失败');
                            });
                        $ionicLoading.hide();
                    }, function (err) {
                        //alert('下载失败');
                    }, function (progress) {
                        //进度，这里使用文字显示下载百分比
                        $timeout(function () {
                            var downloadProgress = (progress.loaded / progress.total) * 100;
                            $ionicLoading.show({
                                template: "已经下载：" + Math.floor(downloadProgress) + "%"
                            });
                            if (downloadProgress > 99) {
                                $ionicLoading.hide();
                            }
                        })
                    });
                } else {
                    // 取消更新
                }
            });
        };

        vm.checkNew = function(){
            //alert('检1查1更1新!');
            try{
                checkUpdate();
            }catch(e){
                alert(e.description);
            }
        }


    }
]);
userModule.controller('MineInfoCtrl',['$state','$scope','$http','$ionicPopup','UserService',
    function($state,$scope, $http,$ionicPopup,UserService){
        var vm = $scope.vm = {};
        var user = UserService.getDeliveryMan();
        if(!user){
            $state.go('signin');
        }
        vm.loadDetail = function(){
            vm.man = {
                head:'img/images/caojian.jpg',
                name:user.phone,
                complatenum:1050,
                successnum:1032,
                createtime:'2015-08-01',
                companyname:'丹旌物流公司',
                phone:user.phone,
                idcard:'220********1818'
            }
            if(!user.name){
                vm.man.name = user.phone;
            }else{
                vm.man.name = user.name;
            }
        };
        vm.loadDetail();
        //
        vm.showNameBox = function(){
            // 弹出一个对话框显示要修改的姓名
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="vm.man.name">',
                title: '系统提示',
                subTitle: '请输入要修改的名称!',
                scope: $scope,
                buttons: [
                    { text: '取消' },
                    {
                        text: '<b>确定</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!vm.man.name) {
                                e.preventDefault();
                            } else {
                                return vm.man.name;
                            }
                        }
                    },
                ]
            });
            myPopup.then(function(res) {
                var obj = {delmanid:user.delmanid,name:res};
                UserService.setUserInfo(obj)
                    .then(
                    function(data){
                        if(angular.isObject(data)){
                            user.name = res;
                            var str = JSON.stringify(user);
                            localStorage.setItem('deliveryman',str);
                            var alertPopup = $ionicPopup.alert({
                                title: '系统提示',
                                okText:'确定',
                                template: '姓名修改成功!'
                            });
                        }else{
                            var alertPopup = $ionicPopup.alert({
                                title: '系统提示',
                                okText:'确定',
                                template: '姓名修改失败!'
                            });
                        }
                    }
                );
            });
        }

    }
]);
userModule.controller('AccountInfoCtrl',['$state','$scope','$http','UserService',
    function($state,$scope, $http,UserService){
        var vm = $scope.vm = {};
        var user = UserService.getDeliveryMan();
        if(!user){
            $state.go('signin');
        }
        vm.items = [
            {month:'2015-07',amount:200},
            {month:'2015-06',amount:190},
            {month:'2015-05',amount:180},
            {month:'2015-04',amount:170},
            {month:'2015-03',amount:160},
            {month:'2015-01',amount:150}
        ]
    }
]);
userModule.controller('CompanyMessageInfoCtrl',['$state','$scope','$http','UserService',
    function($state,$scope, $http,UserService){
        var vm = $scope.vm = {};
        var user = UserService.getDeliveryMan();
        if(!user){
            $state.go('signin');
        }
        vm.items = [
            {date:'2015-07-01',title:'还没绑账号的小伙伴注意啦！'},
            {date:'2015-06-23',title:'公司打款账号通知'},
            {date:'2015-05-25',title:'绑定个人支付宝账号须知'},
            {date:'2015-04-28',title:'雨季突发，提醒大家携带雨具'},
            {date:'2015-03-29',title:'春节将至,祝大家节日快乐'},
            {date:'2015-01-31',title:'欢迎你加入众包平台'}
        ]
    }
]);
userModule.controller('ChangeCompanyCtrl',['$state','$scope','$http','UserService',
    function($state,$scope, $http,UserService){
        var vm = $scope.vm = {};
        var user = UserService.getDeliveryMan();
        if(!user){
            $state.go('signin');
        }
        vm.items = [
            {name:'2015-07-01',title:'还没绑账号的小伙伴注意啦！'},
            {name:'2015-06-23',title:'公司打款账号通知'},
            {name:'2015-05-25',title:'绑定个人支付宝账号须知'},
            {name:'2015-04-28',title:'雨季突发，提醒大家携带雨具'},
            {name:'2015-03-29',title:'春节将至,祝大家节日快乐'},
            {name:'2015-01-31',title:'欢迎你加入众包平台'}
        ]
    }
]);
userModule.controller('SignOutCompanyCtrl',['$state','$scope','$http','UserService',
    function($state,$scope, $http,UserService){
        var vm = $scope.vm = {};
        var user = UserService.getDeliveryMan();
        if(!user){
            $state.go('signin');
        }
        vm.items = [
            {name:'2015-07-01',title:'还没绑账号的小伙伴注意啦！'},
            {name:'2015-06-23',title:'公司打款账号通知'},
            {name:'2015-05-25',title:'绑定个人支付宝账号须知'},
            {name:'2015-04-28',title:'雨季突发，提醒大家携带雨具'},
            {name:'2015-03-29',title:'春节将至,祝大家节日快乐'},
            {name:'2015-01-31',title:'欢迎你加入众包平台'}
        ]
    }
]);

angular.module('services.user', [])
.factory('UserService',['$http','$q',function($http,$q){
  var showuserheader = false;
    var items = {};
    var mainMethod = function(base_url,obj){
        var transform = function(data){
            return $.param(data);
        };
        return $http.post(base_url,obj,{
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            },
            transformRequest:transform
        }).then(
            function(response){
                if(angular.isObject(response.data)){
                    items = response.data;
                    return items;
                }else{
                    return $q.reject(response.data);
                }
            },
            function(response){
                return $q.reject(response.data);
            }
        );
    };
  return {
    setPostManLocation:function(){
        var man = this.getDeliveryMan();
        if(man){
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(
                function(r){
                    if(this.getStatus() == BMAP_STATUS_SUCCESS){
                        //alert('您的位置：经度'+r.point.lng+',维度'+r.point.lat);
                        var longitude=r.point.lng;//经度
                        var latitude=r.point.lat; //纬度
                        var manid = man.delmanid; //快递员id
                        var obj = {delmanid:manid,longitude:longitude,latitude:latitude};
                        var base_url = window.YOU_HUI_BaseUrl+"/lp/delivery/updatemanlocation.jspx";
                        mainMethod(base_url,obj).then(
                            function(data){
                                if(data.success){
                                    console.log("====success====");
                                    localStorage.setItem("deliverymanlocation",JSON.stringify(data.result));
                                }
                            });
                    }else {//失败的回调函数
                        //错误回调
                        //alert('failed'+this.getStatus());
                    }
                },{
                    enableHighAccuracy: true
                }
            );
        }
    },
    getDeliveryManLocation:function(){
        var o = localStorage.getItem("deliverymanlocation");
        if(o){
            var deliverymanlocation = JSON.parse(o);
            return deliverymanlocation;
        }else{
            return null;
        }
    },
    getVersion:function(obj){
        var base_url = window.YOU_HUI_BaseUrl+"/lp/version/getlatestversion.jspx";
        return mainMethod(base_url,obj);
    },
    setUserInfo:function(obj){
        var base_url = window.YOU_HUI_BaseUrl+"/lp/delivery/updatemaninfo.jspx";
        return mainMethod(base_url,obj);
    },
    getDeliveryMan:function(){
       var o = localStorage.getItem("deliveryman");
       if(o){
          var deliveryman = JSON.parse(o);
          return deliveryman;
       }else{
          return null;
       }

    },
    findPhoneOnly:function(obj){
        var base_url = window.YOU_HUI_BaseUrl+"/lp/delivery/findphoneonly.jspx";
        return mainMethod(base_url,obj);
    },
    sendSms:function(obj){
        var base_url = window.YOU_HUI_BaseUrl+"/lp/delivery/sendsms.jspx";
        return mainMethod(base_url,obj);
    },
    getPassWord:function(obj){
        var base_url = window.YOU_HUI_BaseUrl+"/lp/delivery/getpass.jspx";
        return mainMethod(base_url,obj);
    },
    signIn:function(obj){
        var base_url = window.YOU_HUI_BaseUrl+"/lp/delivery/signin.jspx";
        return mainMethod(base_url,obj);
    },
    signUp:function(obj){
        var base_url = window.YOU_HUI_BaseUrl+"/lp/delivery/signup.jspx";
        return mainMethod(base_url,obj);
    },
    makeOrderInfo:function(obj){
        var base_url = window.YOU_HUI_BaseUrl+"/store/order/makeorder.jspx";
        var transform = function(data){
            return $.param(data);
        }
        return $http.post(base_url,obj,{
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            },
            transformRequest:transform
        }).then(
            function(response){
                if(typeof response.data === 'object'){
                    items = response.data.result;
                    return items;
                }else{
                    return $q.reject(response.data);
                }
            },
            function(response){
                return $q.reject(response.data);
            }
        );
    },
    getMineCartInfo:function(obj){
        var items = {};
        var base_url = window.YOU_HUI_BaseUrl+"/store/cart/findshopcarbyuserid.jspx";
        var transform = function(data){
          return $.param(data);
        }
        return $http.post(base_url,obj,{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'Access-Control-Allow-Origin': '*'
          },
          transformRequest: transform
        }).then(
          function(response){
              if(typeof response.data === 'object'){
                  items = response.data.result;
                  return items;
              }else{
                  return $q.reject(response.data);
              }
          },
          function(response){
              return $q.reject(response.data);
          }
        );
    },
    goToWeixinPay:function(url,obj){
        var items = {};
        var base_url = window.YOU_HUI_BaseUrl+"/weixin/makeopenidurl.jspx";
        var transform = function(data){
            return $.param(data);
        }
        return $http.post(url,obj,{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            },
            transformRequest: transform
        }).then(
            function(response){
                return response.data;
            },
            function(response){
                return $q.reject(response.data);
            }
        );
    },
    makeWeixinPayOrder:function(obj){
        var items = {};
        var base_url = window.YOU_HUI_BaseUrl+"/weixin/makeopenidurl.jspx";
        var transform = function(data){
            return $.param(data);
        }
        return $http.post(base_url,obj,{
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'Access-Control-Allow-Origin': '*'
              },
              transformRequest: transform
        }).then(
          function(response){
              return response.data;
          },
          function(response){
              return $q.reject(response.data);
          }
        );
    },
    makeAliPayOrder:function(obj){
        var items = {};
        var base_url = window.YOU_HUI_BaseUrl+"/store/order/makealipaybill.jspx";
        var transform = function(data){
            return $.param(data);
        }
        return $http.post(base_url,obj,{
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        }).then(
            function(response){
               return response.data;
            },
            function(response){
                return $q.reject(response.data);
            }
        );
    },
    getConsumer:function(){
        var o = localStorage.getItem("consumer");
        if(o){
            var consumer = JSON.parse(o);
            return consumer;
        }else{
            return null;
        }

    },
    setShowuserheader:function(showuserheader){
            this.showuserheader = showuserheader;
            //$scope.showuserinfo = true;
    },
    getShowuserheader:function(){
        return showuserheader;
    },
    userlogin: function(obj) {
        var items = {};
        var base_url = window.YOU_HUI_BaseUrl+"/user/info/consumerlogin.jspx";
        var transform = function(data){
            return $.param(data);
        }
        return $http.post(base_url,obj,{
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        }).then(
            function(response){
                if(typeof response.data === 'object'){
                    items = response.data.result;
                    return items;
                }else{
                    return $q.reject(response.data);
                }
            },
            function(response){
                return $q.reject(response.data);
            }
        );
    }
  };
}]);
