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