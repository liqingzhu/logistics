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
