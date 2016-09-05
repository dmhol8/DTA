var myApp = angular.module('myApp',[])



myApp.directive("anotherfig", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			scope.count++;
			exp = "getFigs('nextFig"+scope.count+"')"

			angular.element(document.querySelector('#figureBlocks')).append($compile("<input class='figureButtons' id='nextFig"
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

		// Button appearance
		if (prevID != "" && prevID != id) {
			document.getElementById(prevID).className = 'figureButtons';
		}
		document.getElementById(id).className = 'answerBtnsSelected';

		// Retrieve information from server
		var url = baseUrl + "getFigNames"
    	return $http.post(url, {prevName, nextName, diff})
	}

	this.placeFigNames = function (name, id) {
		document.getElementById(id).value = name;
	}

	this.getFigDetails = function (names) {
		var url = baseUrl + "getFigDetails"
		return $http.post(url, {names})
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
	
	this.searchNames = function (A, name) {
		var lenA = A.length;
		var done = [];
		var j = 0;
		for(var i = 0; i < lenA; i++) {
			found = A[i].search(name)
			if(found != -1){
				done[j++] = A[i];
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

myApp.service('DetailService', function() {

	this.allow = function (names) {

		for (var i = 0; i < names.length; i++){
			if (names[i] == 'New Figure' || names[i] == 'Starting Figure') {
				return false;
			}
		}
		return true;
	}

	this.orderList = function (figure, names) {

		var F = 0;
		var newOrder = [];
		var figNames = [];

		for (var j = 0; j < figure.length; j++){
			figNames[j] = figure[j].name;
		}

		for (var i = 0; i < names.length; i++){
			F = figNames.indexOf(names[i]);
			newOrder[i] = figure[F];
		}
		return newOrder;
	}

	this.getDetailsList = function (figure, role) {

		var A = [];
		var TM = [];
		var TL = [];
		var index = 0;
		var merger = [];

		if (role == 'man'){

			for (var i = 0; i < figure.length; i++){
				
				lnth = figure[i].man.feet_positions.length;

				for (var j = 0; j < lnth; j++) {

					// Timing:
					var sub = (Math.floor(j/3))*3;

					if (figure[i].man.timing == undefined){

						// Catering for merged cells in figures with an extra step
						if ((lnth - ((Math.floor(lnth/3))*3)) == 1){
							var lnthAm = lnth - 1;
						} else {
							var lnthAm = lnth;
						}

						// If there's no timing defined, let it be the usual '1, 2, 3' waltz timing
						TM[j] = (j+1) - sub;
					} else {

						// Catering for merged cells in figures with an extra step
						if(figure[i].man.timing[lnth - 1] == '1'){
							var lnthAm = lnth - 1;
						} else {
							var lnthAm = lnth;
						}

						// Set the timing to the defined data (most likely not '1, 2, 3' timing)
						TM[j] = figure[i].man.timing[j];
					}

					// Name:
					if (j == 0) {
						N = figure[i].name;
						hidden = 'table-cell'
					} else {
						N = '';
						hidden = 'none'
					}
					
					// Additional Notes:
					if (j == 0) {
						nM = figure[i].man.note;
					} else {
						nM = '';
					}

					// When lady's last step of a figure ends with 'OP on L side', 
					// and if the man's first step of the next figure was meant to be 'LF fwd', 
					// change it to 'LF fwd in CBMP, OP on L side'.
					if (j == 0 && figure[i].man.feet_positions[0] == 'LF fwd' && i > 0){

						if (figure[i - 1].lady.feet_positions[figure[i - 1].lady.feet_positions.length - 1] == 'LF fwd in CBMP, OP on L side'){

							figure[i].man.feet_positions[j] = 'LF fwd in CBMP, OP on L side'
						}
					}

					// Dealing with 'extra' steps
					if (j == lnth - 1 && TM[j] == 1){

						if (i != figure.length - 1){

							figure[i + 1].man.feet_positions[0] = figure[i].man.feet_positions[j];
							figure[i + 1].man.CBM[0] = figure[i].man.CBM[j];
							figure[i + 1].man.sway[0] = figure[i].man.sway[j];
							if (figure[i].man.amount_of_turn[j] != 'nil'){
								figure[i + 1].man.amount_of_turn[0] = figure[i].man.amount_of_turn[j];
							}
						}
					} else {

						// Array to go into the table:
						A[index] = { name: N, step_no: index + 1, fig_step_no: j + 1,
							feet_positions: figure[i].man.feet_positions[j], alignment: figure[i].man.alignment[j],
							amount_of_turn: figure[i].man.amount_of_turn[j], rise_and_fall: figure[i].man.rise_and_fall[j], 
							footwork: figure[i].man.footwork[j], CBM: figure[i].man.CBM[j], sway: figure[i].man.sway[j],
							timing: TM[j], note: nM, amount: lnthAm, hide: hidden}
						index++;
					}
				}
			}
		} else {

			for (var i = 0; i < figure.length; i++){
				
				lnth = figure[i].lady.feet_positions.length;

				for (var j = 0; j < lnth; j++) {

					// Timing:
					var sub = (Math.floor(j/3))*3;

					if (figure[i].lady.timing == undefined){

						// Catering for merged cells in figures with an extra step
						if ((lnth - ((Math.floor(lnth/3))*3)) == 1){
							var lnthAm = lnth - 1;
						} else {
							var lnthAm = lnth;
						}

						// If there's no timing defined, let it be the usual '1, 2, 3' waltz timing
						TL[j] = (j+1) - sub;
					} else {

						// Catering for merged cells in figures with an extra step
						if(figure[i].lady.timing[lnth - 1] == '1'){
							var lnthAm = lnth - 1;
						} else {
							var lnthAm = lnth;
						}

						// Set the timing to the defined data (most likely not '1, 2, 3' timing)
						TL[j] = figure[i].lady.timing[j];
					}

					// Name:
					if (j == 0) {
						N = figure[i].name;
					} else {
						N = '';
					}

					// Additional Notes:
					if (j == 0) {
						nL = figure[i].lady.note;
						hidden = 'table-cell'
					} else {
						nL = '';
						hidden = 'none'
					}

					// When a 'Turning Lock to R' occurs straight after a 'Natural Spin Turn',
					// the Lady doesn't brush to LF in the 'Natural Spin Turn'
					if (figure[i].name == 'Natural Spin Turn (overturned)' && i < figure.length - 1){

						if (figure[i + 1].name == 'Turning Lock to R'){

							if (j == 0){
								nL = 'The rise is taken from the ball of LF on step 5.'
							}

							if (j == lnth - 1) {

								figure[i].lady.feet_positions[j] = 'RF diag fwd'
							}
						}
					}

					// Dealing with 'extra' steps
					if (j == lnth - 1 && TL[j] == 1){

						if (i != figure.length - 1){

							figure[i + 1].lady.feet_positions[0] = figure[i].lady.feet_positions[j];
							figure[i + 1].lady.CBM[0] = figure[i].lady.CBM[j];
							figure[i + 1].lady.sway[0] = figure[i].lady.sway[j];
							if (figure[i].lady.amount_of_turn[j] != 'nil'){
								figure[i + 1].lady.amount_of_turn[0] = figure[i].lady.amount_of_turn[j];
							}
						}
					} else {

						// Array to go into the table:
						A[index] = { name: N, step_no: index + 1, fig_step_no: j + 1,
								feet_positions: figure[i].lady.feet_positions[j], alignment: figure[i].lady.alignment[j],
								amount_of_turn: figure[i].lady.amount_of_turn[j], rise_and_fall: figure[i].lady.rise_and_fall[j], 
								footwork: figure[i].lady.footwork[j], CBM: figure[i].lady.CBM[j], sway: figure[i].lady.sway[j],
								timing: TL[j], note: nL, amount: lnthAm, hide: hidden}
						index++;
					}
				}
			}
		}
		return A;
	}
})

myApp.controller('myController', function($scope, NumberService, VisibilityService, FigService, IdService, DiffService, DetailService) {

	$scope.danceSelect = "waltz"
	$scope.numSteps = 4
	$scope.numPre = 3
	$scope.numFoll = 3
	$scope.names = []
	$scope.X = []
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
	$scope.searchFor = ''
	$scope.prevRole = 'man'
	$scope.roleID = 'man'
	$scope.B = []

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
  		// alert('current id ='+$scope.id+'\nprevious id ='+$scope.prevID+'\nlast name ='+$scope.prevName+'\nnext name ='+$scope.nextName)
  		FigService.getFigNames( $scope.id, $scope.prevID, $scope.prevName, $scope.nextName, $scope.diff )
  		.then(loadSuccess, error)
  		$scope.prevID = $scope.id
  	}

  	$scope.placeFigs = function (name) {
  		$scope.name = name;
  		FigService.placeFigNames( $scope.name , $scope.id )
  	}

  	$scope.go = function () {
  		if ($scope.id != 'none') {
  			// alert($scope.id)
  			$scope.getFigs( $scope.id );
  		}
  	}

  	$scope.clear = function () {
  		$scope.searchFor = ''
  		if ($scope.id != 'none') {
  			$scope.getFigs( $scope.id );
  		}
  	}

  	$scope.deleteFig = function () {
  		if ($scope.count != 0) {
  			var vId = '#nextFig'+$scope.count
  			var aId = 'nextFig'+$scope.count
  			angular.element(document.querySelector(vId)).remove()
  			if ($scope.id == aId) {
  				if ($scope.count == 1) {
  					$scope.id = 'startFigure'
  				} else {
  					$scope.id = 'nextFig'+($scope.count-1)
  				}
  				$scope.prevID = ''
  				$scope.count--
  				$scope.go();
  			} else {
  				$scope.count--
  			}
  		}
  	}

  	function loadSuccess (json) {
    	A = json.data;

    	if ($scope.searchFor != ''){
    		A = IdService.searchNames( A, $scope.searchFor )
    	}

    	$scope.names = IdService.removeDups(A)
    	if ($scope.names != ''){
    		document.getElementById("figureList").style.display = "block";
    	} else {
    		document.getElementById("figureList").style.display = "none";
    	}
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

  	$scope.seeDetail = function () {

  		count = $scope.count;
  		nms = [];

  		// Get the names of all listed figures from their id
  		// Starting figure:
  		nms[0] = IdService.getName ( 'startFigure', count );

  		// All other figures:
  		if (count > 0){
  			for (var i = 1; i < count+1; i++){
  				nId = 'nextFig'+i;
  				nms[i] = IdService.getName ( nId, count );
  			}
  		}

  		// Check if the user is allowed to access this button
  		access = DetailService.allow(nms);

  		// Retrieve data from the database
  		if (access) {

  			document.getElementById("mainPage").style.display = "none";
  			document.getElementById("detailPage").style.display = "block";

  			FigService.getFigDetails(nms)
  			.then(function successCallback(json) {
    			A = json.data;
    			// alert($scope.X)

    			// Order the figures based on the order in Routine Skeleton, i.e. Same order as 'nms'
    			$scope.B = DetailService.orderList(A, nms)

    			// Change the data to be step by step, rather than figure by figure
    			$scope.X = DetailService.getDetailsList($scope.B, $scope.roleID);

  			}, function errorCallback(err) {
    			console.log(err)
  			});
  		}

  		// Populate the table with the data retrieved using ng-repeat (done in html)
  	}

  	$scope.changeRole = function (role) {

  		$scope.roleID = role;

  		// Change the button's appearance
  		document.getElementById(role).className = 'roleSelected';
  		if ($scope.prevRole != role){
  			document.getElementById($scope.prevRole).className = 'topButtons';
  		}
		$scope.prevRole = role;

  		// Change the table display
  		$scope.X = DetailService.getDetailsList($scope.B, $scope.roleID);

  	}

  	$scope.noDetail = function () {
  		document.getElementById("detailPage").style.display = "none";
  		document.getElementById("mainPage").style.display = "block";
  	}

  	$scope.printPdf = function () {

  		window.print();
		// var doc = new jsPDF('landscape', 'pt', 'a4');

        // // source can be HTML-formatted string, or a reference
        // // to an actual DOM element from which the text will be scraped.
        // source = angular.element(document.querySelector("#detailPage")).html();


        // // we support special element handlers. Register them with jQuery-style 
        // // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
        // // There is no support for any other type of selectors 
        // // (class, of compound) at this time.
        // specialElementHandlers = {
        //     // element with id of "bypass" - jQuery style selector
        //     '#bypassme': function (element, renderer) {
        //         // true = "handled elsewhere, bypass text extraction"
        //         return true
        //     }
        // };
        // margins = {
        //     top: 40,
        //     bottom: 40,
        //     left: 40,
        //     width: 580
        // };
        // // all coords and widths are in jsPDF instance's declared units
        // // 'inches' in this case
        // pdf.fromHTML(
        // source, // HTML string or DOM elem ref.
        // margins.left, // x coord
        // margins.top, { // y coord
        //     'width': margins.width, // max width of content on PDF
        //     'elementHandlers': specialElementHandlers
        // },

        // function (dispose) {
        //     // dispose: object with X, Y of the last line add to the PDF 
        //     //          this allow the insertion of new lines after html
        //     pdf.save('Test.pdf');
        // }, margins);

  	}

  	function error (err) {
    	console.log(err)
  	}

  	$scope.dispCreateFig = function () {
    	VisibilityService.visCreateFig()
    	document.getElementById("go").disabled = true;
    	document.getElementById("clr").disabled = true;
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
    	document.getElementById("go").disabled = false;
    	document.getElementById("clr").disabled = false;
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
    	document.getElementById("go").disabled = false;
    	document.getElementById("clr").disabled = false;
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