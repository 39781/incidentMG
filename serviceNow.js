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
				var txtMsg;			
				if (error) {
					if(typeof(error)=='object'){
						txtMsg = JSON.stringify(error);								
					}else{
						txtMsg = error;
					}	
						resolve(txtMsg);
				}else{					
					if(body.error){
						txtMsg = "Error in incident creation";						
					}else{						
						txtMsg = "Incident Created Ur Incident Number "+body.result.number+" please Note for future reference";
					}					
					resolve(txtMsg);
				}												
			});
		})
	},
	trackIncident:function (params){
		return new Promise(function(resolve,reject){
			console.log('tracking started');		
			var txtMsg = "";
			var fstr = params.incidentNum.substring(0,3);
			var sstr = params.incidentNum.substring(3);			
			console.log(fstr == 'inc'&&!isNaN(sstr));
			if((fstr == 'inc'||fstr=='INC')&&!isNaN(sstr)){
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
					if (error) {						
						if(typeof(error)=='object'){
							txtMsg = JSON.stringify(error);								
						}else{
							txtMsg = error;
						}	
						resolve(txtMsg);			
					}else{
						if(body.error){
							txtMsg = "no record found for incident number you entered";							
						}else{							
							txtMsg = "Incident number "+body.result[0].number+",\n"+params.queryParam+" : "+body.result[0][params.queryParam];
						}								
						resolve(txtMsg);		
					}
				});
				//delete incidentTickets[sessId];
			}else{		
				txtMsg = "Please enter valid incident number";
				resolve({msg:txtMsg,"params":params});
			}
			
		});
	}
}


module.exports = serviceNowApi;