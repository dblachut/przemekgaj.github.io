var DEC_SEPARATOR = '.';
var ARG_SEPARATOR = ',';

function getName(pattern, index)
{
	var name = '';
	//console.log(pattern + " " + index.ref);
	while(index.ref < pattern.length && (isLetter(pattern[index.ref]) || isDigit(pattern[index.ref])) )
		name += pattern[index.ref++];

	return name;
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

	while(index.ref < pattern.length && isDigit(pattern[index.ref]))
		number += pattern[index.ref++];

	if(pattern.length != 0 && pattern[index.ref] == DEC_SEPARATOR)
	{
		number += pattern[index.ref++];

		if(!isDigit(pattern[index.ref]))
			console.log("No digit after decimal separator!");

		while(index.ref < pattern.length && isDigit(pattern[index.ref]))
			number += pattern[index.ref++];
	}

	return number;
}

function getNumberWithMinus(pattern, index)
{
	var number = '';

	if(pattern[index.ref] == '-')
		number += pattern[index.ref++];

	while(index.ref < pattern.length && isDigit(pattern[index.ref]))
		number += pattern[index.ref++];

	if(pattern.length != 0 && pattern[index.ref] == DEC_SEPARATOR)
	{
		number += pattern[index.ref++];

		if(!isDigit(pattern[index.ref]))
			console.log("No digit after decimal separator!");

		while(index.ref < pattern.length && isDigit(pattern[index.ref]))
			number += pattern[index.ref++];
	}

	return number;
}

//Singleton constants
var Constants = new function(){
	
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
	this.c["PI"] = 3.14159265359;
	this.c["THREE"] = 3.00;
	this.c["LUCKYNUMBER"] = 7;
	this.c["P1"] = 1.1111111;
	
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

var Operators = new function(){// IMPORTANT: function names are considered to be operators as well in the algorithm
	
	this.o = Array();
	
	this.getOperator = function(name)
	{
		var a;
		for(var i = 0; i < this.o.length; i++)
		{
			if(this.o[i].getName() == name)
			{
				a = this.o[i];
				break;
			}
		}
		return a;
	}
	
	this.isOperator = function(name)
	{
		for(var i = 0; i < this.o.length;i++)
		{
			if(this.o[i].getName() == name)
				return true;
		}
		return false;
	}

	this.isFunction = function(name)
	{
		for(var i = 0; i < this.o.length;i++)
		{
			if(this.o[i].getName() == name)
				return this.o[i].getName().length != 1; //operators are one chars
		}
		return false;
	}

	this.refsOperator = function(name)
	{
		for(var i = 0; i < this.o.length; i++)
		{
			if(this.o[i].getName() == name)
				return true;
		}
		return false;
	}

	this.refsPrioritized = function(first, second)
	{
		if(!this.refsOperator(first) || !this.refsOperator(second))
		{
			if(debug) console.log(first + " lub " + second + " to nie operator!");
			return false;
		}
		var p1, p2;
		for(var i = 0; i < this.o.length; i++)
		{
			if(this.o[i].getName() == first)
				p1 = this.o[i].getPriority();
			if(this.o[i].getName() == second)
				p2 = this.o[i].getPriority();
		}

		return p1 > p2;
	}

	this.o.push(new Operator("^", 3, 2, powFunction));
	this.o.push(new Operator("*", 2, 2, multiplyFunction));
	this.o.push(new Operator("/", 2, 2, divideFunction));
	this.o.push(new Operator(":", 2, 2, divideIntFunction));
	this.o.push(new Operator("%", 2, 2, moduloFunction));
	this.o.push(new Operator("+", 1, 2, addFunction));
	this.o.push(new Operator("-", 1, 2, subtractFunction));
	this.o.push(new Operator("sin", 4, 1, sinFunction));
	this.o.push(new Operator("cos", 4, 1, cosFunction));
	this.o.push(new Operator("sqrt", 4, 1, sqrtFunction));
	this.o.push(new Operator("pow", 4, 2, powFunction));
	this.o.push(new Operator("rand", 4, 0, randFunction));	
};