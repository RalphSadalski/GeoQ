var newMap = null;

function createList ()
{
	console.log('createList loaded');
	
	var games = JSON.parse(localStorage.getItem('process_tb'));
	
	var len = games.length;
	
	var userID = localStorage.getItem('userID');
	
	$('#gameList ul').empty();
	
	var gameList = "";
		
	for (var i = 0; i < len; i++)
	{
		if(games[i] != false && games[i].SpielerID == userID)
		{
			var d = new Date(games[i].Added * 1000);
			var toGermanDate	= d.getDate() + "." + (d.getMonth()+1) + "." + d.getFullYear();
			
			var game = getGameInformations(games[i].SpielID);
			
			gameList += '<li id="' + games[i].id + '"><div><icon id="gameIcon">6</icon><icon id="loadingIcon">b</icon><date>' + toGermanDate + '</date></div><div>';
			
			gameList += '<h3>' + game.Name + '</h3>';
			
			gameList += '<ul class="gamerStat">';
			
			if(game != 0 && game.SpielerIDs != "")
			{
				var multiplayer = game.SpielerIDs;
				multiplayer = multiplayer.split(',');
				
				for(var h = 0; h < multiplayer.length; h++)
				{
					var pgame = this.getPlayerStat(games[i].SpielID, multiplayer[h]);
					
					if(pgame != 0)
					{
						gameList += '<li><div>' + getAverage(pgame.Antworten) + ' km</div><div>' + getPlayerName(multiplayer[h]) + '</div></li>';
					}
					else
					{
						gameList += '<li><div>-</div><div>' + 'Unkown Player' + '</div></li>';
					}
				}
			}
			
			gameList += '</ul></div>';			
			gameList += '</li>';
		}
	}
	
	$('#gameList ul').append(gameList);
	
	$('#gameList > ul > li').on('click', function ()
	{
		gameObject.prepareGame(this.id);
		/*
		gameObject.startGame();
		*/
		//showAlert(qArray.Q_1);
	});
}
	//Return all Informations of a Game
function getGameInformations (gid)
{
		var games = JSON.parse(localStorage.getItem('game_tb'));
		
		var len = games.length;
		
		var game = 0;
		
		for (var i = 0; i < len; i++) {
			if(games[i].id == gid)
			{
				game = games[i];
				i = len;
			}
		}
		
		return game;
}

//Returns the Processes of other players
function getPlayerStat (gid, pid)
{
	var games = JSON.parse(localStorage.getItem('process_tb'));
	
	var len = games.length;
	
	var game = 0;
	
	for (var i = 0; i < len; i++) {
		if(games[i].SpielID == gid && games[i].SpielerID == pid)
		{
			game = games[i];
			i = len;
		}
	}
	
	return game;
}
	
//Durchschnittlicher Abstand zum Ziel
function getAverage (Answers)
{
	if(Answers != "")
	{
		var Antworten = Answers.split(',');
	
		if(Antworten.length > 0)
		{
			var total = 0;
						
			for(var i = 0; i < Antworten.length; i++)
			{
				v = parseFloat(Antworten[i]);
				if (!isNaN(v)) total += v;
			}
			
			var mittel = total / Antworten.length;
			
			return mittel;
		}
		else
		{
			return "";
		}
	}
	else
	{
		return "-";
	}
}
	
function getPlayerName (pid)
{
		var games = JSON.parse(localStorage.getItem('user_tb'));
		
		var len = games.length;
		
		var game = 0;
		
		for (var i = 0; i < len; i++) {
			if(games[i].id == pid)
			{
				game = games[i];
				i = len;
			}
		}
		
		return game.Nickname;
}
	
function createFriendList ()
{
	var users = JSON.parse(localStorage.getItem('user_tb'));
	var userID = localStorage.getItem('userID');
	
	var len = users.length;
	
	var userList = "";
	
	for(var i = 0; i < len; i++)
	{
		if(users[i].id != userID)
		{
			userList += '<li value=' + users[i].id + '>' + users[i].Nickname + '</li>';
		}
	}
	
	$('#FriendSelection').empty();
	$('#FriendSelection').append(userList);
	
	$('#FriendSelection li').on('click', function ()
	{
		var active = $(this).hasClass('activeLi');
		
		if(active)
		{
			$(this).removeClass('activeLi');
		}
		else
		{
			$(this).addClass('activeLi');
		}
	});
}
	
