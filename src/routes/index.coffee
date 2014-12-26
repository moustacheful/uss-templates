app.get '/', (request,response) ->
	html = jade.renderFile 'views/index.jade'
	response.send html

app.post '/compile', (request,response) ->
	response.send jade.render request.body.jade,
		pretty: true

