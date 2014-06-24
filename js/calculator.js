function calculateONP(line)
{
	var explode = line.split(' ');
	if(debug) console.log(explode);
	var stack = Array();
	if(debug) console.log("Input\t\tOperation\t\tStack after");
	var token;
	var j = 0;
	//return;
	while (token = explode[j]) {
		
		if(debug) console.log('token'+token + "\t\t");
		
		var tokenNum = parseFloat(token);
		if (!isNaN(tokenNum)) 
		{
			
			if(debug) console.log("Push\t\t\t");
			
			stack.push(tokenNum);
		} 
		else 
		{
			
			if(debug) console.log("Operate\t\t\t");			
			//console.log('Token: ' + token);
			if(Operators.isOperator(token))
			{
				var argc = Operators.getOperator(token).getArgc();
				var tmp = Array();
				
				if(argc == -1)	//dynamic amount of arguments
					argc = parseInt(stack.pop());
				
				for (var i = 0; i < argc; i++)
				{
					tmp.push(stack.pop());
				}
				tmp.reverse();
				
				stack.push(Operators.getOperator(token).getFunction()(tmp));
			} // todo = in next line
			else if (token == "=");
			// do nothing
			else { //just in case
				//std::cerr << "Error" << std::endl;
				//std::exit(1);
				if(debug) console.log("Error");
			}
		}
		//std::copy(stack.begin(), stack.end(), std::ostream_iterator<double>(std::cout, " "));
		j++;
	}
	return stack.pop();
}
