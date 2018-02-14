const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
var config = require('./config');
var responses = {};
responses.generateResponse(req, res){
	console.log('Process request started');
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
}

function inputPrompts(req, res){
	return new Promise(function(resolve, reject){		
		if(typeof(incidentParams['category'])=='undefined'){
			resolve(suggestionChips(config.serviceNow['category'],'category'))
		}else if(typeof(incidentParams['subCategory'])=='undefined'){
			resolve(suggestionChips(config.serviceNow['subCategory'],'subCategory'));
		}else if(typeof(incidentParams['contactType'])=='undefined'){
			resolve(suggestionChips(config.serviceNow['contactType'],'contactType'));
		}else if(typeof(incidentParams['impact'])=='undefined'){
			resolve(suggestionChips(config.serviceNow['impact'],'impact'));
		}else if(typeof(incidentParams['urgency'])=='undefined'){
			resolve(suggestionChips(config.serviceNow['urgency'],'urgency'));
		}
	});	
}

		

suggestionChips  = function(content, contentType){	
	const App = new ActionsSdkApp({request, response});
	  App.ask(App.buildRichResponse()
		.addSimpleResponse({speech: 'Please select option from '+contentType,
		  displayText: 'Please select option from '+contentType})
		.addSuggestions(content)			
	  );		
	return true;
}

responses.generateQuickReplyResponseOld = function(responseContent, responseViewModel){
}
module.exports = responses;