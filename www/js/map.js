//Globale Debuging Variablen
var debug			= false;
//Globale Variablen
var currentQUESTIONARRAY 	= null;
var multiplayerIDs			= new Array();//Soll ein Zwischenspeicher für das hinzufügen von Spieler zum Multiplayerspiel
//Objekte
var playerGames		= null;
var playGame		= null;

var playMap			= new Map();

/*
	OBJEKTE
*/
function Game (gameID)//playGame
{
	this.ID			= gameID;
	this.Added		= null;
	this.Name		= null;
	this.Typ		= null;
	this.SpielerIDs	= new Array();
	this.FragenIDs	= new Array();
	this.Aktiv		= null;
	this.Antworten	= new Array();
	
	var pID			= playerGames.playerID;
	
	this.statistik 	= new Array();
	
	//Hole alle Information zum gewählten Spiel
	this.getInfo = function ()
	{
		var phpurl = "http://www.ralphsadalski.de/worldmap/php/getGameInfo.php";
		
		phpurl += "?gid=" + this.ID;
		
		var array = new Array();
		
		$.ajax({
			url: phpurl,
			type: "GET",
			dataType: 'json',
			async: false,
			success: function(data)
			{
				if(debug == true)
				{
					showAlert("Verbindung zum Server hergestellt.");
					if(data.error != "")
					{
						showAlert(data.error);
					}
				}
				
				if(data.success != 0)
				{
					var text = data.success;
					array = text.split(";");
				}
			},
			error: function()
			{
				showAlert("Verbundung zum Server gescheitert.");
			}
		});
		
		this.Added		= array[0];
		this.Name		= array[1];
		this.Typ		= array[2];
		
		var ArrayString	= array[3];
		this.SpielerIDs	= ArrayString.split(',');
		
		var ArrayStringb = array[4];
		this.FragenIDs	= ArrayStringb.split(',');
		
		this.Aktiv		= array[5];
		
		this.getGivenAnswers();
	}
	
	//Welche Antworten wurden bereits gegeben
	this.getGivenAnswers = function ()
	{
		var aurl = "http://www.ralphsadalski.de/worldmap/php/getAnswers.php";
	
		aurl += "?gid=" + this.ID;
		aurl += "&pid=" + pID;
		
		var array = new Array();
		
		$.ajax({
			url: aurl,
			type: "GET",
			dataType: 'json',
			async: false,
			success: function(data)
			{
				if(debug == true)
				{
					showAlert("Verbindung zum Server hergestellt.");
					if(data.error != "")
					{
						showAlert(data.error);
					}
				}
				
				if(data.success != 0 && data.error == 0)
				{
					var text = data.success;
					array = text.split(";");
				}
				
			},
			error: function()
			{
				showAlert("Verbundung zum Server gescheitert.");
			}
		});
		
		this.Antworten = array;
	}
	
	//Ist das Spiel beendet?
	this.isFinished = function ()
	{
		if(this.FragenIDs.length == this.Antworten.length)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	//Antworten speichern
	this.saveAnswers = function ()
	{
		if(this.Antworten.length != 0)
		{
			var answersEXPORT = this.Antworten.join(";");
			
			var success = false;
			
			var phpurl = "http://www.ralphsadalski.de/worldmap/php/saveAnswers.php";
			
			phpurl += "?pid=" + pID;
			phpurl += "&gid=" + this.ID;
			phpurl += "&answers=" + answersEXPORT;
			
			$.ajax({
				url: phpurl,
				type: "GET",
				dataType: 'json',
				async: false,
				success: function(data)
				{
					if(debug == true)
					{
						showAlert("Verbindung zum Server hergestellt.");
						if(data.error != "")
						{
							showAlert(data.error);
						}
					}
					
					if(data.success != 0)
					{
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
	}
	
	//Wie sind die Statistiken der anderen Spieler
	this.getGameStat = function ()
	{
		//var output = $('#output');
		
		var phpurl  = 'http://www.ralphsadalski.de/worldmap/php/getGameStat.php';
		
		phpurl += '?gid=' + this.ID;
		phpurl += '&ids=' + this.SpielerIDs.join(',');
		
		$.ajax({
			url: phpurl,
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			timeout: 5000,
			async:false,
			success: function(data, status)
			{
				var output = "";
				var gameID = "";
								
				$.each(data, function(i,item)
				{
					
					output += '<li id="' + item.SpielerID + '"><lable>' + getFriendsName(item.SpielerID) + '</label><lable>' + getAverage(item.Antworten.split(';')) + ' km</label></li>';
					gameID = item.SpielID;
				});
				
				$('#stat-' + gameID).append(output);
				$('#stat-' + gameID).click(function ()
				{
					event.stopPropagation();
				});
			},
			error: function()
			{
				showAlert('Keine Verbindung zum Server möglich.');
				//output.text('There was an error loading the data.');
			}
		});
	}
	
	//Durchschnittlicher Abstand zum Ziel
	var getAverage = function (Antworten)
	{
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
	
	//Läd den Namen zu einer bestimmten ID
	var getFriendsName = function (friendid)
	{
		var success = false;
		
		var phpurl = "http://www.ralphsadalski.de/worldmap/php/getFriendName.php";
		phpurl += "?fid=" + friendid;
		
		$.ajax({
			url: phpurl,
			type: "GET",
			dataType: 'json',
			async: false,
			success: function(data)
			{
				if(debug == true)
				{
					showAlert("Verbindung zum Server hergestellt.");
					if(data.error != "")
					{
						showAlert(data.error);
					}
				}
				
				if(data.success != 0)
				{
					//showAlert(data.success);
					success = data.success;
				}
			},
			error: function()
			{
				showAlert("Verbundung zum Server gescheitert.");
			}
		});
		
		return success;
	}
	
	//Frage anfordern
	this.getQuestion = function ()
	{
		var success = false;
		var QuestionNum = this.FragenIDs[this.Antworten.length];
	
		var phpurl = "http://www.ralphsadalski.de/worldmap/php/getQuestion.php";
		
		phpurl += "?qid=" + QuestionNum;
		
		$.ajax({
			url: phpurl,
			type: "GET",
			dataType: 'json',
			async: false,
			success: function(data)
			{
				if(debug == true)
				{
					showAlert("Verbindung zum Server hergestellt.");
					if(data.error != "")
					{
						showAlert(data.error);
					}
				}
				
				if(data.success != 0)
				{
					var array = data.success;
					success = array.split(";");
				}
			},
			error: function()
			{
				showAlert("Verbundung zum Server gescheitert.");
			}
		});
		
		return success;
	}
	
	//Löscht das Spiel primär in der game_tb und alle die es in der process_tb erwischt
	this.deleteGame = function ()
	{
		var success = false;
			
		var phpurl = "http://www.ralphsadalski.de/worldmap/php/deleteGame.php";
		
		phpurl += "?gid=" + this.ID;
		
		$.ajax({
			url: phpurl,
			type: "GET",
			dataType: 'json',
			async: false,
			success: function(data)
			{
				if(debug == true)
				{
					showAlert("Verbindung zum Server hergestellt.");
					if(data.error != "")
					{
						showAlert(data.error);
					}
				}
				
				if(data.success != 0)
				{
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
}

//Hier sollen sämtliche Informationen des Spielers hinterlegt werden
function Games()//playerGames
{
	this.playerID		= playerID;
	this.gameIDs		= new Array();
	/*
		Funktionen des Objektes
	*/
	
	this.createList = function ()
	{
		var games = JSON.parse(localStorage.getItem('process_tb'));
		
		showAlert(games);
	}
	
	//Erstellt eine Liste von noch vorhandenen Spielen aus der process_tb
	this.getList = function ()
	{
		var games = JSON.parse(localStorage.getItem('process_tb'));
			
		var len = games.length;
		
		if(len != 0)
		{
			$('#gameList').empty();
			
			for (var i = 0; i < len; i++) {
				var ThisGame = new Game(this.gameIDs[i]);
				ThisGame.getInfo();
				
				//var gameInfo 		= this.getGameInfo(array[i]);
				var d 				= new Date(ThisGame.Added * 1000);
				var toGermanDate	= d.getDate() + "." + (d.getMonth()+1) + "." + d.getFullYear();
				
				var text = '<li class="availablegame" id="' + ThisGame.ID + '">';
				
				text += '<button class="deleteGame" id="' + ThisGame.ID + '"></button>';
				text += '<h3>' + ThisGame.Name + '</h3>';
				//text += '<p>' + toGermanDate + '</p>';
				//Spielstatistik hinzufügen
				text += '<ul id="stat-' + ThisGame.ID + '"></ul>';
				text += '</li>';
				
				$('#AvailableGames').prepend(text);
				
				ThisGame.getGameStat();
			}
			
			$("#AvailableGames li").click(function() 
			{
				playGame = new Game(this.id);
				playGame.getInfo();
				
				if(playGame.isFinished() == false)
				{
					if(playGame.FragenIDs != null)
					{							
						currentQUESTIONARRAY = playGame.getQuestion();
									
						//showAlert(currentQUESTIONARRAY[0] + "-" + currentQUESTIONARRAY[1] + "-" + currentQUESTIONARRAY[2] + "-" + currentQUESTIONARRAY[3] + "-" + currentQUESTIONARRAY[4]);
									
						$('#gameView').slideUp('slow', function() {
							$('#map').fadeIn("slow", function() {
								$('#currentQuestion').html(currentQUESTIONARRAY[2]);
								$('#currentQuestion').delay(2000).slideDown("slow");
							});
							$('#visir').fadeIn('fast');
							$('#positionView').fadeIn('fast');
						});
					}
				}
				else
				{
          			//Funktion ausdenken wenn das Spiel schon gespielt wurde
				}
			});
			
			$("#AvailableGames li .deleteGame").click(function()
			{
				event.stopPropagation();
				
				var phpurl = "http://www.ralphsadalski.de/worldmap/php/deleteGame.php";
				
				phpurl += "?gid=" + this.id;
				
				$.ajax({
					url: phpurl,
					type: "GET",
					dataType: 'json',
					async: false,
					success: function(data)
					{
						if(debug == true)
						{
							showAlert("Verbindung zum Server hergestellt.");
							if(data.error != "")
							{
								showAlert(data.error);
							}
						}
						
						if(data.success == 0)
						{
							showAlert('Fehler beim löschen');
						}
						
						if(data.success == 1)
						{
							$(event.target).parent().slideUp(1000);
						}
					},
					error: function()
					{
						showAlert("Verbundung zum Server gescheitert.");
					}
				});
			});
			
			return true;
		}
		else
		{
			$('#createGameView').fadeIn('slow');
			return false;
		}
	}
	
	//Diese Funktion durchsucht die Tabelle user_tb nach einem andere Spieler == searchString
	this.searchFriends = function (string)
	{
		var success = false;
		
		var phpurl = "http://www.ralphsadalski.de/worldmap/php/searchFriend.php";
		
		phpurl += "?string=" + string;
		phpurl += "&pid=" + this.playerID;
		
		$.ajax({
			url: phpurl,
			type: "GET",
			dataType: 'json',
			async: false,
			success: function(data)
			{
				if(debug == true)
				{
					showAlert("Verbindung zum Server hergestellt.");
					if(data.error != "")
					{
						showAlert(data.error);
					}
				}
				
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
	
	//Läd die IDs der Spieler aus der Spalte "Freunde" ind der user_tb
	this.getFriends = function ()
	{
		var success = false;
		
		var phpurl = "http://www.ralphsadalski.de/worldmap/php/getFriends.php";
		phpurl += "?pid=" + this.playerID;
		
		$.ajax({
			url: phpurl,
			type: "GET",
			dataType: 'json',
			async: false,
			success: function(data)
			{
				if(debug == true)
				{
					showAlert("Verbindung zum Server hergestellt.");
					if(data.error != "")
					{
						showAlert(data.error);
					}
				}
				
				if(data.success != 0)
				{
					//showAlert(data.success);
					success = data.success;
					success = success.split(',');
				}
			},
			error: function()
			{
				showAlert("Verbundung zum Server gescheitert.");
			}
		});
		
		return success;
	}
	
	//Erstellt eine Liste mit den hinzugefügten Freunden
	this.loadFriendList = function ()
	{
		var friendIDs = this.getFriends();
		
		var view = $('#createGameView ul');
		
		view.empty();
		
		view.append('<ul>');
		
		$.each( friendIDs, function(id) {
			var id = this;
			
			var success = false;
		
			var phpurl = "http://www.ralphsadalski.de/worldmap/php/getFriendName.php";
			phpurl += "?fid=" + id;
			
			$.ajax({
				url: phpurl,
				type: "GET",
				dataType: 'json',
				async: false,
				success: function(data)
				{
					if(debug == true)
					{
						showAlert("Verbindung zum Server hergestellt.");
						if(data.error != "")
						{
							showAlert(data.error);
						}
					}
					
					if(data.success != 0)
					{
						//showAlert(data.success);
						success = data.success;
					}
				},
				error: function()
				{
					showAlert("Verbundung zum Server gescheitert.");
				}
			});
			
			var text = '<li id="' + id + '"><lable>' + success + '</lable></li>';
			
			view.append(text);
		});
		
		view.append('</ul>');
		
		$('#createGameView ul li').click(function () {
			var userIndex = multiplayerIDs.indexOf(this.id);
			
			if(userIndex != -1)
			{
				multiplayerIDs.splice(userIndex,1);	
			}
			else
			{
				multiplayerIDs.push(this.id);
			}
			$(this).toggleClass('withPlayer');
		});
	}
}

function Map()
{
	this.leftLongitude 		= null;
	this.rightLongitude 	= null;
	this.topLatitude 		= null;
	this.bottomLatitude 	= null;
	
	this.mapWidth			= null;
	this.mapHeight			= null;
	
	var maps				= new Array();
	maps.push('map/-90_90_-72_72.jpg');
	
	this.loadMap = function ()
	{
		$('#map').empty();
		
		$('#map').prepend('<img id="worldmap" class="worldmap" src="' + maps[0] + '" />');
		
		this.positionWorldMap();
		
		this.getMapBounds();
		
		$(window).resize(function() 
        {
            drawFokus();
            this.positionWorldMap();
        });
	}
	
	this.showFlag = function (LAT, LON)
	{
		var Pos = this.convertGeoToPixel(LAT,LON);
		
		var Res = this.getWindowResolution();
		
		var marginLeft = $('#worldmap').css('margin-left');
		
		var x	= Pos[0] + Res[0] / 2;
		
		var marginTop = $('#worldmap').css('margin-top');
		
		var y	= Pos[1] + Res[1] / 2;
		
		$('#flag').css("left", x);
		$('#flag').css("top", y);
		
		$('#flag').slideDown('slow');	
	}
	
	this.convertGeoToPixel = function (LAT, LON)//Diese MotherFucking Funktion hat mich 3 Stunden meines kostbaren Lebens gekostet
	{
		this.setWidthHeight();
		
		var delta 			= (this.rightLongitude - this.leftLongitude);
		
		var x				= this.mapWidth * ( (LON - this.leftLongitude) / delta );
		
		var lat 			= LAT * Math.PI / 180;
	
    	var worldMapWidth 	= ((this.mapWidth / delta) * 360) / (2 * Math.PI);
	
		var oben = (1 + Math.sin(this.bottomLatitude * Math.PI / 180));
	
		var unten = (1 - Math.sin(this.bottomLatitude * Math.PI / 180));
	
		var logo = Math.log(oben / unten);
	
    	var mapOffsetY = (worldMapWidth / 2 * logo);
	
		var obenb = (1 + Math.sin(lat));
	
		var untenb = (1 - Math.sin(lat));
	
		var logb = Math.log(obenb / untenb);	
	
    	var y = this.mapHeight - ((worldMapWidth / 2 * logb) - mapOffsetY);
		
		var array = new Array();
		array.push(x);
		array.push(y);
		
		return array;
	}
	
	this.hideFlag = function ()
	{
		$('#flag').delay(6000).slideUp('slow');	
	}
	
	this.positionWorldMap = function ()
	{
		var res = this.getWindowResolution();

		map.style.marginTop = Math.round(res[1]/2) + "px";
		map.style.marginBottom = Math.round(res[1]/2) + "px";
		map.style.marginLeft = Math.round(res[0]/2) + "px";
		map.style.marginRight = Math.round(res[0]/2) + "px";
	}
	
	this.getMapBounds = function ()
	{
		var map = maps[0];
		
		var firstSplit = map.split('/');
		
		var secondSplit = firstSplit[1].split('.');
		
		var coordinates = secondSplit[0].split('_');
		
		this.leftLongitude  	= Number(coordinates[0]);
		this.rightLongitude 	= Number(coordinates[1]);
		this.topLatitude 		= Number(coordinates[3]);
		this.bottomLatitude		= Number(coordinates[2]);
	}
	
	this.setWidthHeight = function ()
	{
		var img = document.getElementById('worldmap'); 
	
		this.mapWidth 	= img.clientWidth;
		this.mapHeight 	= img.clientHeight;
	}
	
	this.getWindowResolution = function ()
	{
		if (document.body && document.body.offsetWidth) 
		{
			winW = document.body.offsetWidth;
			winH = document.body.offsetHeight;
		}
		if (document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth)
		{
			winW = document.documentElement.offsetWidth;
			winH = document.documentElement.offsetHeight;
		}
		if (window.innerWidth && window.innerHeight) 
		{
			winW = window.innerWidth;
			winH = window.innerHeight;
		}
		
		var array = new Array();
		array.push(winW);
		array.push(winH);
		
		return array;
	}
}
/*
	ENDE OBJEKTE
*/
////////////////////////////////////////////////
/*
	FUNKTIONEN
*/
function calculationDistance(pointLAT, pointLON)
{
	var img = document.getElementById('worldmap'); 

    scrollXY        = getScrollXY();

    mapX            = scrollXY[0];
    mapY            = scrollXY[1];

    mapW            = img.clientWidth;
    mapH            = img.clientHeight;
	
	mapDelta		= (playMap.rightLongitude - playMap.leftLongitude);		//Grad

    mapLO          = (mapX / mapW) * (mapDelta) + playMap.leftLongitude;

    mapR            = (mapW / mapDelta) * 360 / (2 * Math.PI);				//Grad

	mapLA           = 180 / Math.PI * (2 * Math.atan( Math.pow(Math.E , (mapH / 2 - mapY)/mapR) ) - 0.5 * Math.PI);
	
	var R           = 6371; // km
	var dLat        = (mapLA - pointLAT) * Math.PI / 180;
	var dLon        = (mapLO - pointLON) * Math.PI / 180;
	var lat1        = (pointLAT) * Math.PI / 180;
	var lat2        = (mapLA) * Math.PI / 180;

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = Math.round(R * c);
	
	return d;
}
//Ein sich regelmäßig wiederholendes Event
function eachONE ()
{
	//showAlert('HEIM');
	if(playGame != null)
	{
		playGame.saveAnswers();
	}
	var restartONE = setTimeout(function() { eachONE() }, 60000);
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
		type: "GET",
		dataType: 'json',
		async: false,
		success: function(data)
		{
			if(debug == true)
			{
				showAlert("Verbindung zum Server hergestellt.");
				if(data.error != "")
				{
					showAlert(data.error);
				}
			}
			
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
//Funktion für die Registrieurng einen neuen Spieler im System
function regUser(mail, pass, name, vorname, nickname) 
{
	pass = md5(pass);//vorher md5.js einbinden
	var success = false;
	
	var phpurl = "http://www.ralphsadalski.de/worldmap/php/regUser.php";
	
	phpurl += "?mail=" + mail;
	phpurl += "&pass=" + pass;
	phpurl += "&name=" + name;
	phpurl += "&vorname=" + vorname;
	phpurl += "&nick=" + nickname;
	
	//showAlert(phpurl);
	
	$.ajax({
		url: phpurl,
		type: "GET",
		dataType: 'json',
		async: false,
		success: function(data)
		{
			if(debug == true)
			{
				showAlert("Verbindung zum Server hergestellt.");
				if(data.error != "")
				{
					showAlert(data.error);
				}
			}
			
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
//Funktion für das Anmelden eines Spielers
function loginUser(mail, pass)
{
	pass = md5(pass);//vorher md5.js einbinden
	var success = false;
	
	var phpurl = "http://www.ralphsadalski.de/worldmap/php/loginUser.php";
	
	phpurl += "?mail=" + mail;
	phpurl += "&pass=" + pass;
	
	$.ajax({
		url: phpurl,
		type: "GET",
		dataType: 'json',
		async: false,
		success: function(data)
		{
			if(debug == true)
			{
				showAlert("Verbindung zum Server hergestellt.");
				if(data.msg != "")
				{
					showAlert(data.msg);
				}
			}
			
			if(data.success == 1)
			{
				//showAlert(data.success);
				success = data.msg;
			}
		},
		error: function()
		{
			showAlert("Verbundung zum Server gescheitert.");
		}
	});
	
	return success;
}
//Suche nach einem Freund
function searchFriends(string, pID)
{
	var success = false;
	
	var phpurl = "http://www.ralphsadalski.de/worldmap/php/searchFriend.php";
	
	phpurl += "?string=" + string;
	phpurl += "&pid=" + pID;
	
	$.ajax({
		url: phpurl,
		type: "GET",
		dataType: 'json',
		async: false,
		success: function(data)
		{
			if(debug == true)
			{
				showAlert("Verbindung zum Server hergestellt.");
				if(data.error != "")
				{
					showAlert(data.error);
				}
			}
			
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
//Diese Funktion erstellt ein Spiel mit ein paar Einstellmöglichkeiten
function createGame(name,typ,katalog,anzahl,pid)
{
	var phpurl = "http://www.ralphsadalski.de/worldmap/php/createGame.php";
	
	phpurl += "?name=" + name;
	phpurl += "&typ=" + typ;
	phpurl += "&katalog=" + katalog;
	phpurl += "&anzahl=" + anzahl;
	phpurl += "&pid=" + pid;
	
	$.ajax({
		url: phpurl,
		type: get,
		dataType: 'text',
		async: false,
		success: function(data)
		{
			if(!data)//Falls data nicht als TEXT erkannt wird, sondern als true oder false
			{
				showAlert('Die Erstellung eines Spiels war nicht erfolgreich.');
			}
			else
			{
				findGames(playerGames.playerID);
			}
		}
	});
}
//////////////////////////////
//Screenresolution berechnen       
function drawFokus()
{
	var res = playMap.getWindowResolution();

	var canvas = document.getElementById('visir');

	canvas.width = res[0];
	canvas.height = res[1];

	if (canvas.getContext)
	{         
		// use getContext to use the canvas for drawing
		var ctx = canvas.getContext('2d');

		// Kreis
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(Math.round(winW/2),Math.round(winH/2),50,0,Math.PI*2,true);
		ctx.stroke();
 
		// horizontale Linie
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0,Math.round(winH/2));
		ctx.lineTo(winW,Math.round(winH/2));
		ctx.stroke();

		// vertikale Linie
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(Math.round(winW/2), 0);
		ctx.lineTo(Math.round(winW/2),winH);
		ctx.stroke();       
	}
	else 
	{
		showAlert('You need Safari or Firefox 1.5+ to see this demo.');
	}
}
///Liefert fehlerhafte Werte scrofx liefert ständig den selben wert
function getScrollXY() 
{
	var scrOfX = 0, scrOfY = 0;
 
	if( typeof( window.pageYOffset ) == 'number' ) {
		//Netscape compliant
		scrOfY = window.pageYOffset;
		scrOfX = window.pageXOffset;
	} else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
		//DOM compliant
		scrOfY = document.body.scrollTop;
		scrOfX = document.body.scrollLeft;
	} else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
		//IE6 standards compliant mode
		scrOfY = document.documentElement.scrollTop;
		scrOfX = document.documentElement.scrollLeft;
	}
	return [ scrOfX, scrOfY ];
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
	Number.prototype.toRad = function() {
	return this * Math.PI / 180;
	}
}