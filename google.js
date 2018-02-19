const ActionsSdkApp = require('actions-on-google').DialogflowApp;
var config = require('./config');
var responses = {};

responses.generateResponse = function(req, res){		
	return new Promise(function(resolve, reject){		
		console.log('generate response started',req.body.result.parameters);
		
		let action = req.body.result.action; // https://dialogflow.com/docs/actions-and-parameters			
		let inputContexts = req.body.result.contexts; // https://dialogflow.com/docs/contexts	
		var sessionId = (req.body.sessionId)?req.body.sessionId:'';
		var resolvedQuery = req.body.result.resolvedQuery;				
		
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
			resolve('create');
		}else{
			inputPrompts(sessionId,  req, res)	
			.then((result)=>{
				console.log('response from inputpromt',result);
				resolve(result);
			})
			.catch((err)=>{
				reject(err);
			});
		}		
	});
}
suggestionChips  = function(appHandler, sessionId, content, contentType, params){
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

function inputPrompts(sessionId,  req, res){
	
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

		



responses.generateQuickReplyResponseOld = function(responseContent, responseViewModel){
}
module.exports = responses;