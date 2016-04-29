var myApp = angular.module('myApp',[])
src="jquery-1.12.3.js"

myApp.service('CreateDropdown', function() {

	this.numberList = function numberList(steps) {
		var i, text;
		for (i = 1; i < steps+1; i++){
			text += "<option>" + i + "</option>";
		}
		return text;
	}
});

myApp.service('VisibilityService', function() {

	this.visibleChange = function visibleChange() {
		document.getElementById("introPage").style.display = "none";
		document.getElementById("mainPage").style.display = "block";
	}

});

myApp.controller('myController', function($scope) {

	$scope.danceSelect = waltz;

	function error(err) {
		console.log(err);
	};
});

document.getElementById("selectStepNo").innerHTML = numberList(5);
document.getElementById("selectPreNo").innerHTML = numberList(5);
document.getElementById("selectFollNo").innerHTML = numberList(5);

function visMain() {
    document.getElementById("introPage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";
}

function visIndex() {
	document.getElementById("mainPage").style.display = "none";
    document.getElementById("introPage").style.display = "block";
}

function visFig() {
	document.getElementById("options").style.display = "none";
    document.getElementById("section4CreateFigure").style.display = "inline-block";
}

function visOpt() {
	document.getElementById("section4CreateFigure").style.display = "none";
	document.getElementById("options").style.display = "inline-block";
}

function visCreateFig() {
	document.getElementById("figDetailBox").style.display = "block";
}

function visNoCreateFig() {
	document.getElementById("figDetailBox").style.display = "none";
}