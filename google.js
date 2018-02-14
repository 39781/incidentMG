const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
var config = require('./config');
var responses = {};

responses.generateResponse = function(req, res){
		
	return new Promise(function(resolve, reject){		
		console.log('generate response started');
		
		let action = req.body.result.action; // https://dialogflow.com/docs/actions-and-parameters			
		let inputContexts = req.body.result.contexts; // https://dialogflow.com/docs/contexts	
		var sessionId = (req.body.sessionId)?req.body.sessionId:'';
		
		var params = Object.keys(req.body.result.parameters);
		
		params.forEach(function(key){
			if(req.body.result.parameters[key].length>0){
				incidentParams[key] = req.body.result.parameters[key];
			}
		});	
		
		var incidentParamsKeys = Object.keys(incidentParams);
		if(incidentParamsKeys.length>=5){
			resolve(true);
		}else{
			inputPrompts(req, res)	
			.then((result)=>{
				resolve(true);
			})
			.catch((err)=>{
				reject(err);
			});
		}		
	});
}
suggestionChips  = function(appHandler, req, res, content, contentType){
	console.log(content, contentType);
	  appHandler.ask(appHandler.buildRichResponse()
		.addSimpleResponse({speech: 'Please select option from '+contentType,
		  displayText: 'Please select option from '+contentType})
		.addSuggestions(content)			
	  );		
	return true;
}

function inputPrompts(req, res){
	
	return new Promise(function(resolve, reject){	
		
		appHandler	= new ActionsSdkApp({request: req, response: res});
		
		let actionMap = new Map();	
		actionMap.set('defaultIntent', suggestionChips);
		actionMap.set('createIncident', suggestionChips);	
		
		appHandler.handleRequest(actionMap);
		
		console.log('input prompting started');
		if(typeof(incidentParams['category'])=='undefined'){
			resolve(suggestionChips(appHandler,req, res, config.serviceNow['category'],'category'))
		}else if(typeof(incidentParams['subCategory'])=='undefined'){
			resolve(suggestionChips(appHandler,req, res, config.serviceNow['subCategory'],'subCategory'));
		}else if(typeof(incidentParams['contactType'])=='undefined'){
			resolve(suggestionChips(appHandler,req, res, config.serviceNow['contactType'],'contactType'));
		}else if(typeof(incidentParams['impact'])=='undefined'){
			resolve(suggestionChips(appHandler,req, res, config.serviceNow['impact'],'impact'));
		}else if(typeof(incidentParams['urgency'])=='undefined'){
			resolve(suggestionChips(appHandler, req, res, config.serviceNow['urgency'],'urgency'));
		}
	});	
}

		



responses.generateQuickReplyResponseOld = function(responseContent, responseViewModel){
}
module.exports = responses;