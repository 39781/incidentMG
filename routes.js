var express 		= require('express');
var router			= express.Router();	 
var DialogflowApp	=	require('actions-on-google').DialogflowApp;

var serviceNowApi 	=	require('./serviceNow');
var sNow 			= 	require('./config');

var botResponses = require('./google.js');
router.get('/',function(req, res){
	console.log('req received');
	res.send("req received");
	res.end();
})

router.post('/botHandler',function(req, res){
	//console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
	console.log('Dialogflow Request body: ' + JSON.stringify(req.body));	
	var rsp = {
			"speech":"",
			"data":{
  "google": {
  "expect_user_response": true,
  "rich_response": {
  "items": [
    {
      "simpleResponse": {
          "textToSpeech":"This is the first simple response for a basic card"
      }
    },
    {
      "basicCard": {
        "title":"Title: this is a title",
        "formattedText":"This is a basic card.  Text in a\n      basic card can include \"quotes\" and most other unicode characters\n      including emoji 📱.  Basic cards also support some markdown\n      formatting like *emphasis* or _italics_, **strong** or __bold__,\n      and ***bold itallic*** or ___strong emphasis___ as well as other things\n      like line  \nbreaks",
        "subtitle":
        "This is a subtitle",
        "image": {
          "url":"https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
          "accessibilityText":"Image alternate text"
        },
        "buttons": [
          {
            "title":"This is a button",
            "openUrlAction":{
              "url":"https://assistant.google.com/"
            }
          }
        ]
      }
    },
    {
      "simpleResponse": {
        "textToSpeech":"This is the 2nd simple response ",
        "displayText":"This is the 2nd simple response"
      }
    }
  ],
  "suggestions":
  [
    {"title":"Create Incident"},
    {"title":"Track Incident"}    
  ]
}
}
}		
		};
		res.json(rsp).end();
	/*if (req.body.result||req.body.queryResult) {		
		processRequest(req, res)
		.then(function(responseJson){			
			res.status(200);
			if(typeof(responseJson)=='object'){
				console.log('responseJSON',JSON.stringify(responseJson));								
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
	}*/
});


processRequest = function(req, res){
	return new Promise(function(resolve, reject){		
		console.log(' process request started');		
		
		generateResponse(req, res)
		.then(function(responseJson){				
			resolve(responseJson);
		})
		.catch(function(err){
			console.log(err);
			reject(err);
		})	
		
			
	});
}

generateResponse = function(req, res){		
	return new Promise(function(resolve, reject){		
		console.log('generate response started',req.body.result.parameters);
		let requestSource = (req.body.originalRequest) ? req.body.originalRequest.source : undefined;	
		console.log(requestSource);
		let action = req.body.result.action; // https://dialogflow.com/docs/actions-and-parameters			
		let inputContexts = req.body.result.contexts; // https://dialogflow.com/docs/contexts	
		var sessionId = (req.body.sessionId)?req.body.sessionId:'';
		var resolvedQuery = req.body.result.resolvedQuery;	
		var botResponses = require('./'+requestSource);		
		
		if(action == 'trackIncident'){
			serviceNowApi.trackIncident(req.body.result.parameters)
			.then((result)=>{
				if(typeof(result)=='object'){	
					return botResponses.getFinalCardResponse(result.msg,'trackIncident',result.params);
				}else{
					return botResponses.getFinalCardResponse(result,null,null);
				}
			})
			.then((resp)=>{
				resolve(resp);
			})	
			.catch((err)=>{
				resolve(botResponses.getFinalCardResponse(err,null,null));				
			})
		}else{		
			if(typeof(incidentParams[sessionId]) == 'undefined'){
				incidentParams[sessionId] = {};
			}
			
			if(typeof(incidentParams[sessionId]['recentInput'])!='undefined'){
				req.body.result.parameters[incidentParams[sessionId]['recentInput']] = resolvedQuery;
			}
			console.log('after recentinput',req.body.result.parameters);
			var params = Object.keys(req.body.result.parameters);		
					
			for(i=0;i<params.length;i++){
				if(req.body.result.parameters[params[i]].length<=0){
					incidentParams[sessionId]['recentInput'] = 	params[i];
					break;
				}else{
					delete incidentParams[sessionId]['recentInput'];
				}				
			}
			/*params.forEach(function(key){
				if(req.body.result.parameters[key].length>0){
					incidentParams[sessionId][key] = req.body.result.parameters[key];
				}
			});*/	
			
			
			console.log(incidentParams);
			var incidentParamsKeys = Object.keys(incidentParams[sessionId]);
			if(typeof(incidentParams[sessionId]['recentInput'])=='undefined'){
				serviceNowApi.createIncident(req.body.result.parameters)
				.then((result)=>{
					console.log(result);
					return botResponses.getFinalCardResponse(result,null,null);
				})
				.then((resp)=>{
					resolve(resp);
				})				
				.catch((err)=>{
					resolve(botResponses.getFinalCardResponse(err,null,null));					
				})
			}else{
				botResponses.inputPrompts(sessionId,  req, res)	
				.then((result)=>{
					console.log('response from inputpromt',result);
					resolve(result);
				})				
				.catch((err)=>{
					resolve(botResponses.getFinalCardResponse(err,null,null));
				});
			}	
		}		
	});
}

module.exports = router;



			