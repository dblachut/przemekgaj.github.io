/*function translateToONP(equation)
{
	var number = "";
	output = "";
	var stack = new Array();

	if(equation[0] == '-')
	{
		equation = "0" + equation;
	}

	for(var i=0; i<equation.length; ++i)
	{
		while(equation[i] == ' ')
			i++;

		number = getNumber(equation, i);
		appendOutput(number);

		while(equation[i] == ' ')
			i++;

		if(i < equation.length)
			switch(equation[i])
			{
				case '=':
					while( stack.length > 0 )
						appendOutput(stack.pop());
					output += equation[i];
					if(i != equation.length-1)
						console.log("= sign not on the end of equation");
					break;
				case '(':
					stack.push(equation[i]);
					break;
				case ')':
					while(stack.length > 0 && stack[stack.length - 1] != "(")
						appendOutput(stack.pop());
						
					stack.pop();
					//if we were parsing function arguments, take function from stack
					if(stack.length > 0 && Operators.isFunction(stack[stack.length - 1]))
						appendOutput(stack[stack.length - 1]), stack.pop_back();
					break;
				case ARG_SEPARATOR: //TODO: coma or semicolon?
					// do nothing
					break;
				default:
					if( Operators.isOperator(equation[i]) )
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

						while(stack.length > 0 && stack[stack.length - 1] != "(" && !Operators.isPrioritized(equation[i], stack[stack.length - 1]) )
							appendOutput(stack.pop());

						stack.push(equation[i]);
						break;
					}
					else
					{ // either a function or an error
						if(!isLetter(equation[i])) // error
						{
							console.log("Error, unknown char: " + equation[i]);
							return "";
						}
						// Get function name
						var fName = "";
						while(equation[i] != '(')					
							fName+=equation[i++];
						i--;

						// recognize the function and put it where it belongs
						if(!Operators.isOperator(fName))
						{
							console.log("Error, function " + fName + " does not exist");
							return "";
						}

						stack.push(fName);
					}
			}

	}
	while( stack.length > 0 )
		appendOutput(stack.pop());

	console.log("Przed: " + equation);
	console.log("Po: " + output);
	return output;
}*/

function translateToONP(equation)
{
	var number = "";
	output = "";
	var stack = Array();

	if(equation[0] == '-')
	{
		equation = "0" + equation;
	}

	for(var i=0; i<equation.length; ++i)
	{
		while(equation[i] == ' ')
			i++;

		var it = new reference(i);
		number = getNumber(equation, it);
		appendOutput(number);
		i = it.ref;

		while(equation[i] == ' ')
			i++;

		if(i < equation.length)
			switch(equation[i])
			{
				case '=':
					while( stack.length > 0 )
						appendOutput(stack.pop());
					
					output += equation[i];
					if(i != equation.length-1)
						if(debug) console.log("Znak = nie na koncu równania");
					break;
				case '(':
					stack.push(equation[i]);
					break;
				case ')':
					while(stack.length > 0 && stack[stack.length - 1] != "(")
						appendOutput(stack.pop());
						
					stack.pop();
					
					if(stack.length > 0 && Operators.isFunction(stack[stack.length - 1]))
						appendOutput(stack.pop());
					
					break;
				case ',': //TODO: coma or semicolon?
					// do nothing
					break;
				
				default:
					if(	Operators.isOperator(equation[i]) )
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
	
						while( stack.length > 0 && stack[stack.length - 1] != "(" && !Operators.isPrioritized(equation[i], stack[stack.length - 1]) )
							appendOutput(stack.pop());
	
						stack.push(equation[i]);
						break;
					}
					else
					{ // either a function or an error
						if(!isLetter(equation[i])) // error
						{
							if(debug) console.log("Error, nieznany znak: " + equation[i]);
							return "";
						}
						// Get function name
						var fName = "";
						while(equation[i] != '(')					
							fName += equation[i++];
						i--;
	
						// recognize the function and put it where it belongs
						if(!Operators.isOperator(fName))//Functions::inst.functionExists(fName))
						{
							if(debug) console.log("Error, function " + fName + " does not exist\n");
							return "";
						}
	
						stack.push(fName);
					}
			}

	}
	while( stack.length > 0 ){
		appendOutput(stack[stack.length - 1]);
		if(debug) console.log(stack[stack.length - 1]);
		stack.pop();
	}

	if(debug) console.log("Przed: " + equation);
	if(debug) console.log("Po: " + output);
	return output;
}

function isEquationCorrect(equation)
{
	var operatorCount = 0;
	var openingBrackets = 0;
	var closingBrackets = 0;
	for(var i=0; i<equation.length; ++i)
	{
		while(equation[i] == ' ')
			i++;
		if(Operators.isOperator(equation[i]))
		{
			operatorCount++;
			if(i+1<equation.length && equation[i+1] == ')')
			{
				console.log("Error operator before ) bracket!");
				return false;
			}
			if(operatorCount>1)
			{
				console.log("Error two operators cannot be next to eachother!");
				return false;
			}
		}
		else
		{
			if(equation[i] == '(')
				openingBrackets++;
			else if(equation[i] == ')')
			{
				closingBrackets++;
				if(i+1<equation.length && equation[i+1] != ')' && equation[i+1] != ',' && equation[i+1] != '=' && equation[i+1] != '}' && !Operators.isOperator(equation[i+1]))
				{
					console.log("Error no operator after closing bracket!");
					return false;
				}
			}

			operatorCount = 0;
		}
	}
	if(openingBrackets != closingBrackets)
	{
		console.log("Error wrong number of () brackets!");
		return false;
	}
	return true;
}