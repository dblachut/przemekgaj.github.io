var debug = true;
var charts = [];
var chartWidth;
var chartHeight;

$(document).ready(function(){
	//dropDb();
	connectDb();
	createDb();
	selectFromDb();
	chartWidth = $(window).width()*0.95;
	chartHeight = $(window).height()*0.8;
	
	var formula;

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
		         	 									 ':</div><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="number" pattern="[-0-9.,]*" step="0.01" name="'+ name + '[' + len +']' +
		         	 									 '" class="ui-input-listview" value=""/></li></div> ').insertAfter($(this).parent().parent().find('.appended-dynamic:last'));
		}
		else {
			$('<li class="appended-dynamic ui-li-static ui-body-inherit"><div class="ui-listview-label">'+ name + '[' + len +']' +
		         	 									 ':</div><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="number" pattern="[-0-9.,]*" step="0.01" name="'+ name + '[' + len +']' +
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
		
		formula = insertConstantValues(formula);
		
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
			//console.log(st+':' + rplc + '}');
			for(;from < to; from+=step)
			{
				formulas.push(formula.replace('{'+st+':' + rplc + '}', '('+from.toFixed(16)+')'));
				values.push(from);
			}
			formulas.push(formula.replace('{'+st+':' + rplc + '}', '('+to+')'));
			values.push(to);
		}
		else if(parent.find('.appended-dynamic').length > 0)
		{
			var exp = formula.split(':');
			var rplc = exp[1].split('}')[0];
			var st = exp[0].split('{')[1];
			
			parent.find('.appended-dynamic').each(function(){
				formulas.push(formula.replace('{'+st+':' + rplc + '}', '('+$(this).find('input').val()+')'));
				values.push($(this).find('input').val());
			});
		}
		else
		{
			formulas.push(formula);
		}
		
		var results = Array();
		parent.parent().find('#fragment-2').text('');
		for(var i=0; i<formulas.length; i++){
			var value = calculateONP(translateToONP(formulas[i]));
			results.push(value);
			parent.parent().find('#fragment-2').append('<tr><td>'+ (values[i] === undefined ? '':values[i]) +'</td><td>'+ value +'</td></tr>');
			
		}
		
		var chartRes = Array();
		var chartValues = Array();
		
		
		
		values.forEach(function(v){
			chartValues.push(parseFloat(v).toFixed(2));
		});
		
		results.forEach(function(r){
			chartRes.push(r);
		});
		
		//console.log(formulas);
		//console.log(chartValues);
		//console.log(chartRes);
		
		var data = {
			labels : chartValues,
			datasets : [
				{
					fillColor : "rgba(151,187,205,0.5)",
					strokeColor : "rgba(151,187,205,1)",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "rgba(151,187,205,1)",
					data : chartRes
				}
			]
		}
		
		var id = $(this).parent().parent().parent().parent().attr('id');
		console.log(id);
		//console.log(charts[$(this).parent().parent()]);
		charts[id].Line(data,chartOptions);
		//new Chart(ctx).Line(data,chartOptions);
		parent.parent().parent().parent().find('.tabs').tabs( 'option', 'active', 1 );
		//console.log(parent.parent().parent().parent().find('.tabs'));
		//parent.parent().find('#fragment-1').css('display', 'none').attr('aria-expanded', 'false').attr('aria-hidden', 'true');
		//parent.parent().find('#fragment-2').css('display', 'block').attr('aria-expanded', 'true').attr('aria-hidden', 'false');
		return false;
	});
	
});