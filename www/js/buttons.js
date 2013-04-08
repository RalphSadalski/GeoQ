$(document).ready(function() {
	
	//document.getElementById('toOptions').addEventListener('click', toOptions);
	//document.getElementById('toCreate').addEventListener('click', toCreate);
	
	document.getElementById('toOptions').addEventListener('touchstart', toOptions);
	
	function toOptions(e) 
	{		
  		e.preventDefault();
		
		var hasClass = $('#gameWindow > #wrapper').hasClass('toOptions');
		
		if(hasClass)
		{
			calcTime('#backOptions');
			
			$('#gameWindow > #wrapper').removeClass('toOptions');
			$('#gameWindow > #wrapper').removeClass('toCreate');
			$('#gameWindow > #wrapper').removeClass('backCreate');
			$('#gameWindow > #wrapper').addClass('backOptions');
		}
		else
		{
			calcTime('#toOptions');
			
			$('#gameWindow > #wrapper').removeClass('backOptions');
			$('#gameWindow > #wrapper').removeClass('toCreate');
			$('#gameWindow > #wrapper').removeClass('backCreate');
			$('#gameWindow > #wrapper').addClass('toOptions');
		}
	}
	
	document.getElementById('toCreate').addEventListener('touchstart', toCreate);
	function toCreate (e)
	{		
		e.preventDefault();
		
		var hasClass = $('#gameWindow > #wrapper').hasClass('toCreate');
		
		if(hasClass)
		{
			calcTime('#backCreate');
			
			$('#gameWindow > #wrapper').removeClass('toCreate');
			$('#gameWindow > #wrapper').removeClass('backOptions');
			$('#gameWindow > #wrapper').removeClass('toOptions');
			$('#gameWindow > #wrapper').addClass('backCreate');
		}
		else
		{
			calcTime('#toCreate');
			
			$('#gameWindow > #wrapper').removeClass('backCreate');
			$('#gameWindow > #wrapper').removeClass('backOptions');
			$('#gameWindow > #wrapper').removeClass('toOptions');
			$('#gameWindow > #wrapper').addClass('toCreate');
		}
	}
	
	$('#reloadView').on('click', function ()
	{
<<<<<<< HEAD
		calcTime('#reloadView');
=======
		console.log('#reloadView clicked');
		
>>>>>>> update
		createList();
	});
	
	$('#AmountSelection li').on('click', function ()
	{
		var active = $(this).hasClass('activeLi');
		
		if(active)
		{
			$(this).removeClass('activeLi');
		}
		else
		{
			$('#AmountSelection li').each(function()
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
	
	$('#TypeSelection li').on('click', function ()
	{
		var active = $(this).hasClass('activeLi');
		
		if(active)
		{
			$(this).removeClass('activeLi');
		}
		else
		{
			$('#TypeSelection li').each(function()
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
	
	//Funktion zum erstellen einen neuen Spiels
	$('#createNewGame').click(function () 
	{
		calcTime('#createNewGame');
		var success = true;
		
		var multiplayerIDs = new Array();
		var type, amount, catagory = "";
		
		multiplayerIDs.push(localStorage.getItem('userID'));
		
		$('#TypeSelection li').each(function()
		{
			var has = $(this).hasClass('activeLi');
			
			if(has)
			{
				type = $(this).val();
			}
		});
		
		$('#AmountSelection li').each(function()
		{
			var has = $(this).hasClass('activeLi');
			
			if(has)
			{
				amount = $(this).val();
			}
		});
		
		$('#CategorySelection li').each(function()
		{
			var has = $(this).hasClass('activeLi');
			
			if(has)
			{
				catagory = $(this).html();
			}
		});
		
		$('#FriendSelection li').each(function()
		{
			var has = $(this).hasClass('activeLi');
			
			if(has)
			{
				multiplayerIDs.push($(this).val());
			}
		});
		
		var name 		= $('#newGameTitle').val();
		
		//calcTime('name: ' + name + ', type: ' + type + ', amount: ' + amount + ', multiplayerIDs: ' + multiplayerIDs + ', catagory: ' + catagory);
		
		if(name != "" && type != "undefined" && amount != "undefined" && catagory != "")
		{
			var newGame = addGame(name, type, amount, multiplayerIDs, catagory);
		}
		else
		{
			calcTime('#createNewGame - fehlende Daten');
		}	
	});
	
	//Suche nach Freund
	$('#findFriend').click(function () {
		var input = $('#newFriendname');
		
		var searchString = input.val();
		
		if(searchString != "")
		{					
			if(searchFriend(searchString) == true)
			{
				//
			}
			else
			{
				calcTime('#findFriend - failed');
			}
		}
	});
	
	$('#showAnswer').on('click', function ()
	{
		newMap.showFlag(gameObject.questionObject.Latitude,gameObject.questionObject.Longitude);
		newMap.showFlagUser();
		
		gameObject.saveAnswers();
		
		var isFinished = gameObject.isFinished();
		
		if(isFinished)
		{
			$('#questionBox').html('You have finished this game with an average distance of ' + gameObject.getAverage(gameObject.Antworten) + ' km.');
		}
		else
		{
			$('#NextQuestion').css('display', 'inline-block');
		}
		
		$('#showAnswer').css('display', 'none');
	});
	
	$('#NextQuestion').on('click', function ()
	{
		gameObject.getNextQuestion();
		
		$('#NextQuestion').css('display', 'none');
		newMap.hideFlag();
		$('#showAnswer').css('display', 'inline-block');
	});
	
	$('#BackToGameView').on('click', function ()
	{
		gameObject.endGame();
	});
});

function quitGameView()
{
	calcTime('Hardwarebutton - backbutton released');
		
	// We are going back to home so remove the event listener 
	// so the default back key behaviour will take over
	document.removeEventListener("backbutton", quitGameView, false);
		
	// Hide the current dive and show home
	/*
	document.getElementById(cur).style.display = 'none';
	document.getElementById('home').style.display = 'block';
	*/
	
	newMap.hideMap();
}

function changeBehaviorOfBackButton()
{
	// We are moving to a new div so over ride the back button 
	// so when a users presses back it will show the home div
	document.addEventListener("backbutton", quitGameView, false);
		
	// Hide home and show the new div
	/*
	document.getElementById('home').style.display = 'none';
	document.getElementById(id).style.display = 'block';
	*/
}
