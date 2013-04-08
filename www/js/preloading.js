//CHECK EACH SECOND FOR PRELOADING STATUS
function status()
{
	//calcTime('status');
	
	var allItems = localStorage.length;
	var counter = 0;
	var progress = 0;
	
	for (var i = 0; i < allItems; i++)
	{
		var value = localStorage.getItem(localStorage.key(i));
		
		if(value !== null && value != "")
		{
			counter++;
		}
	}
	
	if(localStorage.getItem('userID') == "" && localStorage.getItem('process_tb') == "")
	{
		getUserID();
	}
	
	allItems = allItems - 4;
	
	progress = counter / allItems * 100;
	
	if(progress < 100 || localStorage.getItem('userID') == "")
	{
		var restart = setTimeout(function() { status() }, 1000);
		//calcTime('status restarted');
	}
	else
	{
		//calcTime('status left');
		
		createList();
		createFriendList();
		createCatagoryList();
		
		$('#wrapper').addClass('translateToGameView');
	}
}
//GET USER ID FROM USER_TB
function getUserID()
{
	//calcTime("getUserID");
	
	var phpurl  = 'http://www.ralphsadalski.de/worldmap/php/getUserID.php';
	
	var devicename = localStorage.getItem('deviceName');
	var deviceuuid = localStorage.getItem('deviceUUID');
	
	if(devicename != "" && deviceuuid != "")
	{		
		phpurl += '?devicename=' + devicename;
		phpurl += '&deviceuuid=' + deviceuuid;
		$.ajax({
			url: phpurl,
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			timeout: 5000,
			async:false,
			beforeSend: function ()
			{
				//calcTime('getUserID - beforeSend');
			},
			success: function(data)
			{
				if(data.userID != 0)
				{
					//calcTime('getUserID - success');
					
					localStorage.setItem('userID', data.userID);
					
					getUserJSON(data.userID);
				}
				else
				{
					//calcTime('getUserID - wrong data');
				}
			},
			error: function()
			{
				//calcTime('getUserID - error');
			}
		});
	}
}

function getUserJSON(userID)
{
	//calcTime('getUserJSON');
	
	if(userID > 0)
	{
		var phpurl  = 'http://www.ralphsadalski.de/worldmap/php/getUserJSON.php';
	
		phpurl += '?pid=' + userID;
		
		$.ajax({
			url: phpurl,
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			timeout: 5000,
			async:false,
			beforeSend: function ()
			{
				//calcTime('getUserJSON - beforeSend');
			},
			success: function(data)
			{
				//calcTime('getUserJSON - success');
				
				localStorage.setItem("process_tb", JSON.stringify(data.process_tb));
				localStorage.setItem("game_tb", JSON.stringify(data.game_tb));
				localStorage.setItem("user_tb", JSON.stringify(data.user_tb));
				localStorage.setItem("catagories", JSON.stringify(data.catagories));
		
				createList();
		
				setNickname();
			},
			error: function()
			{
				//calcTime('getUserJSON - error');
			}
		});
	}
	else
	{	
		//calcTime('getUserJSON - no userID');
	}
}


function showAlert (message)
{
	var title = 'Info';
	
	if (navigator.notification)
	{
		navigator.notification.alert(message, null, title, 'OK');
	}
	else
	{
		alert(title ? (title + ": " + message) : message);
	}
}
