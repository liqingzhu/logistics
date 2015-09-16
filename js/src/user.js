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
