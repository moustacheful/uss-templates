var app = {
	initialize: function(){
		app.forms();
	    app.editor = ace.edit("editor");
    	editor.setTheme("ace/theme/monokai");
    	editor.getSession().setMode("ace/mode/jade");
	},
	forms: function(){
		$('form').submit(function(evt){
			evt.preventDefault();
			var el = $(this);
			var action = el.attr('action')
			var method = el.attr('method')
			$.ajax({
				url: action,
				method: method,
				data: el.serialize()
			}).success(function(data){
				$('.result').val(data);
			})
		})
	}
}
$(document).ready(function(){
	app.initialize();
})
