var DialogflowApp	=	require('actions-on-google').DialogflowApp;
var request			=	require('request');
var serviceNowApi 	=	require('./serviceNow');
var sNow 	= 	require('./config');

var botHandlers = {};
//var botResponses = require('./facebook.js');
botHandlers.processRequest = function(req, res){
	return new Promise(function(resolve, reject){		
			
							
		
		var botResponses = require('./'+requestSource);
		
		botResponses.generateResponse(req, res)
		.then(function(responseJson){
			console.log(responseJson);
			if(responseJson.action == 'create')	{			
				return serviceNowApi.createIncident(responseJson.sessionId);
			}else if(responseJson.action == 'track'){
				return serviceNowApi.trackIncident(responseJson.incNum,responseJson.sessionId);
			}else{
				console.log('testing 1');
				return responseJson;
			}
			//responseJson.contextOut = inputContexts;						
		})
		.then(function(resp){
			console.log(resp);
			resolve(resp);
		})
		.catch(function(err){
			reject(err);
		})	
		
			
	});
}




module.exports = botHandlers;