var viewManager = {
	initialize: function ()
	{
		
	},
	
	ListView : function ()
	{
		this.loadView('ListView.html');
	},
	
	loadView : function (localURL)
	{
		var URL = "views/" + localURL;
		var time = 0;
		
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
		        $(body).empty();
		        $(body).append(view);
		    },
		    complete: function()
		    {
		    	var now = new Date();
		    	var duration = now - time;
		    	
		    	calcTime('loadView: "' + localURL + '", Duration: ' + duration + ' ms');
		    },
		    error: function ()
		    {
		    	var now = new Date();
		    	var duration = now - time;
		    	
		    	calcTime('loadView: "' + localURL + '" failed, Duration: ' + duration + ' ms');
		    }
		});
	}
}
