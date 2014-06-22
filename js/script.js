var debug = true;

$(document).ready(function(){

	//dropDb();
	connectDb();
	createDb();
	selectFromDb();
	
	//console.log(opObject.getOperator('*'));
	
	
	$(document).on('tap','.edit-functions',  function(){
		var addFunction = $('.functions-listview').find('li:last').clone();
		addFunction.addClass('ui-first-child').removeClass('ui-invisible');
		addFunction.find('a').removeClass('ui-icon-carat-r').addClass('ui-icon-plus').addClass('add-function').html('Dodaj funkcję').attr('href', '#add-function');
		$('.functions-listview').append(addFunction);
		
		$('.functions-listview').find('a').each(function(){
			if($(this).hasClass('ui-icon-carat-r'))
				$(this).removeClass('ui-icon-carat-r').addClass('ui-icon-minus').addClass('remove-function');
		});
		
		$(this).removeClass('edit-functions').addClass('done-functions');
		$(this).html('Gotowe');
		
	});
	
	$(document).on('tap', '.done-functions', function(){
		
		$('.functions-listview').find('a').each(function(){
			$(this).removeClass('ui-icon-minus').removeClass('remove-function').addClass('ui-icon-carat-r');
		});
		
		$(this).removeClass('done-functions').addClass('edit-functions');
		$(this).html('Edytuj');
		
		$('.functions-listview').find('li:last').remove();
		
	});
	
	$(document).on('tap', '.remove-function', function(){
		
		var id = $(this).attr('href').replace('#f', '');
		
		deleteFromDb(id);
		$($(this).attr('href')).remove();
		$(this).parent().remove();
		
		
		return false;
		
	});
	
	var one_button;
	var two_buttons;
	
	
	$(document).on('tap', '.save-formula', function(){
		
		if( $('input[name="formula-name"]').val() != '' && $('textarea[name="formula"]').val() != '' ) {
			insertFunctionToDb($('input[name="formula-name"]').val(), $('textarea[name="formula"]').val());
			selectFromDb();
			$('.done-functions').addClass('edit-functions').removeClass('done-functions');
			$('.edit-functions').html('Edytuj');
			$('#add-function').removeClass('ui-page-active');
			$.mobile.changePage('#main', {transition: "slide"});
		}
		else {
			$('#popupDialog').html(one_button.html());
			return false;
		}

	});
	
	var opened = false;
	
	$(document).on('tap', '.check-formula', function(){
		
		//$('#popupDialog').html(two_buttons);
		if(!opened){
			one_button = $('#popupDialog').clone();
			two_buttons = $('#popupDialog').clone();
			one_button.find('.save-formula').remove();
			opened = true;
		}
		
		
		$('#popupDialog').html(two_buttons.html());
		
		if(isFormulaCorrect($('textarea[name="formula"]').val())){
			$('.formula-correct').text('Formuła jest poprawna');
		}
		else {
			$('.formula-correct').text('Formuła jest niepoprawna');
		}
		
	});
	
	//$('').onabort;
	//
	
	$(document).on('tap', '.resolv-function', function(){
		
		
		var inputs = $(this).parent().find('input');
		var formula = $(this).parent().parent().find('.formula').text();
		var results = $(this).parent().parent().parent().find('#fragment-2');
		
		
		inputs.each(function(){
		
			formula = formula.replace('{'+$(this).attr('name')+'}', $(this).val());
			
		});
		
		results.html(calculateONP(translateToONP(formula + '=')));
		
	});
	
});