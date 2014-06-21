var db;

function createDb(){
	db = openDatabase ("Test", "1.0", "Test", 65535);
	
	db.transaction (function (transaction) {
		var sql = "CREATE TABLE functions " +
				  " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
		          "name VARCHAR(100) NOT NULL, " + 
		          "func TEXT)";
		transaction.executeSql (sql, undefined, function (){ 
			console.log ("Table created");
		},function () { 
			console.log ("Table not created");
		});
	});
}

function dropDb(){
	db = openDatabase ("Test", "1.0", "Test", 65535);

	db.transaction (function (transaction) {
		var sql = "DROP TABLE functions";
		transaction.executeSql (sql, undefined, function (){ 
			console.log ("Table deleted");
		},function () { 
			console.log ("Table not deleted");
		});
	});
}

function insertFunctionToDb(name, func){
	db = openDatabase ("Test", "1.0", "Test", 65535);
	
	var ret = false;
	db.transaction (function (transaction) {
	    var sql = "INSERT INTO functions (name, func) VALUES (?, ?)";
	    transaction.executeSql (sql, [name, func], function (){ 
	      	ret = true;
	    }, function (){ 
	      	ret = false;
	    });
	});
	return ret;
}

function isDigit(c)
{
	return c >= '0' && c <= '9';
}

function isLetter(c)
{
	return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

var variables;

function isFormulaCorrect(formula)
{
	var openingBrackets = 0;
	var closingBrackets = 0;
	var i;
	var variable = false;
	var variable_name = '';
	variables = Array();

	for(i=0; i<formula.length; ++i)
	{
		while(formula[i] == ' ')
			i++;

		if(formula[i] == '#')
		{
			if(i+1 >= formula.length || !isLetter(formula[i+1]))
			{
				console.log("Error brak identyfikatora stalej!");
				return false;
			}

			var j = i+1;
			var constName = "";
			while((j < formula.length && (isLetter(formula[j]) || isDigit(formula[j]))))
				constName += formula[j++];
			
			//console.log(constants.constantValue('pi'));
			if( !constants.constantExists(constName) ){
				console.log("Error stala " + constName + " nie istnieje!");
				return false;
			}
		}

		if(formula[i] == '{')
		{
			openingBrackets++;
			if(i+1 >= formula.length || formula[i+1] != '$')
			{
				console.log("Error brak znaku $ w argumencie!");
				return false;
			}
			variable = true;
		}
		else if(formula[i] == '}')
		{
			closingBrackets++;
			variable = false;
			variables.push(variable_name);
			variable_name = '';
		}
		
		if(variable && formula[i] != '{')
		{
			variable_name += formula[i];
		}
		
	}

	if(openingBrackets != closingBrackets)
	{
		console.log("Error bledna liczba nawiasow argumentow!");
		return false;
	}

	console.log( "Potrzebujemy: " + openingBrackets + " argumentow uzytkownika.");
	return true;
}

//Singleton constants
var constants = new function(){
	
	//this.constants = new Array();
	this.c = new Array();

	this.constantExists = function(name)
	{
		if(this.c[name])
			return true;
		else
			return false;
	}

	// constantExists should be called before to check 
	// if a constant of given name is on the list
	this.constantValue = function(name)
	{
		return this.c[name];
	}

	// Constant names can only be formed with letters and digits
	this.c["pi"] = 3.14159265359;
	this.c["three"] = 3.00;
	this.c["luckynumber"] = 7;
	this.c["p1"] = 1.1111111;
	
}

function selectFromDb(){
	db = openDatabase ("Test", "1.0", "Test", 65535);
	
	db.transaction (function (transaction) {
	    var sql = "SELECT * FROM functions";
	    transaction.executeSql (sql, undefined, 
	    function (transaction, result){
	    	//alert(result.rows.length+'');
	      if (result.rows.length){
	      	$('.functions-listview li').remove();
	      	$('.appended-functions').remove();
	        for (var i = 0; i < result.rows.length; i++){
	          var row = result.rows.item (i);
	          var id = row.id;
	          var name = row.name;
	          var func = row.func;
	          
	          $('.functions-listview').append('<li><a href="#f' + id + '" data-transition="slide" class="ui-btn ui-btn-icon-right ui-icon-carat-r">' + name + '</a></li>');
	          //alert('i = '+i);
	          var page = $('#function-sketch').clone();
	          page.attr('id', 'f' + id);
	          page.addClass('appended-functions');
	          page.find('h1').html(name);
	          //console.log(page.find('ul'));
	          
	          if(isFormulaCorrect(func))
	          for(var j = 0; j<variables.length; j++){
		          //page.find('.input-list').append('<li><a class="ui-btn ui-btn-icon-right ui-icon-carat-r">' + variables[i] + '</a></li>');
		          page.find('.input-list').append('<li><div class="ui-listview-label">'+ variables[j] +':</div><input type="text" name="'+ variables[j] +'" class="ui-input-listview" value=""/></li> ');
	          }
	          
	          //$('div[data-role="page"]').append(page);
	          page.appendTo('body');
	          //console.log(page);
	        }
	      }
	      else {
	      	
	      }
	      
	      $('.functions-listview li').removeClass('ui-last-child');
	      $('.functions-listview li:last').addClass('ui-last-child');
	      
	    }, function(){
		    alert('cannot connect to db');
	    });
	});
}

$(document).ready(function(){

	//dropDb();
	createDb();
	selectFromDb();
	
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