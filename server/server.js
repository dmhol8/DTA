var express = require('express')
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID

var app = express()

var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/dance';

app.use(bodyParser.json())

console.log(__dirname);

var findFigureNames = function(db, data, callback) {

	var A = [];
	var C = [];
	var D = [];
	var B = [];
	var Z = [];
	var Y = [];
	var X = [];
	// console.log(data.prevName);
	// console.log(data.nextName);
	var cursor2 = null; 
	var cursor3 = null;

	if (data.prevName == 'New Figure' || data.prevName == 'Starting Figure') {
		if (data.nextName == 'New Figure') {
			var cursor = db.collection('figures').find({"difficulty": { $in: data.diff }}, {_id: 0, name: 1});
		} else {
			var cursor = db.collection('figures').find({"follow":data.nextName, "difficulty": { $in: data.diff }}, {_id: 0, name: 1});

			// Check the precedes of the following figure, return all precedes
			var cursor3 = db.collection('figures').find({"name":data.nextName}, {_id: 0, precede: 1});
		}
	} else {
		// Check the follows of the preceding figure, return all follows
		var cursor2 = db.collection('figures').find({"name":data.prevName}, {_id: 0, follow: 1});

		if (data.nextName == 'New Figure') {
   			var cursor = db.collection('figures').find({"precede":data.prevName, "difficulty": { $in: data.diff }}, {_id: 0, name: 1});
   		} else {
   			var cursor = db.collection('figures').find({"precede":data.prevName, "follow":data.nextName, "difficulty": { $in: data.diff }}, {_id: 0, name: 1});

   			// Check the precedes of the following figure, return all precedes
   			var cursor3 = db.collection('figures').find({"name":data.nextName}, {_id: 0, precede: 1});
   		}
   	}

   	cursor.each(function(err, doc) {
      	assert.equal(err, null);
      	if (doc != null) {
      		// console.dir(doc);
      		var B = doc.name
      		A = A.concat(B)
      	} else {
      		if (cursor2 != null && cursor3 != null) {
         		cursor2.each(function(err, doc1) {
      				assert.equal(err, null);
      				if (doc1 != null) {


      					var cursor5 = db.collection('figures').find({"name": { $in: doc1.follow }, "difficulty": { $in: data.diff }}, {_id: 0, name: 1});

	      				cursor5.each(function(err, doc4) {
      						assert.equal(err, null);
      						if (doc4 != null) {
								// console.dir(doc4);
      							X = doc4.name
      							C = C.concat(X)

      						} else {

      							cursor3.each(function(err, doc2) {
		      						assert.equal(err, null);
		      						if (doc2 != null) {

		      							var cursor4 = db.collection('figures').find({"name": { $in: doc2.precede }, "difficulty": { $in: data.diff }}, {_id: 0, name: 1});
			      				
					      				cursor4.each(function(err, doc3) {
				      						assert.equal(err, null);
				      						if (doc3 != null) {
												// console.dir(doc3);
				      							D = doc3.name
				      							Y = Y.concat(D)

				      						} else {

												// The figures that can be added are follows of the preceding figure that match a precede of the following figure.
				      							for (var i = 0; i < Y.length; i++) {
										    		if (C.indexOf(Y[i]) !== -1) {
										        		Z.push(Y[i])
										    		}
												}

				      							A = A.concat(Z)
				         						callback(A);
				      						}
				   						});
		      						} 
		   						});
      						}
   						});
      				}
   				});
         	} else if (cursor3 != null) {
         		cursor3.each(function(err, doc2) {
      				assert.equal(err, null);
      				if (doc2 != null) {

						var cursor4 = db.collection('figures').find({"name": { $in: doc2.precede }, "difficulty": { $in: data.diff }}, {_id: 0, name: 1});
	      				
	      				cursor4.each(function(err, doc3) {
      						assert.equal(err, null);
      						if (doc3 != null) {
								// console.dir(doc3);
      							D = doc3.name
      							Y = Y.concat(D)

      						} else {
      							A = A.concat(Y)
         						callback(A);
      						}
   						});

      				}
   				});
         	} else if (cursor2 != null) {
         		cursor2.each(function(err, doc1) {
      				assert.equal(err, null);
      				if (doc1 != null) {

	      				var cursor4 = db.collection('figures').find({"name": { $in: doc1.follow }, "difficulty": { $in: data.diff }}, {_id: 0, name: 1});

	      				cursor4.each(function(err, doc3) {
      						assert.equal(err, null);
      						if (doc3 != null) {
								// console.dir(doc3);
      							D = doc3.name
      							Y = Y.concat(D)

      						} else {
      							A = A.concat(Y)
         						callback(A);
      						}
   						});

					} 
   				});
         	} else {

         		callback(A)
         	}
      	}
   	});
};

app.post('/getFigNames', function (req, res) {
	
 	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
 
 		console.log('I just read stuff from the database')
 		var data = findFigureNames(db, req.body, function(A) {
 			console.log(A)
 			res.send(A)
 		});
  		
	});	
})

var findFigureDetails = function(db, data, callback) {
	var cursor = db.collection('figures').find({"name": { $in: data.names }}, {_id: 0, name: 1, man: 1, lady: 1});
	AA = [];
	cursor.each(function(err, doc) {
      	assert.equal(err, null);
      	if (doc != null) {
      		var BB = doc
      		AA = AA.concat(BB)
      	} else {
      		callback(AA)
      	}
    })
}

app.post('/getFigDetails', function (req, res) {
	
 	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
 
 		console.log('I just read stuff from the database')
 		var data = findFigureDetails(db, req.body, function(A) {
 			console.log(A)
 			res.send(A)
 		});
  		
	});	
})

var seeVisual = function(db, data, callback) {
	var cursor = db.collection('figures').find({difficulty: 'Student Teacher'}, {_id: 0, name: 1, precede: 1, follow: 1});
	AA = [];
	cursor.each(function(err, doc) {
      	assert.equal(err, null);
      	if (doc != null) {
      		var BB = doc
      		AA = AA.concat(BB)
      	} else {
      		callback(AA)
      	}
    })
}

app.post('/seeVis', function (req, res) {
	
 	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
 
 		console.log('I just read stuff from the database')
 		var data = seeVisual(db, req.body, function(A) {
 			console.log(A)
 			res.send(A)
 		});
  		
	});	
})

var findTime = function(db, data, callback) {
	var cursor = db.collection('figures').find({name: data.name}, {_id: 0, "man.feet_positions": 1});
	AA = [];
	cursor.each(function(err, doc) {
      	assert.equal(err, null);
      	if (doc != null) {
      		console.log(doc.man)
      		var tm = doc.man.feet_positions
      		AA = AA.concat(tm)
      	} else {
      		callback(AA)
      	}
    })
}

app.post('/findTime', function (req, res) {
	
 	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
 
 		console.log('I just read stuff from the database')
 		var data = findTime(db, req.body, function(A) {
 			console.log(A)
 			res.send(A)
 		});
  		
	});	
})

app.use(bodyParser.json())

app.use('/', express.static(__dirname+'/client'))

app.listen(process.env.PORT || 5000)