var output = "";

function appendOutput(text)
{
	if(text.length)
		output += text + ' ';
}

function isDigit(c)
{
	return c >= '0' && c <= '9';
}

function isLetter(c)
{
	return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

function getNumber(pattern, index)
{
	var number = '';

	while(isDigit(pattern[index.i]) && index.i < pattern.length)
	{
		number += pattern[index.i];
		index.i++;
	}
	if(pattern.length != 0 && pattern[index.i] == '.')
	{
		number += pattern[index.i];
		index.i++;
		if(!isDigit(pattern[index.i]))
			console.log("Brak liczby po separatorze dziesietnym!");
			
		while(isDigit(pattern[index.i]) && index.i < pattern.length)
		{
			number += pattern[index.i];
			index.i++;
		}
	}

	return number;
}

function iterator(i){
	this.i = i;
}

function translateToONP(equation)
{
	var number = "";
	output = "";
	var stack = Array();

	if(equation[0] == '-')
	{		
		var tmp = "0";
		tmp.append(equation);
		equation = tmp;
	}

	for(var i=0; i<equation.length; ++i)
	{
		while(equation[i] == ' ')
			i++;

		var it = new iterator(i);
		number = getNumber(equation, it);
		appendOutput(number);
		i = it.i;

		while(equation[i] == ' ')
			i++;

		if(i < equation.length)
			switch(equation[i])
			{
				case '=':
					while( stack.length > 0 ){
						appendOutput(stack[stack.length - 1]); 
						stack.pop();
					}
					output += equation[i];
					if(i != equation.length-1)
						console.log("Znak = nie na koncu równania");
					break;
				case '(':
					stack.push(equation[i]);
					break;
				case ')':
					while(stack.length > 0 && stack[stack.length - 1] != "("){
						appendOutput(stack[stack.length - 1]);
						stack.pop();
					}
					stack.pop();
					break;
				case ',': //TODO: coma or semicolon?
					// do nothing
					break;
				default:
					if(	opObject.isOperator(equation[i]) )
					{
						if(equation[i] == '-' && i != 0)		//sprawdzamy wystepowanie (-a)
						{
							var tmp = i-1;
							while(equation[tmp] == ' ')
								tmp--;
							if(equation[tmp] == '(')			//obslugujemy je przez zapisanie 0 - a
							{
								appendOutput('0');
							}
						}
	
						while( stack.length > 0 && stack[stack.length - 1] != "(" && !opObject.isPrioritized(equation[i], stack[stack.length - 1]) ){
							appendOutput(stack[stack.length - 1]);
							stack.pop();
							
						}
	
						stack.push(equation[i]);
						break;
					}
					else
					{ // either a function or an error
						if(!isLetter(equation[i])) // error
						{
							console.log("Error, nieznany znak: " + equation[i]);
							return "";
						}
						// Get function name
						var fName = "";
						while(equation[i] != '(')					
							fName += equation[i++];
						i--;
	
						// recognize the function and put it where it belongs
						if(!opObject.isOperator(fName))//Functions::inst.functionExists(fName))
						{
							console.log("Error, function " + fName + " does not exist\n");
							return "";
						}
	
						stack.push(fName);
					}
			}

	}
	while( stack.length > 0 ){
		appendOutput(stack[stack.length - 1]);
		console.log(stack[stack.length - 1]);
		stack.pop();
	}

	//console.log("Przed: " + equation);
	//console.log("Po: " + output);
	return output;
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

//Operator class
function Operator(name, priority, argc, func){

	this.name = name;
	this.priority = priority;
	this.argc = argc;
	this.func = func;

	this.getName = function()
	{
		return this.name;
	}

	this.getPriority = function()
	{
		return this.priority;
	}

	this.getArgc = function()
	{
		return this.argc;
	}

	this.getFunction = function()
	{
		return this.func;
	}
}

//Singleton operators

var opObject = new function(){// IMPORTANT: function names are considered to be operators as well in the algorithm
	
	this.operators = Array();
	
	this.getOperator = function(name)
	{
		var a;
		for(var i = 0; i < this.operators.length; i++)
		{
			if(this.operators[i].getName() == name)
			{
				a = this.operators[i];
				break;
			}
		}
		return a;
	}

	this.isOperator = function(name)
	{
		for(var i = 0; i < this.operators.length; i++)
		{
			if(this.operators[i].getName() == name)
				return true;
		}
		return false;
	}

	this.isPrioritized = function(first, second)
	{
		if(!this.isOperator(first) || !this.isOperator(second))
		{
			console.log(first + " lub " + second + " to nie operator!");
			return false;
		}
		var p1, p2;
		for(var i = 0; i < this.operators.length; i++)
		{
			if(this.operators[i].getName() == first)
				p1 = this.operators[i].getPriority();
			if(this.operators[i].getName() == second)
				p2 = this.operators[i].getPriority();
		}

		return p1 > p2;
	}

	this.operators.push(new Operator("^", 3, 2, powFunction));		
	this.operators.push(new Operator("*", 2, 2, multiplyFunction));
	this.operators.push(new Operator("/", 2, 2, divideFunction));
	this.operators.push(new Operator(":", 2, 2, divideIntFunction));
	this.operators.push(new Operator("%", 2, 2, moduloFunction));
	this.operators.push(new Operator("+", 1, 2, addFunction));
	this.operators.push(new Operator("-", 1, 2, subtractFunction));
	this.operators.push(new Operator("sin", 4, 1, sinFunction));
	this.operators.push(new Operator("cos", 4, 1, cosFunction));
	this.operators.push(new Operator("sqrt", 4, 1, sqrtFunction));
	this.operators.push(new Operator("pow", 4, 2, powFunction));
	this.operators.push(new Operator("rand", 4, 0, randFunction));	
};
