let express = require('express');
let router = express.Router();
var mysql = require('mysql');
var request = require('request-promise');
var timer = null;

var resultCount = process.env.record || 1;

const transfer = async function(req, res){
	var headers, options;
	var count = resultCount++;

    // Configure the request
    options = {
		// url: 'http://uatvanillavip.wpengine.com/?rest_route=/wp/v2/users&per_page=1&offset='+count,
		url : 'https://uatvanillavip.wpengine.com/users-test/?users=subscriber&count='+count,
        method: 'GET',
        headers: {
			'Content-Type':'application/x-www-form-urlencoded'
		}
    }
	// Start the request
	try{
		let output = await request(options);
		output = output.replace(/(\r\n|\n|\r|\t|\s{2,})/gm,"");
		var jsonresult = output.replace(/.*<div class="entry-content">(.*)<\/div><!-- .entry-content -->.*/, "$1");

		var result = JSON.parse(jsonresult);
		// console.log(result);
			if(timer)
			if(result.length>0){
				const args = {
					url : 'https://thehealthsciencesacademy1562524525.api-us1.com/api/3/contacts',
					method : 'POST',
					headers : {
						'Api-Token' : '9420229f8a7362246d4d1a0cfb584dc0fb137996b708ff7ffea8b97189ab153dc224292c',
						'Content-Type' : 'application/json'
					},
					body : {
						contact: {
							email: result[0].data.user_email,
							firstName: result[0].data.display_name,
							lastName: result[0].data.display_name,
							phone: "17223224241"
						}
					},
					json : true
				};
				// console.log(args);
				let store = await request(args)
				.then(function (res) {
					// POST succeeded...
					console.log({Status: "Success", Email: res.email, Queue: count+1});
				})
				.catch(function (err) {
					// POST failed...
					console.log('Error storing to activecampaign', err);
				});
			}
			else{
				clearInterval(timer);
				console.log({Last_Record: "TRUE"});	
			}    
	}
	catch(e){
		console.log('Fetch failed.');
	}
}
timer = setTimeout(transfer, 200);
module.exports = router;