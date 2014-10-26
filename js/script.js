var debug = 0;
var original = [];
var tmp_edit;
var title;

var connection;

var Thread = (function(){

	this.conversation = null;
	this.server = null;
	this.thread = null;
	this.time = 3000;
	this.conversations = [];
	this.div = 0;
	
	this.setConversation = function(conversation){
		this.conversation = conversation;
	}
	
	this.setServer = function(server){
		this.server = server;
	}
	
	this.startThread = function(){
		if(debug) console.log('starting thread');
		this.reloadMessages(true);
		this.readContacts();
		thread = setInterval(function(){ 
			Connection.getInstance().reloadMessages(); 
			Connection.getInstance().readContacts();
		}, this.time);
	}
	
	this.threadExists = function(){
		return this.thread != undefined ? true:false;
	}
	
	this.stopThread = function(){
		if(this.thread != undefined)
			clearInterval(this.thread);
	}
	
	this.setDate = function(date){
		this.conversations[this.conversation] = date;
	}
	
	this.reloadMessages = function(first){
		if(debug) console.log('reloading...');
		var array = {
			conversation: this.conversation,
			date: 	this.conversations[this.conversation] != undefined ? this.conversations[this.conversation]:'',
			todo: 	'get-conversation'
		}
		
		$.post(this.server, array, function(data){
			if(debug) console.log(data);
			
			updateText(data);
			if(first)
				scrollToBottom();
		});
		
		
		array = {
			todo: 'check-new'
		}
		
		$.post(this.server, array, function(data){
			if(debug) console.log(data);
			
			var users = data.split("\n");
			var items = 0;
			
			removeAlerts();
			
			for(var i=0; i < users.length; i++){
				if(users[i] != ''){
					if(debug) console.log(users[i]);
					openConversation(users[i], false);
					addAlert(users[i]);
					items ++;
				}
			}
			
			if(items > 0)
				changeTitle('(' + items + ') ' + original['title']);
			else
				changeTitle(original['title']);
		});
	}
	
	this.sendMessage = function(message){
		var array = {
			conversation: 	this.conversation,
			message:		message,
			date: 			this.conversations[this.conversation] != undefined ? this.conversations[this.conversation]:'',
			todo: 			'send-message'
		}
		
		$.post(this.server, array, function(data){
			if(debug) console.log(data);
			updateText(data);
			
			scrollToBottom();
		});
	}
	
	this.getServer = function(){
		return this.server;
	}
	
	this.saveContact = function(nickname, new_u, edited){

		var array = {
			login: 	nickname,
			todo:	'check-user'
		}
		
		$.post(this.server, array, function(data){
			if(debug) console.log(data);
			
			if(data == 1){
				
				var array_u = {
					login: 	nickname,
					new_u:	new_u,
					edited:	edited,
					todo:	'save'
				}
				
				$.post(Connection.getInstance().getServer(), array_u, function(data){
					if(debug) console.log(data);
					Connection.getInstance().readContacts();
			
					hidePopUp();
				});
			}
			else 
				showAlert('Przykro nam, nick nie istnieje.');
		});
	}
	
	this.saveStatus = function(status, description){
		var array = {
			status: status,
			desc:	description,
			todo:	'save-status'
		}
		
		$.post(this.server, array, function(data){
			if(debug) console.log(data);
			Connection.getInstance().readContacts();
	
			hidePopUp();
		});
	}
	
	this.getStatus = function(status, description){
		var array = {
			todo:	'get-status'
		}
		
		$.post(this.server, array, function(data){
			if(debug) console.log(data);
			var status = data.split("\n");
			
			if(status[0] != '')
				setStatus(status[0]);
			setDescription(status[1]);
			
		});
	}
	
	this.deleteUser = function(nickname){
		
		var array = {
			todo: 	'delete-contact',
			login:	nickname
		}
		
		$.post(this.server, array, function(data){
			if(debug) console.log(data);
			
			Connection.getInstance().readContacts();
			
		});
		
	}
	
	this.readContacts = function(){
		if(debug) console.log('reading contacts...');
		var array = {
			todo:	'get-contacts'
		}
		
		$.post(this.server, array, function(data){
			updateContacts(data);
		});
	}
		
	this.changeConversation = function(conversation){
		this.conversation = conversation;
	}
	
	this.userAvailable = function(nickname, login){
		var available = false;
		
		var array = {
			login: 	nickname,
			email: 	login,
			todo:	'login'
		}
		
		$.ajax({
			type: 'POST',
			url: this.server,
			data: array,
			success: function(data){
				if(debug) console.log(data);
				
				if(data == '1')
					available = true;
			},
			async: false
		});

		return available;
	}

});

