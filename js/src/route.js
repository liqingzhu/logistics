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
