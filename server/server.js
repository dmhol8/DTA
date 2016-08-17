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
	console.log(data.prevName);
	console.log(data.nextName);
	// Check the precedes and follows of the current figure, return names
	if (data.prevName == 'New Figure') {
		if (data.nextName == 'New Figure') {
			var cursor = db.collection('figures').find({}, {_id: 0, name: 1});
		} else {
			var cursor = db.collection('figures').find({"follow":data.nextName}, {_id: 0, name: 1});
		}
	} else {
		if (data.nextName == 'New Figure') {
   			var cursor = db.collection('figures').find({"precede":data.prevName}, {_id: 0, name: 1});
   		} else {
   			var cursor = db.collection('figures').find({"precede":data.prevName, "follow":data.nextName}, {_id: 0, name: 1});
   		}
   	}

 	// Check the follows of the preceding figure, return all follows
 		//var cursor2 = db.collection('figures').find({"name":data.prevName}, {_id: 0, follow: 1});

 	// Check the precedes of the following figure, return all precedes
 		//var cursor3 = db.collection('figures').find({"name":data.nextName}, {_id: 0, precede: 1});

   	cursor.each(function(err, doc) {
      	assert.equal(err, null);
      	if (doc != null) {
      		// console.dir(doc);
      		var B = doc.name
      		A = A.concat(B)
      	} else {
         	callback(A);
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

app.use(bodyParser.json())

app.use(express.static('../client'))

app.listen(8080)
