var db;

function connectDb(){
	db = openDatabase ("Test", "1.0", "Test", 65535);
}

function createDb(){
	
	db.transaction (function (transaction) {
		var sql = "CREATE TABLE functions " +
				  " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
		          "name VARCHAR(100) NOT NULL, " + 
		          "func TEXT)";
		transaction.executeSql (sql, undefined, function (){ 
			if(debug) console.log("Table created");
		},function () { 
			if(debug) console.log("Table not created. Propably alredy exists.");
		});
	});
}

function dropDb(){
	
	db.transaction (function (transaction) {
		var sql = "DROP TABLE functions";
		transaction.executeSql (sql, undefined, function (){ 
			if(debug) console.log("Table deleted");
		},function () { 
			if(debug) console.log("Table not deleted");
		});
	});
}

function deleteFromDb(id){
	
	db.transaction (function (transaction) {
		var sql = "DELETE FROM functions WHERE id = " + id;
		transaction.executeSql (sql, undefined, function (){ 
			if(debug) console.log("Row deleted");
		},function () { 
			if(debug) console.log("Row not deleted");
		});
	});
}

function insertFunctionToDb(name, func){
	
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
	          appendPage = $('#function-sketch').clone();
	          appendPage.attr('id', 'f' + id);
	          appendPage.addClass('appended-functions');
	          appendPage.find('h1').html(name);
	          appendPage.find('.formula').html(func);
	          
	          var formula = new reference(func);
	          if(isFormulaCorrect(formula)){
	          	parseFormula(formula);
	          }
	          /*if(isFormulaCorrect(func)){
	          	  for(var j = 0; j<variables.length; j++){
	          	  	var explode = variables[j].split(':');
	          	  	if(explode.length == 2){
		         		page.find('.input-list').append( '<li><div class="ui-listview-label">'+ explode[1] +
		         	 									 ':</div><input type="text" name="'+ variables[j] +
		         	 									 '" class="ui-input-listview" value=""/></li> ');
		         	}
		         	else if(explode.length == 3){
			        	 
		         	}
		         	else {
			         	page.find('.input-list').append( '<li><div class="ui-listview-label">'+ variables[j].replace('$', '') +
		         	 									 ':</div><input type="text" name="'+ variables[j] +
		         	 									 '" class="ui-input-listview" value=""/></li> ');
		         	}
		          }
	          }
	          */
	          appendPage.appendTo('body');
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