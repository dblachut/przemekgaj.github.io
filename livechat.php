<?php
ini_set('display_errors', 1);

include_once('class.livechat.php');

$chat = new Livechat();

if(isset($_POST['todo']))
switch($_POST['todo']){
	case 'save':
		if($_POST['new_u'] == 1){
			if($chat->isUserAdded($_POST['login']))
				$chat->appendToFile($chat->getSessionDir().$_SESSION['nickname'].'-contacts', $_POST['login']);
		}
		else {
			$chat->editLine($_SESSION['nickname'].'-contacts', $_POST['edited'], $_POST['login']);
		}
		break;
	case 'save-status':
		$chat->changeStatus($_POST['status'], $_POST['desc']);
		break;
	case 'check-new':
		$chat->checkNewMessages();
		break;
	case 'check-user':
		print $chat->isUserExists($_POST['login']);
		break;
	case 'get-contacts':
		$chat->getContacts();
		break;
	case 'get-status':
		$chat->getStatus();
		break;
	case 'delete-contact':
		$chat->deleteLine($chat->getSessionDir().$_SESSION['nickname'].'-contacts', $_POST['login']);
		break;
	case 'get-conversation':
		$chat->getConversation($_POST['conversation'], $_POST['date']);
		break;
	case 'send-message':
		$chat->putConversation($_POST['conversation'], $_POST['message'], $_POST['date']);
		break;	
	default:
		print $chat->isAvailable($_POST['login'], $_POST['email']);

}