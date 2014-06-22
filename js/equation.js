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