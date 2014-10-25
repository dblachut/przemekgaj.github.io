var debug = true;
var server;

$(document).ready(function(){
	
	if(debug) console.log('Starting...');
	
	server = $('select[name="server"]').val();
	
	$('form.signin').submit(function(e){
		e.preventDefault();
		
		var array = {
			login: $('input[name="nickname"]')
		}
		
		$.post(server, array, function(data){
			if(debug) console.log(data);
			
			
		});
		
	});
	
	
});