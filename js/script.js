function checkFormula(formula){
	//TODO: check formula is ok
	
	if(formula.length > 0)
		return true;
	else
		return false;
	
}

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

function selectFromDb(){
	db = openDatabase ("Test", "1.0", "Test", 65535);
	
	db.transaction (function (transaction) {
	    var sql = "SELECT * FROM functions";
	    transaction.executeSql (sql, undefined, 
	    function (transaction, result){
	      if (result.rows.length){
	      	$('.functions-listview li').remove();
	      	$('.appended-functions').remove();
	        for (var i = 0; i < result.rows.length; i++){
	          var row = result.rows.item (i);
	          var id = row.id;
	          var name = row.name;
	          var func = row.func;
	          
	          $('.functions-listview').append('<li><a href="#f' + id + '" data-transition="slide" class="ui-btn ui-btn-icon-right ui-icon-carat-r">' + name + '</a></li>');
	          
	          var page = $('#function-sketch').clone();
	          page.attr('id', 'f' + id);
	          page.addClass('appended-functions');
	          page.find('h1').html(name);
	          
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
		    
	    });
	});
}

$(document).ready(function(){
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
	
	$(document).on('tap', '.save-formula', function(){
		//console.log($('input[name="formula-name"]').val());
		//console.log($('input[name="formula"]').text());
		insertFunctionToDb($('input[name="formula-name"]').val(), $('textarea[name="formula"]').val());
		selectFromDb();
		$('#add-function').removeClass('ui-page-active');
		$.mobile.changePage('#main', {transition: "slide"});
	});
	
	$(document).on('tap', '.resolv-function', function(){
		
		
		//dropDb();
		//createDb();
		//return false;
		
	});
	
});