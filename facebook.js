var responses = {};
	if(req.body.originalRequest.data.message){
			if(req.body.originalRequest.data.message.quick_reply){
				payloadText = req.body.originalRequest.data.message.quick_reply.payload;
			}else{
				payloadText = req.body.originalRequest.data.message.text;
			}
		}else if(req.body.originalRequest.data.postback){
			payloadText = req.body.originalRequest.data.postback.payload;
		}
responses.generateResponseTemplate = function(responseContent, responseViewModel){
	return new Promise(function(resolve, reject){				
		switch(responseViewModel.toLowerCase()){
			case "quickreply": resolve({"templateGenerateFunc":responses.generateQuickReplyResponseOld,"responseContent":responseContent});break;
			case "card": resolve({"templateGenerateFunc":responses.generateCardResponse,"responseContent":responseContent});break;
		}
	});
}

responses.generateQuickReplyResponse = function(responseContent){
	return new Promise(function(resolve, reject){
		console.log('generating quick reply Started');				
		let responseTemplate = {};		
		responseTemplate.displayText = "";
		responseTemplate.speech = "";
		/*responseTemplate.followupEvent= {
			"name": //responseContent.nextIntent,
			"data": {}
		}*/	 
		responseTemplate.messages = [{
			'title': responseContent.title,
			'replies':responseContent.data,
			'type':2
		}];
		responseTemplate.source='servNow';
		resolve(responseTemplate);
	});
}

responses.generateQuickReplyResponseOld = function(responseContent, responseViewModel){
	return new Promise(function(resolve, reject){
		console.log('generating quick reply Started');				
		let responseTemplate = {};
		responseTemplate.displayText = "";
		responseTemplate.data = {
			'facebook': {
				"text": responseContent.title,
				"quick_replies": []
			}
		};	
		console.log('loop started',responseContent.title);
		responseContent.data.forEach(function(resp){			
			responseTemplate.data.facebook.quick_replies.push({			
				"content_type":"text",
				"title": resp,
				"payload": " you selected option - "+responseContent.subTitle+" - "+resp
			});			
		})				
		resolve(responseTemplate);
	});
}

responses.generateCardResponse = function(responseContent){	
	return new Promise(function(resolve, reject){
		console.log('generating card reply Started');
		let responseTemplate = {};
		responseTemplate.displayText = "";
		responseTemplate.speech = "";
		responseTemplate.data = {
			'facebook': {				
				"attachment":{
					"type":"template",
					"payload":{
						"template_type":"generic",
						"elements":[]
					}
				}
			}
		};
		if(responseContent.data.length<=2){
			responseTemplate.data.facebook.attachment.payload.elements[0]={			
								'title': responseContent.title,
								'subtitle': responseContent.subtitle,
								'image_url': responseContent.imgUrl,
								'buttons': []							
			};
			responseContent.data.forEach(function(resp){
				responseTemplate.data.facebook.attachment.payload.elements[0].buttons.push({
					"type":"postback",
					"title":resp,
					"payload":resp
				});
			});
		}else{
			responseContent.data.forEach(function(resp){		
				responseTemplate.data.facebook.attachment.payload.elements.push({					
					'title': responseContent.title,
					'subtitle': responseContent.subtitle,
					'image_url': responseContent.imgUrl,
					'buttons': [
						{
							"type":"postback",
							"title":resp,
							"payload":resp
						}									
					]
				})	
			})			
		}
		console.log(responseTemplate);
		resolve(responseTemplate);					
	});
}

function generateResponse(action, sessId, actionValue, requestSource){
	return new Promise(function(resolve, reject){
		console.log('generate Response started', action);
		var facebook = require('./'+requestSource.toLowerCase());
		
		var responseContent={
			title :"",
			subtitle:"",
			imgUrl:"http://www.cromacampus.com/wp-content/uploads/2017/05/servicenow-tool-training.png",
			data:""	
		};						
		if(/(creation|create|creat)/ig.test(action)){						
			responseContent.title = "please select caller";	
			responseContent.subTitle = 'caller';	
			responseContent.data = sNow.serviceNow.caller;				
		}else if(action == "caller"){				
			responseContent.title = "please select category";
			responseContent.subTitle = 'category';				
			responseContent.data = sNow.serviceNow.category;				
		}else if(action == "category"){					
			responseContent.title = "please select sub category"						
			responseContent.data = sNow.serviceNow.subCategory;
			responseContent.subTitle = 'subCategory';				
		}else if(action == "subCategory"){				
			responseContent.title = "please select sub contactType"						
			responseContent.data = sNow.serviceNow.contactType;
			responseContent.subTitle = 'contactType';				
		}else if(action == "contactType"){				
			responseContent.title = "please select impact"						
			responseContent.data = sNow.serviceNow.impact;
			responseContent.subTitle = 'impact';								
		}else if(action == "impact"){				
			responseContent.title = "please select urgency"						
			responseContent.data = sNow.serviceNow.urgency;
			responseContent.subTitle = 'urgency';				
		}
		if(action == "urgency"){			
			resolve({  
				"speech":"",
				"displayText":"",
				"followupEvent":{
					"name":"createIncident",
					"data":{  
																
					}
				}					
			});
			//resolve({action:"create",sessionId:sessId});
		}else if(/(track|status)/ig.test(action)){
			resolve({  
				speech:"",
				displayText:"",
				followupEvent:{
					"name":"trackIncident",
					"data":{  }
				}					
			});
		}else if(actionValue.toLowerCase().indexOf('inc')==0){
			console.log('tracking');
			resolve({action:"track",incNum:actionValue, sessionId:sessId});
		}else{
			/*if(responseContent.title.length==0){	
				responseContent.title = "Invalid Input,\nHi, I am ServiceNow, I can help u to create or track incidents. please select an option from below menu, so I can help u";	
				responseContent.subTitle = 'menu';	
				responseContent.data = sNow.serviceNow.menu;
			}*/
			console.log('hari');
			facebook.generateResponseTemplate(responseContent, 'quickreply')
			.then((resp)=>{ 
				//console.log(facebook[resp.templateGenerateFunc);
				return resp.templateGenerateFunc(resp.responseContent);
			})
			.then((resp)=>{
				resolve(resp); 
			})					
			.catch((err)=>{ reject(err) });
						
		}		
		
	});
}
module.exports = responses;