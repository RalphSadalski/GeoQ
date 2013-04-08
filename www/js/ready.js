var starttime 	= 0;
var logging	= new Array();
// Wait for Cordova to load
//
function init()
{
	starttime = new Date();
	calcTime('onInit');
	
	document.addEventListener("deviceready", onDeviceReady, false);
}

// Cordova is ready
//
function onDeviceReady()
{
	calcTime('onDeviceReady');
	//localStorage Variablen erstellen
	if(localStorage.setItem('deviceName',"") == null)
	{
		localStorage.setItem('deviceName',"");
	}
	if(localStorage.setItem('deviceCordova',"") == null)
	{
		localStorage.setItem('deviceCordova',"");
	}
	if(localStorage.setItem('devicePlatform',"") == null)
	{
		localStorage.setItem('devicePlatform',"");
	}
	if(localStorage.setItem('deviceUUID',"") == null)
	{
		localStorage.setItem('deviceUUID',"");
	}
	if(localStorage.setItem('deviceModel',"") == null)
	{
		localStorage.setItem('deviceModel',"");
	}
	if(localStorage.setItem('deviceVersion',"") == null)
	{
		localStorage.setItem('deviceVersion',"");
	}
	if(localStorage.setItem('game_tb',"") == null)
	{
		localStorage.setItem('game_tb',"");
	}
	if(localStorage.setItem('process_tb',"") == null)
	{
		localStorage.setItem('process_tb',"");
	}
	if(localStorage.setItem('user_tb',"") == null)
	{
		localStorage.setItem('user_tb',"");
	}
	if(localStorage.setItem('userID',"") == null)
	{
		localStorage.setItem('userID',"");
	}
	//
	status();
	//localStorage Variablen füllen
	localStorage.setItem('deviceName',device.name);
	localStorage.setItem('deviceCordova',device.cordova);
	localStorage.setItem('devicePlatform',device.platform);
	localStorage.setItem('deviceUUID',device.uuid);
	localStorage.setItem('deviceModel',device.model);
	localStorage.setItem('deviceVersion',device.version);
}

function calcTime(msg)
{
	var now = new Date();
	
	var d = (now - starttime) / 1000;
	
	console.log(d + ' - ' + msg);
	
	var log = {'time' : d, 'msg' : msg};
	
	logging.push(log);
}
