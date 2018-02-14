var express 		= require('express');
var router			= express.Router();	 
var DialogflowApp	=	require('actions-on-google').DialogflowApp;
var request			=	require('request');
var serviceNowApi 	=	require('./serviceNow');
var sNow 	= 	require('./config');

router.get('/',function(req, res){
	console.log('req received');
	res.send("req received");
	res.end();
})

router.post('/botHandler',function(req, res){
	//console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
	console.log('Dialogflow Request body: ' + JSON.stringify(req.body));		
	res.status(200);	
			
	if (req.body.result||req.body.queryResult) {
		processRequest(req, res)
		.then(function(responseJson){
			console.log(JSON.stringify(responseJson));
				res.status(200);
			res.json(responseJson).end();
		})
		.catch(function(err){
			res.status(400);
			res.json(err).end();
		})	
	} else {
		console.log('Invalid Request');
		return response.status(400).end('Invalid Webhook Request');
	}
});


processRequest = function(req, res){
	return new Promise(function(resolve, reject){		
		
		let requestSource = (req.body.originalRequest) ? req.body.originalRequest.source : undefined;	
		
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


module.exports = router;



			