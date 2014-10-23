function addFunction(args)
{
	return args[0] + args[1];
}

// returns args[0] - args[1]
function subtractFunction(args)
{
	return args[0] - args[1];
}

function multiplyFunction(args)
{
	return args[0] * args[1];
}

function divideFunction(args)
{
	return args[0] / args[1];
}

function divideIntFunction(args)
{
	return parseInt(parseInt(args[0]) / parseInt(args[1]));
}

function moduloFunction(args)
{
	return parseInt(args[0]) % parseInt(args[1]);
}

function randFunction(args)
{
	return Math.random();
}

function powFunction(args)
{
	return Math.pow(args[0],args[1]);
}

function sinFunction(args)
{
	return Math.sin(args[0]);
}

function cosFunction(args)
{
	return Math.cos(args[0]);
}

function sqrtFunction(args)
{
	return Math.sqrt(args[0]);
}
function factorialFunction(args)
{	
	args[0] = parseInt(args[0]);
	if(args[0] == 1 || args[0] == 0)
		return 1;
	else
	{
		var a = args[0];
		while(--a)
			args[0] *= a;
		return args[0];
	}
}

function averageFunction(args)
{
	var sum = 0;

	args.forEach(function(value){
		sum += value;
	});	

	return sum/args.length;
}