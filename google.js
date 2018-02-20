const ActionsSdkApp = require('actions-on-google').DialogflowApp;
var config = require('./config');
var responses = {};

suggestionChips  = function(appHandler, sessionId, content, params){
	console.log(content,incidentParams[sessionId]['recentInput']);
	  /*appHandler.ask(appHandler.buildRichResponse()
		.addSimpleResponse({speech: 'Please select option from '+contentType,
		  displayText: 'Please select option from '+contentType})
		.addSuggestions(content)			
	  );*/	
	  //return true;
	  var chips = [];		
		content.forEach(function(key){
			chips.push({'title':key});
		});
		/*intentContextParams ={};
		var paramsKeys = Object.keys(params);		
		paramsKeys.forEach(function(key){
			if(params[key].length>0){
				intentContextParams[key] = params[key];
			}
		});	*/				
		return {			
			"speech": "",
			"contextOut": [{
				 "name":"e0e440c1-adc7-4b94-b9cb-a22a5629d79d_id_dialog_context", 
				 "lifespan":2, 
				 "parameters":params
			}],
			"messages": [{
				"type": "simple_response",
				"platform": "google",
				"textToSpeech": "Please select option from "+incidentParams[sessionId]['recentInput'],
				"displayText": "Please select option from "+incidentParams[sessionId]['recentInput']
			},
			{
			  "type": "suggestion_chips",
			  "platform": "google",
			  "suggestions":chips
			},
			{
			  "type": 0,
			  "speech": ""
			}
			]
		};
	  //console.log('hari');
	//return true;
}

responses.inputPrompts = function(sessionId,  req, res){
	
	return new Promise(function(resolve, reject){	
		
		appHandler	= new ActionsSdkApp({request: req, response: res});
		try{
			/*let actionMap = new Map();	
			actionMap.set('createIncident', suggestionChips);
			actionMap.set('defaultIntent', suggestionChips);
			actionMap.set(appHandler.StandardIntents.TEXT, suggestionChips)
			//actionMap.set(actions.intent.TEXT)
			//actionMap.set('createIncident', suggestionChips);	
			
			appHandler.handleRequest(actionMap);*/
			
			console.log('input prompting started');
			if(req.body.result.parameters[incidentParams[sessionId]['recentInput']].length<=0){				
				resolve(suggestionChips(appHandler, sessionId, config.serviceNow[incidentParams[sessionId]['recentInput']], req.body.result.parameters));
			}else{
				resolve(true);
			}
		}catch(err){console.log('error',err);reject(err);}	
		
	});	
}
responses.getFinalCardResponse = function(textMsg, callBackIntent, params){
	return new Promise(function(resolve, reject){
		var data = textMsg.split(';');
		var rsp = {
			"speech":"",
			"data":{
			  "google": {
					"expect_user_response": true,
					  "rich_response": {
					  "items": [{
						  "basicCard": {
							"title":data[0],
							"formattedText":"please Note for future reference Thank you for using me, I can help you please choose any one option",
							"subtitle":data[1],
							"image": {
							  "url":"",
							  "accessibilityText":"serviceNow"
							},
							"buttons": [
							  {
								"title":"ServiceNow",
								"openUrlAction":{
								  "url":"dev18442.service-now.com"
								}
							  }
							]
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

		/*var rsp ={
			"speech": "",
			"messages": [{
				"type": "basic_card",
				"platform": "google",
				"title": data[0],
				"subtitle": data[1],
				"formattedText": "please Note for future reference Thank you for using me, I can help you please choose any one option",
				"buttons": []
			},
			{
			  "type": "suggestion_chips",
			  "platform": "google",
			  "suggestions": [
				{
				  "title": "Create Incident"
				},
				{
				  "title": "Track Incident"
				}
			  ]
			},
			{
			  "type": 0,
			  "speech": ""
			}]
		};*/
		if(callBackIntent){
			rsp.followupEvent ={
				name:callBackIntent,
				data:params,
			}
		}			
		resolve(rsp);
	});
}
		
responses.getFinalSimpleResponse = function(txtMsg, callBackIntent, params){
	return new Promise(function(resolve, reject){		
		var rsp ={			
				"speech": "",					
				"messages": [{
					"type": "simple_response",
					"platform": "google",						
					displayText :txtMsg+" Thank you for using me, I can help you please choose any one option",
					textToSpeech :txtMsg
				},
				{
				  "type": "suggestion_chips",
				  "platform": "google",
				  "suggestions":[{title:"Create Incident"},
								 {title:"Track Incident"}
								]
				},{
				  "type": 0,
				  "speech": ""
				}]
			};
		if(callBackIntent){
			rsp.followupEvent ={
				name:callBackIntent,
				data:params,
			}
		}			
		resolve(rsp);
	});
}


responses.generateQuickReplyResponseOld = function(responseContent, responseViewModel){
}
module.exports = responses;