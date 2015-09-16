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
