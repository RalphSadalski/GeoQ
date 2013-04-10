var viewManager = {
	initialize: function ()
	{
		this.ListView();
<<<<<<< HEAD
		
		document.addEventListener("deviceready", onDeviceReady, false);
=======
>>>>>>> update
	},
	
	ListView : function ()
	{
		this.loadView('ListView.html');
<<<<<<< HEAD
		
		alert('ListView');
=======
>>>>>>> update
	},
	
	loadView : function (localURL)
	{
		var URL = "views/" + localURL;
		var time = 0;
		
		var Storage = localStorage.getItem(localURL);
		
		if(Storage == null)
		{		
			$.ajax({
			    url: URL, // relative path to www folder
			    type:"get",
			    dataType:"html",
			    beforeSend: function ()
			    {
			    	time = new Date();
			    },
			    success: function(view)
			    {
			    	localStorage.setItem(localURL, view);
			    	Storage = localStorage.getItem(localURL);
			    	
			        $('body').empty();
				$('body').append(Storage);
				
				alert('OK');
			    },
			    complete: function()
			    {
			    	var now = new Date();
			    	var duration = now - time;
			    	
			    	calcTime('loadView: "' + localURL + '" from ajax, Duration: ' + duration + ' ms');
			    },
			    error: function ()
			    {
			    	var now = new Date();
			    	var duration = now - time;
			    	
			    	calcTime('loadView: "' + localURL + '" failed, Duration: ' + duration + ' ms');
			    }
			});
		}
		else
		{
			$('body').empty();
			$('body').append(Storage);
			
			var now = new Date();
			var duration = now - time;
			    	
			calcTime('loadView: "' + localURL + '" from localStorage, Duration: ' + duration + ' ms');
		}
	}
<<<<<<< HEAD
}
=======
}
>>>>>>> update
