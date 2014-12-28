express = require 'express'
bodyParser = require 'body-parser'
jade = require 'jade'
util = require 'util'

app = express()

app.set 'port', process.env.PORT || 5000
app.listen app.get('port'), ->
	console.log 'Node running at localhost:' + app.get 'port' 

# Middleware
app.use bodyParser.urlencoded
	extended: false 
app.use(express.static(__dirname + '/public'))
app.use('/bower',express.static(__dirname + '/bower_components'))


#app.all '*', (request,response) ->
#	response.send '404!'