$(document).ready(function(){
	
	$(document).on('tap','.edit-functions',  function(){
		
		$('.functions-listview').find('a').each(function(){
			$(this).removeClass('ui-icon-carat-r').addClass('ui-icon-minus');
		});
		
		$(this).removeClass('edit-functions').addClass('done-functions');
		$(this).html('Gotowe');
		
	});
	
	$(document).on('tap', '.done-functions', function(){
		
		$('.functions-listview').find('a').each(function(){
			$(this).removeClass('ui-icon-minus').addClass('ui-icon-carat-r');
		});
		
		$(this).removeClass('done-functions').addClass('edit-functions');
		$(this).html('Edytuj');
		
	});
	
	
	
});