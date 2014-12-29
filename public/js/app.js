var helperApp = {
	initialize: function(){
		helperApp.forms();
	    helperApp.editor = ace.edit("editor",'ace/mode/jade');
    	helperApp.editor.setTheme("ace/theme/tomorrow")
    	helperApp.editor.setShowInvisibles(true);
    	helperApp.editor.setDisplayIndentGuides(true);
    	helperApp.editor.getSession().setMode("ace/mode/jade")
    	helperApp.editor.getSession().setUseWrapMode(true);
    	helperApp.editor.getSession().setUseSoftTabs(false);
		$('.load-example').click(function(){
			var option = $('#type').find('option:selected');
			$.ajax({
				url: 'examples/' + option.data('example')
			}).success(function(data){
				helperApp.editor.setValue(data)
			})
		});

		$('textarea.result').click(function(evt){
			$(this).select();
		});
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
									.append(data.trim());
				app.init()
			}).error(function(xhr){
				app.alert.open({
					title: 'Ocurrió un error',
					content: xhr.responseText
				})
			})
		})
	}
}
$(document).ready(function(){
	helperApp.initialize();
})
