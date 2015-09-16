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
