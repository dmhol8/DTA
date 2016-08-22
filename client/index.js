var myApp = angular.module('myApp',[])

src="node_modules/angular/jqlite.js"

myApp.directive("anotherfig", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			scope.count++;
			exp = "getFigs('nextFig"+scope.count+"')"

			angular.element(document.querySelector('#figureBlocks')).append($compile("<br><br><input class='figureButtons' id='nextFig"
				+scope.count+
				"' type='button' value='New Figure' ng-click="+exp+" >")(scope));
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

	this.getFigNames = function (id, prevID, prevName, nextName, diff) {
		if (prevID != "" && prevID != id) {
			document.getElementById(prevID).className = 'figureButtons';
		}
		document.getElementById(id).className = 'answerBtnsSelected';

		var url = baseUrl + "getFigNames"
    	return $http.post(url, {prevName, nextName, diff})
	}

	this.placeFigNames = function (name, id) {
		document.getElementById(id).value = name;
	}
})

myApp.service('IdService', function() {

	this.getLastId = function (id) {
		if (id == 'nextFig1') {
			return 'startFigure';
		}
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
		if (id != 'startFigure') {
			if (Number(id.substr(7)) > count) {
				return 'New Figure';
			}
		}
		return document.getElementById(id).value;
	}
	this.removeDups = function (A) {
    	var seen = {};
    	var done = [];
    	var lenA = A.length;
    	var j = 0;
    	for(var i = 0; i < lenA; i++) {
        	var one = A[i];
        	if(seen[one] !== 1) {
            	seen[one] = 1;
            	done[j++] = one;
        	}
    	}
    	return done;
	}
})

myApp.service('DiffService', function() {

	this.makeObj = function (S, A, L, F) {
		var diff = [];

		if (!S && !A && !L && !F) {
			diff = ['Student Teacher','Associate','Licentiate','Fellow'];
		} else {
			if (S) {
				diff = ['Student Teacher']
			}
			if (A) {
				diff = diff.concat(['Associate'])
			}
			if (L) {
				diff = diff.concat(['Licentiate'])
			}
			if (F) {
				diff = diff.concat(['Fellow'])
			}
		}
		return diff;
	}
})

myApp.controller('myController', function($scope, NumberService, VisibilityService, FigService, IdService, DiffService) {

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
	$scope.S = 0
	$scope.A = 0
	$scope.L = 0
	$scope.F = 0
	$scope.id = 'none'

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
  		count = $scope.count;

  		if ($scope.id == 'startFigure') {
  			$scope.lastID = ''
  			$scope.nextID = 'nextFig1'

  			$scope.prevName = 'New Figure'
  			$scope.nextName = IdService.getName ( $scope.nextID, count )
  		} else {
  			$scope.lastID = IdService.getLastId( oneId )
  			$scope.nextID = IdService.getNextId( oneId )
  		
  			$scope.prevName = IdService.getName ( $scope.lastID, count )
  			$scope.nextName = IdService.getName ( $scope.nextID, count )
  		}

  		$scope.diff = DiffService.makeObj( $scope.S, $scope.A, $scope.L, $scope.F )

  		FigService.getFigNames( $scope.id, $scope.prevID, $scope.prevName, $scope.nextName, $scope.diff )
  		.then(loadSuccess, error)
  		$scope.prevID = $scope.id
  	}

  	$scope.placeFigs = function (name) {
  		$scope.name = name;
  		FigService.placeFigNames( $scope.name , $scope.id )
  	}

  	function loadSuccess (json) {
    	A = json.data;
    	$scope.names = IdService.removeDups(A)
    	// alert($scope.names)
  	}

  	function error (err) {
  		document.getElementById("figure").innerHTML = 'error'
    	console.log(err)
  	}

  	$scope.setDifficulty = function (diff) {
  		switch(diff) {
  			case 'difBut1': 
  				if ($scope.S) {
  					document.getElementById(diff).className = 'difficultyButton'
  					$scope.S = 0;
  				} else {
  					document.getElementById(diff).className = 'diffBtnsSelected'
  					$scope.S = 1;
  				}
  				break;
  			case 'difBut2': 
  				if ($scope.A) {
  					document.getElementById(diff).className = 'difficultyButton'
  					$scope.A = 0;
  				} else {
  					document.getElementById(diff).className = 'diffBtnsSelected'
  					$scope.A = 1;
  				}
  				break;
  			case 'difBut3': 
  				if ($scope.L) {
  					document.getElementById(diff).className = 'difficultyButton'
  					$scope.L = 0;
  				} else {
  					document.getElementById(diff).className = 'diffBtnsSelected'
  					$scope.L = 1;
  				}
  				break;
  			default: 
  				if ($scope.F) {
  					document.getElementById(diff).className = 'difficultyButton'
  					$scope.F = 0;
  				} else {
  					document.getElementById(diff).className = 'diffBtnsSelected'
  					$scope.F = 1;
  				} 
  		}
  		if ($scope.id != 'none') {
  			$scope.getFigs( $scope.id );
  		}
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