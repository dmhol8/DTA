var express = require('express')
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID

var app = express()

var url = 'mongodb://localhost:27017/dance';

app.use(bodyParser.json())

var findFigureNames = function(db, data, callback) {

	var A = [];
	var C = [];
	var D = [];
	var B = [];
	console.log(data.prevName);
	console.log(data.nextName);
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
      					// console.dir(doc1);
      					var numItems = db.collection('figures').find({"name":doc1.follow, "difficulty": { $in: data.diff }}).count()
      					.then(function(numItems) {
      						if (numItems) {
      							var B = doc1.follow
      						}

      						C = C.concat(B)
      					});
      				} else {

         				cursor3.each(function(err, doc2) {
      						assert.equal(err, null);
      						if (doc2 != null) {
      							// console.dir(doc1);
      							var numItems = db.collection('figures').find({"name":doc2.precede, "difficulty": { $in: data.diff }}).count()
      							.then(function(numItems) {
      								if (numItems) {
      									var B = doc2.precede
      								}

      								D = D.concat(B)
      							});
      						} else {
      							A = A.concat(C)
      							A = A.concat(D)
         						callback(A);
      						}
   						});
      				}
   				});
         	} else if (cursor3 != null) {
         		cursor3.each(function(err, doc2) {
      				assert.equal(err, null);
      				if (doc2 != null) {
						// console.dir(doc1);
						var numItems = db.collection('figures').find({"name":doc2.precede, "difficulty": { $in: data.diff }}).count()
						.then(function(numItems) {
							if (numItems) {
								var B = doc2.precede
							}

							D = D.concat(B)
						});
      				} else {
      					A = A.concat(D)
         				callback(A);
      				}
   				});
         	} else if (cursor2 != null) {
         		cursor2.each(function(err, doc1) {
      				assert.equal(err, null);
      				if (doc1 != null) {
      					// console.dir(doc1);
      					var numItems = db.collection('figures').find({"name":doc1.follow, "difficulty": { $in: data.diff }}).count()
      					.then(function(numItems) {
      						if (numItems) {
      							var B = doc1.follow
      						}

      						C = C.concat(B)
      					});
      				} else {
      					A = A.concat(C)
         				callback(A);
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
 			// console.log(A)
 			res.send(A)
 		});
  		
	});	
})

app.use(bodyParser.json())

app.use(express.static('../client'))

app.listen(8080)