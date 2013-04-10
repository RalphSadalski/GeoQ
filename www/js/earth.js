var map = {	
	leftLongitude 		: null,
	rightLongitude 		: null,
	topLatitude 		: null,
	bottomLatitude 		: null,
	
	mapWidth			: null,
	mapHeight			: null,
	
	maps				: new Array('map/-90_90_-72_72.jpg'),
	
	loadMap: function ()
	{
		$('body').append('<canvas id="visir" class="visir" width="500" height="500" style="display:none;"></canvas>');
		$('body').append('<div id="flag"><icon>2</icon></div><div id="userflag" style="display:none"><icon>2</icon></div>');
		$('body').append('<div id="questionBox"></div>');
		$('body').append('<div id="gameNav"><button id="BackToGameView"><icon>T</icon><div>Back</div></button><button id="showAnswer"><icon>u</icon><div>Show Answer</div></button><button id="NextQuestion"><icon>H</icon><div>Next</div></button></div>');
		$('body').append('<div id="map" class="worldmap"></div>');
		
		$('#map').prepend('<img id="worldmap" class="worldmap" style="display:none" src="' + this.maps[0] + '" />');
		
		this.positionWorldMap();
		
		this.getMapBounds();
	},
	
	showMap : function ()
	{
		$('#worldmap').show();
		window.scrollTo(1700,900);//Italien
	},
	
	hideMap : function ()
	{
		$('#worldmap').hide();
	},
	
	showFlag: function (LAT, LON)
	{
		$('#flag').show();
		
		var Pos = this.convertGeoToPixel(LAT,LON);
		
		var Res = this.getWindowResolution();
		
		var marginLeft = $('#worldmap').css('margin-left');
		
		var x	= Pos[0] + Res[0] / 2;
		
		var marginTop = $('#worldmap').css('margin-top');
		
		var y	= Pos[1] + Res[1] / 2;
		
		$('#flag').css("left", x);
		$('#flag').css("top", y);
		
		var d = this.calculationDistance(LAT,LON);
		
		$('#questionBox').html('');
		$('#questionBox').html('Missed ' + d + ' km!');
	},
	
	showFlagUser : function ()
	{
		var map = this.getScrollXY();
		
		var mapMargin = this.getWindowResolution();
		
		$('#userflag').show();
		$('#userflag').css('left', map[0] + mapMargin[0] / 2 + 'Px');
		$('#userflag').css('top', map[1] +  mapMargin[1] / 2 + 'Px');
	},
	
	hideFlag: function ()
	{
		$('#flag').hide();
		$('#userflag').hide();
	},
	     
	showFokus : function ()
	{
		var res 	= this.getWindowResolution();
		var winH 	= res[1];
		var winW	= res[0];
	
		var canvas 	= document.getElementById('visir');
		
		$('#visir').show();
	
		canvas.width = winW;
		canvas.height = winH;
	
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
	},
	
	hideFokus : function ()
	{
		$('#visir').hide();
	},
	
	convertGeoToPixel : function (LAT, LON)//Diese MotherFucking Funktion hat mich 3 Stunden meines kostbaren Lebens gekostet
	{
		var display 		= this.setWidthHeight();
		
		var delta 			= (this.rightLongitude - this.leftLongitude);
		
		var x				= display[0] * ( (LON - this.leftLongitude) / delta );
		
		var lat 			= LAT * Math.PI / 180;
	
    	var worldMapWidth 	= ((display[0] / delta) * 360) / (2 * Math.PI);
	
		var oben = (1 + Math.sin(this.bottomLatitude * Math.PI / 180));
	
		var unten = (1 - Math.sin(this.bottomLatitude * Math.PI / 180));
	
		var logo = Math.log(oben / unten);
	
    	var mapOffsetY = (worldMapWidth / 2 * logo);
	
		var obenb = (1 + Math.sin(lat));
	
		var untenb = (1 - Math.sin(lat));
	
		var logb = Math.log(obenb / untenb);	
	
    	var y = display[1] - ((worldMapWidth / 2 * logb) - mapOffsetY);
		
		var array = new Array();
		array.push(x);
		array.push(y);
		
		return array;
	},
	
	positionWorldMap: function ()
	{
		var res = this.getWindowResolution();

		$('#worldmap').css('margin-top',Math.round(res[1]/2) + "px");
		$('#worldmap').css('margin-left',Math.round(res[0]/2) + "px");
		$('#worldmap').css('padding-bottom',Math.round(res[1]/2) + "px");
		$('#worldmap').css('padding-right',Math.round(res[0]/2) + "px");
	},
	
	getMapBounds: function ()
	{
		var map = this.maps[0];
		
		var firstSplit = map.split('/');
		
		var secondSplit = firstSplit[1].split('.');
		
		var coordinates = secondSplit[0].split('_');
		
		this.leftLongitude  	= Number(coordinates[0]);
		this.rightLongitude 	= Number(coordinates[1]);
		this.topLatitude 		= Number(coordinates[3]);
		this.bottomLatitude		= Number(coordinates[2]);
	},
	
	setWidthHeight: function ()
	{
		var img = $('#worldmap');
		
		var array = new Array();
		array.push(img.width());
		array.push(img.height());
		
		return array;
	},
	
	getWindowResolution: function ()
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
	},
	
	calculationDistance : function (pointLAT, pointLON)
	{
		var mapdim		= this.setWidthHeight();
	
		scrollXY        = this.getScrollXY();
	
		mapX            = scrollXY[0];
		mapY            = scrollXY[1];
	
		mapW            = mapdim[0];
		mapH            = mapdim[1];
		
		mapDelta		= (newMap.rightLongitude - newMap.leftLongitude);		//Grad
	
		mapLO          = (mapX / mapW) * (mapDelta) + newMap.leftLongitude;
	
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
	},
	
	getScrollXY : function () 
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
}