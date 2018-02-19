var request			=	require('request');
var serviceNowApi = {
	createIncident:function (incidentParams){
		//console.log('creation started',incidentTickets[sessId]);		
		return new Promise(function(resolve,reject){
			var options = { 
				method: 'POST',
				url: 'https://dev18442.service-now.com/api/now/v1/table/incident',
				headers:{ 
					'postman-token': 'd6253bf3-ff31-fb21-7741-3dd02c84e8bb',
					'cache-control': 'no-cache',
					authorization: 'Basic MzMyMzg6YWJjMTIz',
					'content-type': 'application/json' 
				},
				body:{ 
					short_description	: 	incidentParams.sdec,
					caller_id			: 	'TST',					
					urgency				: 	incidentParams.urgency,
					category			:	incidentParams.category,
					//subcategory			:	incidentParams.subCategory,
					//workingGroup		:	incidentTickets[sessId].workingGroup,
					impact				:	incidentParams.impact,					
					contact_type		:	incidentParams.contactType,
					comments			: 	'Chatbot Testing'					
				},			
				json: true 
			}; 			
			//delete incidentTickets[sessId];		
			request(options, function (error, response, body) {				
				var rsp ={			
					"speech": "",
					"messages": []
				}				
				if (error) {
					console.lg(error);
					rsp.messages.push({
						"type": "simple_response",
						"platform": "google",						
						displayText :JSON.stringify(error),
						textToSpeech :rsp.messages.displayText
					});					
				}else{
					rsp.messages.push({
						"type": "simple_response",
						"platform": "google",						
						displayText :"Incident Created Ur Incident Number "+body.result.number+" please Note for future reference",
						textToSpeech :"Incident Created Ur Incident Number "+body.result.number+" please Note for future reference",
					})					
				}
				rsp.messages.push({
					  "type": 0,
					  "speech": ""
					});
				console.log('rsp',JSON.stringify(rsp));
				resolve(rsp);
			});
			
		})
	},
	trackIncident:function (params){
		return new Promise(function(resolve,reject){
			console.log('tracking started');		
			var fstr = params.incidentNum.substring(0,3);
			var sstr = params.incidentNum.substring(3);
			var rsp ={			
					"speech": "",
					"messages": []
				}	
			console.log(fstr == 'inc'&&!isNaN(sstr));
			if(fstr == 'inc'&&!isNaN(sstr)){
				var options = { 
					method: 'GET',
					url: 'https://dev18442.service-now.com/api/now/v1/table/incident',
					qs: { 
						number: params.incidentNum.toUpperCase()
					},
					headers:{
						'postman-token': '5441f224-d11a-2f78-69cd-51e58e2fbdb6',
						'cache-control': 'no-cache',
						authorization: 'Basic MzMyMzg6YWJjMTIz' 
					},json: true  
				};
				request(options, function (error, response, body) {
					console.log(JSON.stringify(body));
					/*if (error) {
						console.lg(error);
						rsp.messages.push({
							"type": "simple_response",
							"platform": "google",						
							displayText :JSON.stringify(error),
							textToSpeech :rsp.messages.displayText
						});					
					}else{
						rsp.messages.push({
							"type": "simple_response",
							"platform": "google",						
							displayText :"Incident Created Ur Incident Number "+body.result.number+" please Note for future reference",
							textToSpeech :"Incident Created Ur Incident Number "+body.result.number+" please Note for future reference",
						})					
					}
					rsp.messages.push({
						  "type": 0,
						  "speech": ""
						});
					console.log('rsp',JSON.stringify(rsp));*/				
					resolve(true);					
				});
				//delete incidentTickets[sessId];
			}else{
				rsp ={			
					"speech": "",
					displayText:"Please enter valid incident number",	
					messages:[{
						"type": "simple_response",
						"platform": "google",						
						displayText :"Please enter valid incident number",
						textToSpeech :"Please enter valid incident number",
					},{
						  "type": 0,
						  "speech": ""
						}],
					followEvent :{
						name:"trackIncident",
						data:{},
					}	
				};
				/*rsp.messages.push({
					"type": "simple_response",
					"platform": "google",						
					displayText :"Please enter valid incident number",
					textToSpeech :"Please enter valid incident number",
				})
				rsp.	
				rsp.followEvent ={
					name:"trackIncident",
					data:{},
				}			*/		
				resolve(rsp);
			}
			
		});
	}
}


module.exports = serviceNowApi;