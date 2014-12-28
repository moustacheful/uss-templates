var helperApp = {
	initialize: function(){
		helperApp.forms();
	    helperApp.editor = ace.edit("editor");
    	helperApp.editor.setTheme("ace/theme/tomorrow")
    	helperApp.editor.getSession().setMode("ace/mode/jade")
    	helperApp.editor.getSession().setUseWrapMode(true);
    	helperApp.editor.getSession().setUseSoftTabs(false);
	},
	forms: function(){
		$('form').submit(function(evt){
			evt.preventDefault();
			var el = $(this);
			var action = el.attr('action')
			var method = el.attr('method')

			$.ajax({
				url: action,
				type: method,
				data:{
					jade:helperApp.editor.getSession().getValue()
				}
			}).success(function(data){
				var htmlClass = $('#type').val();
				$('.result').val(data);
				$('.result-preview').removeClass()
									.addClass('result-preview '+htmlClass)
									.empty()
									.append(data);
				app.init()
			})
		})
	}
}
$(document).ready(function(){
	helperApp.initialize();
})
