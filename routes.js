var express 		= require('express');
var router			= express.Router();	 
var DialogflowApp	=	require('actions-on-google').DialogflowApp;

var serviceNowApi 	=	require('./serviceNow');
var sNow 			= 	require('./config');

//var botResponses = require('./google.js');
router.get('/',function(req, res){
	console.log('req received');
	res.send("req received");
	res.end();
})

router.post('/botHandler',function(req, res){
	//console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
	console.log('Dialogflow Request body: ' + JSON.stringify(req.body));						
	if (req.body.result||req.body.queryResult) {
		processRequest(req, res)
		.then(function(responseJson){			
			res.status(200);
			if(typeof(responseJson)=='object'){
				res.json(responseJson).end();
			}else{
				res.end();
			}
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
		console.log(' process request started');
		let requestSource = (req.body.originalRequest) ? req.body.originalRequest.source : undefined;	
		console.log(requestSource);
		var botResponses = require('./'+requestSource);		
		
		botResponses.generateResponse(req, res)
		.then(function(responseJson){			
			if(responseJson == 'create')	{			
				return serviceNowApi.createIncident(responseJson.sessionId);
			}else if(responseJson == 'track'){
				return serviceNowApi.trackIncident(responseJson.incNum,responseJson.sessionId);
			}else{				
				return responseJson;
			}
			//responseJson.contextOut = inputContexts;						
		})
		.then(function(resp){
			console.log(resp);
			resolve(resp);
		})
		.catch(function(err){
			console.log(err);
			reject(err);
		})	
		
			
	});
}


module.exports = router;



			