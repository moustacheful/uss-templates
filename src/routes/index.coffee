app.get '/', (request,response) ->
	html = jade.renderFile 'views/index.jade'
	response.send html

app.post '/compile', (request,response) ->

	jadeString = request.body.jade
	jadeString = [
		'include /mixins/accordion.jade',
		'include /mixins/beca-table.jade',
		'include /mixins/malla.jade',
		''
	].join('\n') + jadeString

	response.send jade.render jadeString,
		pretty: true
		basedir: './'