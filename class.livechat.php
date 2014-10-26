<?php

class Livechat {
	private $field;
	private $sessionDir = 'sessions/';
	private $conversationDir = 'conversations/';
	private $statesDir = 'states/';
	
	function __construct(){
		session_start();
	}
	
	function getField(){
		return $this->field;
	}
	
	function readMessages($room){
		
	}
	
	function isAvailable($nickname, $email){
		if(!file_exists($this->sessionDir.$nickname)){
			$_SESSION['nickname'] = $nickname;
			file_put_contents($this->sessionDir.$nickname, $email);
			return 1;
		}
		else if(file_get_contents($this->sessionDir.$nickname) == $email){
			$_SESSION['nickname'] = $nickname;
			return 1;
		}
		else
			return 0;
	}
	
	function appendToFile($filename, $value){
		file_put_contents($filename, $value."\n", FILE_APPEND | LOCK_EX);
	}
	
	function readFile($filename){
		if(file_exists($filename))
			return file_get_contents($filename);
	}
	
	function deleteLine($filename, $value){
		$file = file_get_contents($filename);
		unlink($filename);
		file_put_contents($filename, str_replace($value."\n", '', $file));
	}
	
	function editLine($filename, $value, $replacement){
		$file = file_get_contents($this->sessionDir.$filename);
		unlink($this->sessionDir.$filename);
		file_put_contents($this->sessionDir.$filename, str_replace($value."\n", $replacement."\n", $file));
	}
	
	function getSessionDir(){
		return $this->sessionDir;
	}
	
	function getConversationDir(){
		return $this->conversationDir;
	}
	
	function getContacts(){
		$_contacts = $this->readFile($this->getSessionDir().$_SESSION['nickname'].'-contacts');
		$contacts = explode("\n", $_contacts);
		
		foreach($contacts as $contact){
			if($contact != ''){
				$_state = $this->readFile($this->statesDir.$contact);
				$state = explode("\n", $_state);
				
				print '<li>
						'.(isset($state[0]) && $state[0] != '' ? '<div class="'.($state[0] == 1 ? 'available':'unavailable').'"></div>':false).'
						<a class="contact_item" href="javascript:openConversation(\''.$contact.'\', true);">'.$contact.'</a>
						<a href="javascript:deleteUser(\''.$contact.'\');" class="delete_button"></a>
						<a href="javascript:editUser(\''.$contact.'\');" class="edit_button"></a>
						'.(isset($state[1]) && $state[1] != '' ? '<div class="status">'.$state[1].'</div>':false).'
					   </li>';
			}
		}
	}
	
	function getStatus(){
		$_state = $this->readFile($this->statesDir.$_SESSION['nickname']);
		
		print $_state;
	}
	
	function changeStatus($status, $description){
		file_put_contents($this->statesDir.$_SESSION['nickname'], $status."\n".$description);
	}
	
	function getConversation($conversation, $date){
		
		if($conversation != 'public'){
			if(file_exists($this->getConversationDir().$conversation.'-'.$_SESSION['nickname'])){
				$conversation_file = $conversation.'-'.$_SESSION['nickname'];
			}
			else if(file_exists($this->getConversationDir().$_SESSION['nickname'].'-'.$_POST['conversation'])){
				$conversation_file = $_SESSION['nickname'].'-'.$conversation;
			}
			else {
				$conversation_file = false;
			}
		}
		else
			$conversation_file = $conversation;
		
		$output = '';
		$older = false;
		
		if($conversation_file){
			if(file_exists($this->getConversationDir().$_SESSION['nickname'].'-new')){
				$this->deleteLine($this->getConversationDir().$_SESSION['nickname'].'-new', $conversation."\n");
			}
			$_conversations = $this->readFile($this->conversationDir . $conversation_file);
			$conversations = explode("\n", $_conversations);
			
			$date = ($date != '' ? $date:date('Y-m-d'));
			
			foreach($conversations as $line){
				if($line != ''){
					$parts = explode(' ', $line);
	
					if(strtotime($parts[0]) >= strtotime($date)){
						$begin = substr($line, 0, 20);
						$output .= $begin . $this->getEmoticons(substr($line, 20, strlen($line) - 1));
					}
					else {
						$older = $parts[0];
					}
				}
			}
		}
		
		if($older)
			print '<a href="javascript:showOlder(\''.date('Y-m-d', mktime(0,0,0,date('m', strtotime($older)),date('d', strtotime($older)),date('Y', strtotime($older)))).'\');">Pokaż starsze wiadomości</a><br/>';
		print $output;
	}
	
	function isUserExists($nickname){
		return file_exists($this->sessionDir . $nickname);
	}
	
	function isUserAdded($nickname){
		$_contacts = $this->readFile($this->getSessionDir().$_SESSION['nickname'].'-contacts');
		$contacts = explode("\n", $_contacts);
		
		foreach($contacts as $contact)
			if($contact = $nickname)
				return true;
		
		return false;
	}
	
	function putConversation($conversation, $message, $date){
		if($conversation != 'public'){
			if(file_exists($this->getConversationDir().$conversation.'-'.$_SESSION['nickname'])){
				$conversation_file = $conversation.'-'.$_SESSION['nickname'];
			}
			else if(file_exists($this->getConversationDir().$_SESSION['nickname'].'-'.$conversation)){
				$conversation_file = $_SESSION['nickname'].'-'.$conversation;
			}
			else {
				$conversation_file = $_SESSION['nickname'].'-'.$conversation;
			}
			
			$this->appendToFile($this->getConversationDir().$conversation_file, date('Y-m-d H:i:s').' <b>'.$_SESSION['nickname'].'</b>: '.$message.' <br/>');
			$this->appendToFile($this->getConversationDir().$conversation.'-new', $_SESSION['nickname']."\n");
		}
		else {
			$this->appendToFile($this->getConversationDir().$conversation, date('Y-m-d H:i:s').' <b>'.$_SESSION['nickname'].'</b>: '.$message.' <br/>');
		}
		
		$this->getConversation($conversation, $date);
	}
	
	function checkNewMessages(){
		if(file_exists($this->conversationDir . $_SESSION['nickname'] . '-new')){
			$_news = file_get_contents($this->conversationDir . $_SESSION['nickname'] . '-new');
			$news = explode("\n", $_news);
			
			foreach($news as $new){
				if($new != ''){
					print $new."\n";
				}
			}
		}
	}
	
	function getEmoticons($text){
		require('emoticons.php');
		
		return str_replace($to_replace, $replacement, $text);
	}
}