function createCatagoryList ()
{
	var catagories = JSON.parse(localStorage.getItem('catagories'));
	
	var len = catagories.length;
	
	var catagoryList = "";
	
	for(var i = 0; i < len; i++)
	{
		catagoryList += '<li>' + catagories[i] + '</li>';
	}
	
	$('#CategorySelection').empty();
	$('#CategorySelection').append(catagoryList);

	$('#CategorySelection li').on('click', function ()
	{
		var active = $(this).hasClass('activeLi');
		
		if(active)
		{
			$(this).removeClass('activeLi');
		}
		else
		{
			$('#CategorySelection li').each(function()
			{
				var has = $(this).hasClass('activeLi');
				
				if(has)
				{
					$(this).removeClass('activeLi');
				}
			});
			
			$(this).addClass('activeLi');
		}
	});
}

//Funktion für die Erstellung eines neuen Spiels
function addGame(name, type, amount, multi, catagory)
{
	var success = false;
	
	var phpurl = "http://www.ralphsadalski.de/worldmap/php/createGame.php";
		
	multiIDs = multi.join(",");
	
	phpurl += "?typ=" + type;
	phpurl += "&anzahl=" + amount;
	phpurl += "&name=" + name;
	phpurl += "&multi=" + multiIDs;
	phpurl += "&catagory=" + catagory;
	
	$.ajax({
		url: phpurl,
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		timeout: 5000,
		async:false,
		success: function(data)
		{			
			if(data.success == 1)
			{
				//showAlert(data.success);
				success = true;
				
				getUserJSON(localStorage.getItem('userID'));
				
				$('#gameWindow > #wrapper').removeClass('toCreate');
				$('#gameWindow > #wrapper').removeClass('backOptions');
				$('#gameWindow > #wrapper').removeClass('toOptions');
				$('#gameWindow > #wrapper').addClass('backCreate');
			}
		},
		error: function()
		{
			showAlert("Verbundung zum Server gescheitert.");
		}
	});
	
	return success;
}

function searchFriend(string)
{
	var success = false;
	
	var phpurl = "http://www.ralphsadalski.de/worldmap/php/searchFriend.php";
	
	phpurl += "?string=" + string;
	phpurl += "&pid=" + localStorage.getItem('userID');
	
	$.ajax({
		url: phpurl,
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		timeout: 5000,
		async:false,
		success: function(data)
		{			
			if(data.success == 1)
			{
				//showAlert(data.success);
				success = true;
			}
		},
		error: function()
		{
			showAlert("Verbundung zum Server gescheitert.");
		}
	});
	
	return success;
}

// ERSTELLT DEN NICKNAMEN WENN NÖTIG
function setNickname()
{
	var user_tb = JSON.parse(localStorage.getItem('user_tb'));
	var userID = localStorage.getItem('userID');
	
	var len = user_tb.length;
	
	for (var i = 0; i < len; i++)
	{
		if(user_tb[i].id == userID)
		{
			var nickname = user_tb[i].Nickname;
			
			if(nickname != "")
			{
				$('#OnlineNickname').show();
				$('#OnlineNickname').append(nickname);
				$('#CreateOnlineAccount').hide();
				$('#newNickname').hide();
			}
			else
			{
				$('#OnlineNickname').hide();
				$('#newNickname').show();
				
				$('#CreateOnlineAccount').on('click', function ()
				{
					/*
						Validieren
						Hochladen
						getUserJSON();
					*/
					var input = $('#newNickname').val();
					
					if(input != "")
					{
						setNewNickname(input);
					}
				});
			}
			
			i = len;
		}
	}	
}

function setNewNickname(string)
{
	var success = false;
	
	var phpurl = "http://www.ralphsadalski.de/worldmap/php/setNewNickname.php";
	
	phpurl += "?nick=" + string;
	phpurl += "&pid=" + localStorage.getItem('userID');
	
	$.ajax({
		url: phpurl,
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		timeout: 5000,
		async:false,
		success: function(data)
		{			
			if(data.success == 1)
			{
				//showAlert(data.success);
				success = true;
				getUserJSON(localStorage.getItem('userID'));
			}
		},
		error: function()
		{
			showAlert("Verbundung zum Server gescheitert.");
		}
	});
	
	return success;
}