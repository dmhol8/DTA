var myApp = angular.module('myApp',[])

// src="jquery-1.12.3.js"

myApp.service('NumberService', function() {

	this.numberList = function (steps) {
		var i, text;
		for (i = 1; i < steps+1; i++){
			text += "<option>" + i + "</option>";
		}
		return text
	}
})

myApp.service('VisibilityService', function() {

	this.visMain = function () {
		document.getElementById("introPage").style.display = "none";
    	document.getElementById("mainPage").style.display = "block";
    	window.sessionStorage.setItem("pageState", "B");
    	// document.getElementById("state").innerHTML = sessionStorage.getItem('pageState');
	}

	this.visIndex = function () {
		document.getElementById("mainPage").style.display = "none";
    	document.getElementById("introPage").style.display = "block";
    	window.sessionStorage.setItem("pageState", "A");
    	// document.getElementById("state").innerHTML = sessionStorage.getItem('pageState');
	}

	this.visFig = function () {
		document.getElementById("options").style.display = "none";
    	document.getElementById("section4CreateFigure").style.display = "inline-block";
    	window.sessionStorage.setItem("pageState", "C");
    	// document.getElementById("state").innerHTML = sessionStorage.getItem('pageState');		
	}

	this.visOpt = function () {
		document.getElementById("section4CreateFigure").style.display = "none";
		document.getElementById("options").style.display = "inline-block";
		window.sessionStorage.setItem("pageState", "B");
		// document.getElementById("state").innerHTML = sessionStorage.getItem('pageState');
	}

	this.visCreateFig = function () {
		document.getElementById("figDetailBox").style.display = "block";
		// document.getElementById("state").innerHTML = sessionStorage.getItem('pageState');
	}

	this.visNoCreateFig = function () {
		document.getElementById("figDetailBox").style.display = "none";
		// document.getElementById("state").innerHTML = sessionStorage.getItem('pageState');
	}
})

myApp.service('ClassService', function($http) {

	var baseUrl = 'http://localhost:8080/';

	this.chClass = function (id) {
		document.getElementById(id).className = 'answerBtnsSelected';

		var url = baseUrl + "chClass"
    	return $http.get(url)
	}
})

myApp.controller('myController', function($scope, NumberService, VisibilityService, ClassService) {

	$scope.danceSelect = "waltz"
	$scope.numSteps = 4
	$scope.numPre = 3
	$scope.numFoll = 3
	$scope.names = []

	$scope.numberStepsList = function () {
    	NumberService.numberList( $scope.numSteps )
    	// .then(saveSuccess, error)    
  	}

  	$scope.numberPreList = function () {
    	NumberService.numberList( $scope.numPre )
    	// .then(saveSuccess, error)    
  	}

  	$scope.numberFollList = function () {
    	NumberService.numberList( $scope.numFoll )
    	// .then(saveSuccess, error)    
  	}

  	$scope.dispMain = function () {
    	VisibilityService.visMain()
    	// .then(saveSuccess, error)    
  	}	

  	$scope.dispIndex = function () {
    	VisibilityService.visIndex()
    	// .then(saveSuccess, error)    
  	}	

  	$scope.dispFig = function () {
    	VisibilityService.visFig()
    	// .then(saveSuccess, error)    
  	}	

  	$scope.dispOpt = function () {
    	VisibilityService.visOpt()
    	// .then(saveSuccess, error)    
  	}

  	$scope.changeClass = function (oneId) {
  		$scope.id = oneId;
  		ClassService.chClass( $scope.id )
  		.then(loadSuccess, error)
  	}

  	function loadSuccess (json) {
    	$scope.names = json.data
  	}

  	function error (err) {
  		document.getElementById("figure").innerHTML = 'error'
    	console.log(err)
  	}

  	$scope.dispCreateFig = function () {
    	VisibilityService.visCreateFig()
    	document.getElementById("numIn1").disabled = true;
    	document.getElementById("numIn2").disabled = true;
    	document.getElementById("numIn3").disabled = true;
    	document.getElementById("numIn4").disabled = true;
    	document.getElementById("numIn5").disabled = true;
    	document.getElementById("difBut1").disabled = true;
    	document.getElementById("difBut2").disabled = true;
    	document.getElementById("difBut3").disabled = true;
    	document.getElementById("difBut4").disabled = true;
    	document.getElementById("textSearch").disabled = true;
    	document.getElementById("startFigure").disabled = true;
    	document.getElementById("nextButton").disabled = true;
    	document.getElementById("backButton").disabled = true;
    	document.getElementById("selectStepNo").innerHTML = NumberService.numberList($scope.numSteps);
		document.getElementById("selectPreNo").innerHTML = NumberService.numberList($scope.numPre);
		document.getElementById("selectFollNo").innerHTML = NumberService.numberList($scope.numFoll);
    	// .then(saveSuccess, error)    
  	}	

  	$scope.dispNoCreateFig = function () {
    	VisibilityService.visNoCreateFig()
		document.getElementById("numIn1").disabled = false;
    	document.getElementById("numIn2").disabled = false;
    	document.getElementById("numIn3").disabled = false;
    	document.getElementById("numIn4").disabled = false;
    	document.getElementById("numIn5").disabled = false; 
    	document.getElementById("difBut1").disabled = false;
    	document.getElementById("difBut2").disabled = false;
    	document.getElementById("difBut3").disabled = false;
    	document.getElementById("difBut4").disabled = false;   	
    	document.getElementById("textSearch").disabled = false;
    	document.getElementById("startFigure").disabled = false;
    	document.getElementById("nextButton").disabled = false;
    	document.getElementById("backButton").disabled = false;
    	// .then(saveSuccess, error)    
  	}

  	window.onload = function() {
  		document.getElementById("numIn1").disabled = false;
    	document.getElementById("numIn2").disabled = false;
    	document.getElementById("numIn3").disabled = false;
    	document.getElementById("numIn4").disabled = false;
    	document.getElementById("numIn5").disabled = false; 
    	document.getElementById("difBut1").disabled = false;
    	document.getElementById("difBut2").disabled = false;
    	document.getElementById("difBut3").disabled = false;
    	document.getElementById("difBut4").disabled = false;   	
    	document.getElementById("textSearch").disabled = false;
    	document.getElementById("startFigure").disabled = false;
    	document.getElementById("nextButton").disabled = false;
    	document.getElementById("backButton").disabled = false;

		var pageState = sessionStorage.getItem("pageState");
		
	    if(pageState == "B") {
	      	VisibilityService.visMain();
	    }
	    else if (pageState == "C") {
	    	VisibilityService.visMain();
	    	VisibilityService.visFig();
	    }
	}
})