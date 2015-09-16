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
