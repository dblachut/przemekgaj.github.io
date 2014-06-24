var gAlternatingArgPosition = 0; // I don't think its the best way to do it
var gAlternatingArgAmount = 0;

function isFormulaCorrect(formula)
{
	var openingBrackets = 0;
	var closingBrackets = 0;
	gAlternatingArgAmount = 0;
	gAlternatingArgPosition = 0;

	for(var i=0; i<formula.ref.length; ++i)
	{
		while(formula.ref[i] == ' ')
			i++;

		if(formula.ref[i] == '#')
		{
			i++;
			var it = new reference(i);
			if(!checkConstantName(formula.ref, it))
				return false;
			i = it.ref;
		}

		if(formula.ref[i] == '{')
		{
			openingBrackets++;
			i++;
			var it = new reference(i);
			var f = new reference(formula.ref);
			if(!checkArgument(f, it, openingBrackets))
				return false;
				
			formula.ref = f.ref;
			i = it.ref;
		}
		if(formula.ref[i] == '}')
			closingBrackets++;

		if(isLetter(formula.ref[i]))
		{
			var saved = openingBrackets;
			var it = new reference(i);
			var f = new reference(formula.ref);
			var an = new reference(openingBrackets);
			if(!checkFunctionArgumentAmount(f, it, an))
				return false;
			i = it.ref;
			formula.ref = f.ref;
			openingBrackets = an.ref;
			
			// in function there can be user arguments, in that case openingBrackets will increment
			// so we need to increment the closing brackets aswell
			closingBrackets += openingBrackets - saved;
		}
	}

	if(openingBrackets != closingBrackets)
	{
		console.log("Error wrong number of brackets in user arguments!");
		return false;
	}

	return true;
}

function reference(x){
	this.ref = x;
}

function checkConstantName(pattern, index)
{
	if(index.ref >= pattern.length || !isLetter(pattern[index.ref]))
	{
		console.log("Error no constant name after '#' sign!");
		return false;
	}

	var it = new reference(index.ref);
	var constName = getName(pattern, index.ref);
	index.ref = it.ref;

	if( !Constants.constantExists(constName) )
	{
		console.log("Error const " + constName + " does not exists!");
		return false;
	}

	return true;
}

function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function checkArgument(pattern, index, argumentNumber)
{
	if(index.ref >= pattern.ref.length || pattern.ref[index.ref] != '$')
	{
		console.log("Error no '$' sign in user argument!");
		return false;
	}
	index.ref++;
	if( !(isLetter(pattern.ref[index.ref]) || isDigit(pattern.ref[index.ref])) ) //auto-numering of arguments
	{
		if(pattern.ref[index.ref] != ':' && pattern.ref[index.ref] != '}')
		{
			console.log("Error unknown sign " + pattern.ref[index.ref] + " in user argument name!");
			return false;
		}
		//var toInsert = std::to_string(argumentNumber);
		pattern.ref = insert(pattern.ref, index.ref, argumentNumber);
		index.ref += argumentNumber.toString().length;
	}
	else
	{
		var it = new reference(index.ref);
		getName(pattern.ref, it);
		index.ref = it.ref;
	}

	var it = new reference(index.ref);
	if(!checkAlternatingArgument(pattern.ref, it))
		return false;
	index.ref = it.ref;

	return true;
}

