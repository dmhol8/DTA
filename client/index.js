var myApp = angular.module('myApp',[])

myApp.service('ChangePage', function($http)) {
	var baseUrl = "http://localhost:8080/"
	this.saveWord = function (danceSelect) {
		var url = baseUrl + danceSelect
		return $http.post(url, {"dance": danceSelect})
	}
}

myApp.controller('MyController', function($scope) {

	$scope.danceSelect = waltz

	$scope.beginDance = function(){
		ChangePage.saveWord($scope.danceSelect)
		.then(saveSuccess, error)
	}

	function saveSuccess(json) {
		console.log(json)
	}

	function error(err) {
		console.log(err)
	}
})
