var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoDB = require('mongodb')
var done = function(){
	console.log('I just wrote to the database')
	res.end("done")
}

app.use(bodyParser.json())

app.use(express.static('../client'))

app.listen(8080)
