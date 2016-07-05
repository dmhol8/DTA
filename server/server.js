var express = require('express')
var app = express()
var bodyParser = require('body-parser')

var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID
var url = 'mongodb://localhost:27017/dance';

var findFigures = function(db, callback) {
   var cursor =db.collection('figures').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  findFigures(db, function() {
      db.close();
  });
});

app.use(bodyParser.json())

app.use(express.static('../client'))

app.listen(8080)
