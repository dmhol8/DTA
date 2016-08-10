var express = require('express')
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID

var app = express()

var url = 'mongodb://localhost:27017/dance';

var findFigureNames = function(db, callback) {
	var A = [];
   	var cursor = db.collection('figures').find({}, {_id: 0, name: 1});
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

MongoClient.connect(url, function(err, db) {
  	assert.equal(null, err);

  	var data1 = findFigureNames(db, function(A) {
      	// db.close();
      	console.log(A)
  	});
});

app.get('/chClass', function (req, res) {

 	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);

 		console.log('I just read stuff from the database')
 		var data = findFigureNames(db, function(A) {
 			console.log(A)
 			res.send(A)
 		});
  		
	});
 	
})

app.use(bodyParser.json())

app.use(express.static('../client'))

app.listen(8080)
