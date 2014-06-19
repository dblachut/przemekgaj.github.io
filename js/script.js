function checkFormula(formula){
	//TODO: check formula is ok
	
	if(formula.length > 0)
		return true;
	else
		return false;
	
}

$(document).ready(function(){
	
	$(document).on('tap','.edit-functions',  function(){
		
		var addFunction = $('.functions-listview').find('li:last').clone();
		addFunction.addClass('ui-first-child')
		addFunction.find('a').removeClass('ui-icon-carat-r').addClass('ui-icon-plus').addClass('add-function').html('Dodaj funkcję').attr('href', '#add-function');
		$('.functions-listview').append(addFunction);
		
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
		
		$('.functions-listview').find('li:last').remove();
		
	});
	
	/*$(document).on('tap', '.check-formula', function(){
		
		if(checkFormula($('input[name="formula"]').text())){
			$('#overlay').show();
		}
		else {
			$('#overlay').show();
		}
		
	});*/
	
});