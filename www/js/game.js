var gameObject = {	
	processID	: null,
	gameID		: null,
	SpielerIDs	: new Array(),
	FragenIDs	: new Array(),
	Aktiv		: null,
	Antworten	: new Array(),
	DataLoaded	: false,
	
	processTBID : null,
	gameTBID	: null,
	
	questionObject : null,
	
	/*
		NEW FUNCTIONS
	*/
	//ERSETZEN MIT DER ONLINE LÖSUNG
	
	startGame : function ()
	{
		if(this.isFinished())
		{
			showAlert('I SHOULDNT BE HERE');
		}
		else
		{
			if(this.DataLoaded)
			{
				$('#wrapper').hide();
			
				newMap.showMap();
				
				newMap.showFokus();
				
				gameObject.getNextQuestion();
				
				$('#NextQuestion').css('display', 'none');
				$('#showAnswer').css('display', 'inline-block');
				
				$(window).resize(function() 
				{
					//drawFokus();
					newMap.positionWorldMap();
					newMap.showFokus();
				});
			}
		}
	},
	
	endGame : function ()
	{
		newMap.hideMap();
		newMap.hideFlag();
	
		window.scrollTo(0,0);
		
		$('#gameNav').hide();
		$('#questionBox').hide();
		$('#visir').hide();
		
		$(window).off("resize");
		
		$('#wrapper').show();
	},
	
	//Bereitet das Spiel vor, alle benötigten Daten werden gesammelt
	prepareGame : function (processID)
	{
		this.processID = processID;
		this.getProcessData(processID);
		
		newMap = map;//Erstelt en MAP Objekt	
		newMap.loadMap();
		
		if(this.isFinished())
		{
			showAlert('Game already finished');//DONT SHOW START GAME
		}
		else
		{
			this.getQuestions();
		}
	},
	
	//Hole alle Information zum gewählten Spiel
	getGameData : function ()
	{
		var success = false;
		
		var tb = JSON.parse(localStorage.getItem('game_tb'));
		var obj = 0;
		
		var len = tb.length;
		
		for(var i = 0; i < len; i++)
		{
			if(this.gameID == tb[i].id)
			{
				obj = tb[i];
				
				this.gameTBID = i;
				
				this.SpielerIDs = obj.SpielerIDs.split(',');
				this.FragenIDs = obj.FragenIDs.split(',');
				
				this.Aktiv = obj.Aktiv;
				
				i = len;
				
				success = true;
			}
		}
		
		return success;
	},
	
	//Hollt alle Process Informationen
	getProcessData : function (processID)
	{
		var success = false;
		
		var tb = JSON.parse(localStorage.getItem('process_tb'));
		var obj = 0;
		
		var len = tb.length;
		
		for(var i = 0; i < len; i++)
		{
			if(processID == tb[i].id)
			{
				obj = tb[i];
				
				this.processTBID = i;
				this.Antworten = obj.Antworten.split(',');
				
				//Korrektur falls falsch gespeichert wird
				if(this.Antworten.length == 1)
				{
					if(this.Antworten[0] == "")
					{
						this.Antworten = new Array();
					}
				}
				//
				
				this.gameID = obj.SpielID;
				
				this.getGameData();
				
				i = len;
				
				success = true;
			}
		}
		
		return success;
	},
	
	//Fragen anfordern
	getQuestions : function ()
	{
		var success = false;
		var self	= this;

		var phpurl = "http://www.ralphsadalski.de/worldmap/php/getQuestions.php";
		var qIDs = this.FragenIDs.join(',');
		
		phpurl += "?qids=" + qIDs;
		
		$.ajax({
			url: phpurl,
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			timeout: 5000,
			async:false,
			beforeSend: function()
			{
				$('#gameList li[id=' + self.processID + '] #gameIcon').hide();
				$('#gameList li[id=' + self.processID + '] #loadingIcon').show();
			},
			success: function(data)
			{
				localStorage.setItem('coor_tb', JSON.stringify(data));
				success = true;
				
				self.DataLoaded = true;
			},
			complete: function()
			{
				$('#gameList li[id=' + self.processID + '] #gameIcon').show();
				$('#gameList li[id=' + self.processID + '] #loadingIcon').hide();
				
				self.startGame();
			},
			error: function()
			{
				showAlert("Verbundung zum Server gescheitert.");
			}
		});
		
		return success;
	},
	
	//Ist das Spiel beendet?
	isFinished : function ()
	{
		if(this.FragenIDs.length == this.Antworten.length)
		{
			return true;
		}
		else
		{
			return false;
		}
	},
	
	//Frage anfordern
	getNextQuestion : function ()
	{
		var self = this;
		
		var questionNum = this.Antworten.length;
		this.questionObject = this.getQuestionData(this.FragenIDs[questionNum]);
		
		$('#questionBox').show();
		$('#gameNav').show();
		$('#questionBox').html('Where is ' + this.questionObject.Q_1 + '?');
	},
	
	//Hollt alle Process Informationen
	getQuestionData : function (qID)
	{
		var success = false;
		
		var tb = JSON.parse(localStorage.getItem('coor_tb'));
		var obj = 0;
		
		var len = tb.length;
		
		for(var i = 0; i < len; i++)
		{
			if(qID == tb[i].id)
			{				
				success = tb[i];
				
				i = len;
			}
		}
		
		return success;
	},
	
	//Antworten speichern
	saveAnswers : function ()
	{
		var success = false;
		
		var d = newMap.calculationDistance(this.questionObject.Latitude,this.questionObject.Longitude);
		
		this.Antworten.push(d);
		
		if(this.Antworten.length != 0)
		{
			var answersEXPORT = this.Antworten.join(",");
			
			var process_tb 	= JSON.parse(localStorage.getItem('process_tb'));
			process_tb[this.processTBID].Antworten = answersEXPORT;
			localStorage.setItem('process_tb', JSON.stringify(process_tb));
			
			var phpurl = "http://www.ralphsadalski.de/worldmap/php/saveAnswers.php";
			
			phpurl += "?pid=" + localStorage.getItem('userID');
			phpurl += "&gid=" + this.gameID;
			phpurl += "&answers=" + answersEXPORT;
			
			$.ajax({
				url: phpurl,
				dataType: 'jsonp',
				jsonp: 'jsoncallback',
				timeout: 5000,
				async:true,
				success: function(data)
				{					
					if(data.success == 1)
					{
						success = true;
					}
				},
				error: function()
				{
					showAlert("Verbundung zum Server gescheitert.");
				}
			});
		}
		
		return success;
	},	
	
	//Durchschnittlicher Abstand zum Ziel
	getAverage : function (Antworten)
	{
		if(Antworten.length > 0)
		{
			var total = 0;
						
			for(var i = 0; i < Antworten.length; i++)
			{
				v = parseFloat(Antworten[i]);
				if (!isNaN(v)) total += v;
			}
			
			var mittel = Math.round(total / Antworten.length);
			
			return mittel;
		}
		else
		{
			return "";
		}
	},
	
	/*
		OLD FUNCTIONS
	*/
	
	//Löscht das Spiel primär in der game_tb und alle die es in der process_tb erwischt
	deleteGame : function ()
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