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