var Connection = (function () {
    var instance;
 
    function createInstance() {
        var object = new Thread();
        return object;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

function scrollbarWidth() { 
    var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>'); 
    // Append our div, do our calculation and then remove it 
    $('body').append(div); 
    var w1 = $('div', div).innerWidth(); 
    div.css('overflow-y', 'scroll'); 
    var w2 = $('div', div).innerWidth(); 
    $(div).remove(); 
    return (w1 - w2); 
}

function scrollToBottom(){
	$('#' + Connection.getInstance().conversation).scrollTop($('#' + Connection.getInstance().conversation)[0].scrollHeight);
}

function updateText(text){
	$('#' + Connection.getInstance().conversation).html(text);
}

function setStatus(status){
	$('select[name="status"]').val(status);
}

function setDescription(description){
	$('input[name="description"]').val(description);
}

function updateContacts(data){
	$('.contact_list').html('');
			
	$('.contact_list').append(data);
}

function changeTitle(title){
	document.title = title;
}

function removeAlerts(){
	$('.chat_tabs ul li a').each(function(){
		$(this).html($(this).html().replace(' !', ''));
	});
}

function addAlert(name){
	$('.chat_tabs ul').find('.' + name).html(name + ' !');
}

function resizeWindow(){
	$('.chat_box, .loading').css('width', ($(window).width() - 80) + 'px');
	$('.chat_box, .loading').css('height', ($(window).height() - 80) + 'px');
	
	$('.chat').css('height', ($('.chat_box').height() - 70) + 'px');
	$('.chat').css('width', ($('.chat_box').width() - 300) + 'px');
	
	$('.chat_tab').css('width', ($('.chat_box').width() - 310) + 'px');
	$('.chat_tab').css('height', ($('.chat_box').height() - 115) + 'px');
	
	$('.chat_contacts').css('height', ($('.chat_box').height() - 80) + 'px');
	$('.chat_contacts').css('width', 295 + 'px');
	
	$('.chat_contacts ul > li').css('width', $('.chat_contacts').innerWidth() + 'px');
	
	$('.chat_messages').css('width', ($('.chat_box').width() - 5) + 'px');
	$('.chat_messages').css('height', 65 + 'px');
}

function signed(){
	resizeWindow();
	
	$('.chat_box').show();
	Connection.getInstance().startThread();
	
	Connection.getInstance().readContacts();
	$('.loading').hide();
}

function showTab(tab){
	$('.chat_tab').hide();
	if(debug) console.log('#' + tab);
	$('#' + tab).show();
	
	Connection.getInstance().setConversation(tab);
	
	$('.chat_tabs ul li').each(function(){
		$(this).removeClass('li_active');
	});
	$('.' + tab).parent().addClass('li_active');
	
	Connection.getInstance().reloadMessages(tab, true);
}

function showOlder(date){
	Connection.getInstance().setDate(date);
	
	Connection.getInstance().reloadMessages();
}

function editUser(nickname){
	$.get('add_contact.html', function(data){
		$('.popup_box').html(data);
		$('.popup_box').find('input[name="nickname"]').val(nickname);
		$('.popup_box').find('input[name="new"]').val('0');
		$('.popup_box').find('input[name="edited"]').val(nickname);
		$('.popup_box').fadeIn();
		$('.popup').fadeIn();
		
		$('input[name="contact"]').val(nickname);
		//original['contact'] = $('input[name="contact"]').val();
	});
}

function addUser(){
	$.get('add_contact.html', function(data){
		$('.popup_box').html(data);
		$('.popup_box').fadeIn();
		$('.popup').fadeIn();
		
		original['contact'] = $('input[name="contact"]').val();
	});
}

function changeStatus(){
	$.get('change_status.html', function(data){
		$('.popup_box').html(data);
		$('.popup_box').fadeIn();
		$('.popup').fadeIn();
		
		Connection.getInstance().getStatus();
		
		original['description'] = $('input[name="description"]').val();
	});
}

function hidePopUp(){
	$('.popup_box').hide()
	$('.popup').hide();
}

function hideAlert(){
	$('.alert_box').hide()
	$('.alert').hide();
}

function hideChat(){
	$('.chat_box').hide();
}

function showAlert(message){
	
	$('.alert_box .message').html(message);
	$('.alert_box').fadeIn();
	$('.alert').fadeIn();
	
}

function deleteUser(nickname){
	Connection.getInstance().deleteUser(nickname);
}

function openConversation(nickname, show){
	if($('#' + nickname).length > 0){
		if(show) showTab(nickname);
	}
	else {
		$('.chat').append('<div class="chat_tab disabled" id="' + nickname + '"></div>');
		resizeWindow();
		
		if(show){
			$('.chat_tabs ul li').each(function(){
				$(this).removeClass('li_active');
			});
			
			showTab(nickname);
			
			$('.chat_tabs ul').append('<li class="li_active"><a class="' + nickname + '" href="javascript:showTab(\'' + nickname + '\')">' + nickname + '</a><a href="javascript:;" class="close_tab">X</a></li>');
		}
		else
			$('.chat_tabs ul').append('<li><a class="' + nickname + '" href="javascript:showTab(\'' + nickname + '\')">' + nickname + '</a><a href="javascript:;" class="close_tab">X</a></li>');
		
		
		$('#' + nickname).scrollTop($('#' + nickname)[0].scrollHeight);
		
	}
}

function inputToLower(){
	$(this).val($(this).val().toLowerCase());
}

function saveContact(e){
	e.preventDefault();
	var box = $(this);
	
	Connection.getInstance().saveContact(box.find('input[name="contact"]').val(), box.find('input[name="new"]').val(), box.find('input[name="edited"]').val());
}

function saveStatus(e){
	e.preventDefault();
	
	Connection.getInstance().saveStatus($(this).find('select[name="status"]').val(), $(this).find('input[name="description"]').val());
}

function acceptAlphanumeric(e){
	var regex = new RegExp("^[a-zA-Z0-9]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str) || e.keyCode < 20) {
        return true;
    }
    e.preventDefault();
    return false;
}

function sendButton(){
	if($('input[name="message"]').val() != ''){
		Connection.getInstance().sendMessage($('input[name="message"]').val());
		$('input[name="message"]').val('');
	}
}

function sendKey(e){
	if(e.keyCode == 13 && $(this).val() != ''){
		Connection.getInstance().sendMessage($(this).val());
		$(this).val('');
	}
}

function closeTab(){
	var name = $(this).parent().find('a:eq(0)').attr('class');

	$('.chat_tabs ul').find('li:eq(0)').addClass('li_active');
	
	showTab('public');
	$('#' + name).remove();
	$(this).parent().remove();
}

function signIn(e){
	e.preventDefault();
	
	if(Connection.getInstance().userAvailable($('input[name="nickname"]').val(), $('input[name="email"]').val())){
		signed();
	}
	else {
		showAlert('Przykro nam, twój nick jest już zarezerwowany.');
	}
	
}

function overMenu(){
	$(this).addClass('li_hover');
}

function outMenu(){
	$(this).removeClass('li_hover');
}

function inputEdited(){
	if($(this).val() == '')
		$(this).val(tmp_edit);
}

function inputEdit(){
	
	tmp_edit = $(this).val();
	
	if($(this).val() == original[$(this).prop('name')])
		$(this).val('');

}

$(document).ready(function(){

	Connection.getInstance().setConversation('public');
	Connection.getInstance().setServer($('select[name="server"]').val());
	
	$(window).resize(resizeWindow);
	original['title']= document.title;
	original['nickname'] = $('input[name="nickname"]').val();
	original['email'] = $('input[name="email"]').val();
	
	$('.popup_ok').click(hidePopUp);
	$('.alert_ok').click(hideAlert);
	$('form.signin').submit(signIn);
	$('.add_contact').click(addUser);
	$('.change_status').click(changeStatus);
	$('input[name="message"]').keyup(sendKey);
	$('input[name="send"]').click(sendButton);
	
	$(document).on('submit', '.save_contact', saveContact);
	$(document).on('submit', '.save_status', saveStatus);
	$(document).on('mouseover', '.chat_tabs ul > li', overMenu);
	$(document).on('mouseout', '.chat_tabs ul > li', outMenu);
	$(document).on('click', '.close_tab', closeTab);
	$(document).on('keypress', 'input[name="nickname"]', acceptAlphanumeric);
	$(document).on('change', 'input[name="email"]', inputToLower);
	$(document).on('click', '.close_popup', hidePopUp);
	$(document).on('click', '.close_chat', hideChat);
	$(document).on('focus', 'input[name="nickname"], input[name="description"], input[name="email"], input[name="contact"]', inputEdit);
	$(document).on('blur', 'input[name="nickname"], input[name="email"]', inputEdited);
	
});