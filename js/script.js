

$(document).ready(function(){

	//dropDb();
	connectDb();
	createDb();
	selectFromDb();
	
	//console.log(opObject.getOperator('*'));
	console.log(translateToONP('2/5+5*(2-4)='));
	
	$(document).on('tap','.edit-functions',  function(){
		var addFunction = $('.functions-listview').find('li:last').clone();
		addFunction.addClass('ui-first-child').removeClass('ui-invisible');
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
		
		
		//dropDb();
		//createDb();
		//return false;
		
		
	});
	
});