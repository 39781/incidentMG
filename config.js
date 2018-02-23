var config ={
	
	serviceNow : {		
		category 		: ['inquiry/Help','Software','Hardware','Network','Database'],
		subCategory		: ['Antivirus','Email','Internal Application'],
		contactType 	: ['Email','Phone','Self-service','Walk-in'],		
		impact 			: ['High','Medium','Low'],
		urgency 		: ['High','Medium','Low'],
		queryParam			:  ["state","incident state","urgency","impact","caller","contact type"]		
	},	
}
module.exports = config;