function checkAlternatingArgument(pattern, index)
{
	if(pattern[index.ref] == ':')
	{
		gAlternatingArgPosition = index.ref;
		var numbers = Array();
		if(pattern[index.ref+1] != 'Z')
		{
			console.log("Error no Z sign after declaration (:) of alternating argument!");
			return false;
		}
		index.ref += 2;
		if(++gAlternatingArgAmount > 1)
		{
			console.log("Error number of alternating arguments is limited to 1!");
			return false;
		}
		if(pattern[index.ref] != '}')
		{
			if(pattern[index.ref] == '(')
			{
				index.ref++;
				if(pattern[index.ref] != ')')
				{
					var it = new reference(index.ref);
					numbers.push(getNumberWithMinus(pattern, it));
					index.ref = it.ref;
					
					if(numbers[numbers.length - 1] == "")
					{
						console.log("Error unknown sign " + pattern[index.ref] + " after ( in alternating argument!");
						return false;
					}
					else
					{
						for(var j=0; j<2; j++)
						{
							while(pattern[index.ref] == ' ')
								index.ref++;
							if(pattern[index.ref] != ARG_SEPARATOR)
							{
								console.log("Error unknown sign " + pattern[index.ref] + " after (number in alternating argument!");
								return false;
							}
							index.ref++;
							while(pattern[index.ref] == ' ')
								index.ref++;
							
							var it = new reference(index.ref);
							numbers.push(getNumberWithMinus(pattern, it));
							index.ref = it.ref;
							
							if(numbers[numbers.length - 1] == "")
							{
								console.log("Error not a number in () in alternating argument!");
								return false;
							}
						}
						if(pattern[index.ref] != ')')
						{
							console.log("Error no closing bracket ) in alternating argument!");
							return false;
						}
						//we need to check if the values inserted are correct
						var step = parseFloat(numbers[2]);
						var to = parseFloat(numbers[1]);
						var from = parseFloat(numbers[0]);
						if((from > to || step > (to - from)))
						{
							console.log("Error in values in alternating argument!");
							return false;
						}
					}
				}
			}
			else if (pattern[index.ref] == '[')
			{
				index.ref++;
				
				var it = new reference(index.ref);
				numbers.push(getNumber(pattern, it));
				index.ref = it.ref;
				
				if(numbers[numbers.length - 1] == "")
				{
					console.log("Error unknown sign " + pattern[index.ref] + " after [ in alternating argument!");
					return false;
				}
				else if(pattern[index.ref] != ']')
				{
					console.log("Error unknown sign " + pattern[index.ref] + " after [number in alternating argument!");
					return false;
				}
			}
			else
			{
				console.log("Error unknown sign " + pattern[index.ref] + " after Z in alternating argument!");
				return false;
			}
		}
	}

	return true;
}

function checkFunctionArgumentAmount(pattern, index, argumentNumber)
{
	var fName;
	
	var it = new reference(index.ref);
	fName = getName(pattern.ref, it);
	index.ref = it.ref;
	
	index.ref++;
	if(!Operators.isOperator(fName))
	{
		console.log("Error, function " + fName + " does not exist");
		return false;
	}
	else
	{
		var argCount = Operators.getOperator(fName).getArgc();
		var argEntered = 0;

		for(index.ref; index.ref<pattern.ref.length; index.ref++)
		{
			while(pattern.ref[index.ref] == ' ')
				index.ref++;
				
			var it = new reference(index.ref);
			if(getNumber(pattern.ref, it) != "")
				argEntered++;
			index.ref = it.ref;
			
			while(pattern.ref[index.ref] == ' ')
				index.ref++;
			if(pattern.ref[index.ref] != ARG_SEPARATOR)
			{
				if(pattern.ref[index.ref] == ')')
					break;
				else if(isLetter(pattern.ref[index.ref]))
				{
					var it = new reference(index.ref);
					var p = new reference(pattern.ref);
					var an = new reference(argumentNumber.ref);
					if(!checkFunctionArgumentAmount(p, it, an))
						return false;
					
					index.ref = it.ref;
					pattern.ref = p.ref;
					argumentNumber.ref = an.ref;
					
					index.ref--;
					argEntered++; //functon as an argment
				}
				else if(pattern.ref[index.ref] == '#')
				{
					index.ref++;
					var it = new reference(index.ref);
					if(!checkConstantName(pattern.ref, it))
						return false;
					index.ref = it.ref;
						
					index.ref--;
					argEntered++; //const as an argument
				}
				else if(pattern.ref[index.ref] == '{')
				{
					++index.ref;
					argumentNumber.ref++;
					
					var it = new reference(index.ref);
					var p = new reference(pattern.ref);
					if(!checkArgument(p, it, argumentNumber.ref))
						return false;
						
					index.ref = it.ref;
					pattern.ref = p.ref;
					
					++index.ref;
					if(pattern.ref[index.ref] != '}')
					{
						console.log("Error, no closing bracket } in user argument in function arguments!");
						return false;
					}
					argEntered++; //user argument as function argument
				}
				else
				{
					console.log("Error, unknown sign " + pattern.ref[index.ref] + " in function arguments");
					return false;
				}
			}
		}

		if(argCount == -1) //we need to add argument number due to dynamic amount of arguments
		{
			//string toInsert = ARG_SEPARATOR + std::to_string(argEntered);
			pattern.ref = insert(pattern.ref, index.ref, (ARG_SEPARATOR + argEntered));
			index.ref += (ARG_SEPARATOR + argEntered).toString().length;
		}
		else if (argCount != argEntered)
		{
			console.log("Error, wrong amount of parameters for function " + fName + ". Got: " + argEntered + ", expected: " + argCount);
			return false;
		}
		index.ref++;
	}
	return true;
}