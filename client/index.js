var myApp = angular.module('myApp',[])
src="jquery-1.12.3.js"

function numberList(steps) {

	var i, text;
	for (i = 1; i < steps+1; i++){
		text += "<option>" + i + "</option>";
	}
	return text;
}

myApp.controller('MyController', function($scope) {

	$scope.danceSelect = waltz

	function error(err) {
		console.log(err)
	}
})

document.getElementById("selectStepNo").innerHTML = numberList(5);
document.getElementById("selectPreNo").innerHTML = numberList(5);
document.getElementById("selectFollNo").innerHTML = numberList(5);
