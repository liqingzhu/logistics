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
