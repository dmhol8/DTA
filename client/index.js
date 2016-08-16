var myApp = angular.module('myApp',[])

src="node_modules/angular/jqlite.js"

myApp.directive("anotherfig", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			scope.count++;
			exp = "getFigs2('nextFig"+scope.count+"')"

			angular.element(document.querySelector('#figureBlocks')).append($compile("<br><br><input class='figureButtons' id='nextFig"
				+scope.count+
				"' type='button' value='New Figure "
				+scope.count+
				"' ng-click="+exp+" >")(scope));
		});
	};
});

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

myApp.service('FigService', function($http) {

	var baseUrl = 'http://localhost:8080/';

	this.getFigNames = function (id, prevID) {
		if (prevID != "") {
			document.getElementById(prevID).className = 'figureButtons';
		}
		document.getElementById(id).className = 'answerBtnsSelected';

		var url = baseUrl + "getFigNames"
    	return $http.get(url)
	}

	this.getFigNames2 = function (id, prevID, prevName, nextName) {
		if (prevID != "") {
			document.getElementById(prevID).className = 'figureButtons';
		}
		document.getElementById(id).className = 'answerBtnsSelected';

		var url = baseUrl + "getFigNames2"
    	return $http.post(url, {prevName, nextName})
	}

	this.placeFigNames = function (name, id) {
		document.getElementById(id).value = name;
	}
})

myApp.service('IdService', function() {

	this.getLastId = function (id) {
		var s = id;
		var index = 7;
		chr = s.substr(7)
		return s.substr(0, index) + (chr - 1);
	}

	this.getNextId = function (id) {
		var s = id;
		var index = 7;
		chr = s.substr(7)
		return s.substr(0, index) + (Number(chr) + 1);
	}

	this.getName = function (id, count) {
		if (id == 'nextFig0' || Number(id.substr(7)) > count) {
			return 'nothing';
		}
		return document.getElementById(id).value;
	}
})

myApp.controller('myController', function($scope, NumberService, VisibilityService, FigService, IdService) {

	$scope.danceSelect = "waltz"
	$scope.numSteps = 4
	$scope.numPre = 3
	$scope.numFoll = 3
	$scope.names = []
	$scope.prevID = ""
	$scope.prevName = ""
	$scope.count = 0;
	$scope.nextName = ""
	$scope.lastID = 1
	$scope.nextID = 1

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

  	$scope.getFigs = function (oneId) {
  		$scope.id = oneId;
  		FigService.getFigNames( $scope.id , $scope.prevID )
  		.then(loadSuccess, error)
  		$scope.prevID = $scope.id
  	}

  	$scope.getFigs2 = function (oneId) {
  		$scope.id = oneId;
  		count = $scope.count;

  		$scope.lastID = IdService.getLastId( oneId )
  		$scope.nextID = IdService.getNextId( oneId )
  		
  		$scope.prevName = IdService.getName ( $scope.lastID, count )
  		$scope.nextName = IdService.getName ( $scope.nextID, count )
  		
  		alert($scope.nextName)

  		FigService.getFigNames2( $scope.id, $scope.prevID, $scope.prevName, $scope.nextName )
  		.then(loadSuccess, error)
  		$scope.prevID = $scope.id
  	}

  	$scope.placeFigs = function (name) {
  		$scope.name = name;
  		FigService.placeFigNames( $scope.name , $scope.id )
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