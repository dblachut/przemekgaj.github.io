var debug = true;

$(document).ready(function(){

	//dropDb();
	connectDb();
	createDb();
	selectFromDb();
	//var string = '{$i:Z[8]}*{$opor}/{$napiecie}*#pi';
	var formula;
	
	/*if(isFormulaCorrect(f)){
		console.log('chuj');
		console.log(parseFormula(f));
		
	}
	var s = '2^3*4-9+4*(4-2)';
	console.log(isEquationCorrect(s));
	
	console.log(calculateONP(translateToONP(s)));
	*/
	
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
			insertFunctionToDb($('input[name="formula-name"]').val(), formula.ref);
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
		
		
		//$('#popupDialog').html(two_buttons.html());
		
		formula = new reference($('textarea[name="formula"]').val());
		
		if(isFormulaCorrect(formula)){
			$('#popupDialog').html(two_buttons.html());
			$('.formula-correct').text('Formuła jest poprawna');
		}
		else {
			$('#popupDialog').html(one_button.html());
			$('.formula-correct').text('Formuła jest niepoprawna');
		}
		
	});
	
	$(document).on('tap', '.add-value', function(){
		
		var name = $(this).parent().find('input[name="name"]').val();
		var len = $(this).parent().parent().find('.appended-dynamic').length;
		$(this).parent().removeClass('ui-last-child');
		
		if($(this).parent().parent().find('.appended-dynamic').length > 0){			 
			$('<li class="appended-dynamic ui-li-static ui-body-inherit"><div class="ui-listview-label">'+ name + '[' + len +']' +
		         	 									 ':</div><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="text" name="'+ name + '[' + len +']' +
		         	 									 '" class="ui-input-listview" value=""/></li></div> ').insertAfter($(this).parent().parent().find('.appended-dynamic:last'));
		}
		else {
			$('<li class="appended-dynamic ui-li-static ui-body-inherit"><div class="ui-listview-label">'+ name + '[' + len +']' +
		         	 									 ':</div><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="text" name="'+ name + '[' + len +']' +
		         	 									 '" class="ui-input-listview" value=""/></li></div> ').insertAfter($(this).parent());
		}
		
		return false;
		
	});
	
	//$('').onabort;
	//
	
	$(document).on('tap', '.resolv-function', function(){
		
		var formulas = Array();
		var values = Array();
		var parent = $(this).parent();
		var formula = parent.find('.formula').html();
		
		parent.find('input[type!=hidden]').each(function(){
			formula = formula.replace('{$'+$(this).attr('name')+'}', '('+$(this).val()+')');
		});
		
		if(parent.find('input[name="step"]').length > 0)
		{
			var from = parseFloat(parent.find('input[name="from"]').val());
			var to = parseFloat(parent.find('input[name="to"]').val());
			var step = parseFloat(parent.find('input[name="step"]').val());
			//console.log(from + ' ' +to + ' '+step);
			var exp = formula.split(':');
			//console.log(exp);
			var rplc = exp[1].split('}')[0];
			var st = exp[0].split('{')[1];
			console.log(st+':' + rplc + '}');
			for(;from < to; from+=step)
			{
				formulas.push(formula.replace('{'+st+':' + rplc + '}', '('+from+')'));
				values.push(from);
			}
			formulas.push(formula.replace('{'+st+':' + rplc + '}', '('+to+')'));
			values.push(to);
			console.log(formulas);
		}
		else if(parent.find('.appended-dynamic').length > 0)
		{
			parent.find('.appended-dynamic').each(function(){
				
				var exp = formula.split(':');
				var rplc = exp[1].split('}')[0];
				exp = $(this).find('input').attr('name').split('[')[0];
				
				formula = formula.replace('{$'+exp+':' + rplc + '}', '('+$(this).find('input').val()+')');
				formulas.push(formula);
				values.push($(this).find('input').val());
			});
		}
		else
		{
			formulas.push(formula);
			values.push('');
		}
		
		for(var i=0; i<formulas.length; i++){
			
			parent.parent().find('#fragment-2').append('<tr><td>'+ values[i] +'</td><td>'+ calculateONP(translateToONP(formulas[i])) +'</td></tr>');
			
		}
		
		return false;
	});
	
});