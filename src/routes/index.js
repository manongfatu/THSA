let express = require('express');
let router = express.Router();
var mysql = require('mysql');
var request = require('request-promise');
var timer = null;

var resultCount = process.env.record || 0;

const transfer = async function(req, res){
	var headers, options;
	var count = resultCount++;

    // Configure the request
    options = {
        url: 'http://uatvanillavip.wpengine.com/?rest_route=/wp/v2/users&per_page=1&offset='+count,
        method: 'GET',
        headers: {
			'Content-Type':'application/x-www-form-urlencoded'
		}
    }
	// Start the request
	try{
		let output = await request(options);
		
		var result = JSON.parse(output);
			if(timer)
			if(result.length>0){
          
				var data =[result[0].id, result[0].title.rendered, result[0].content.rendered, result[0].status];

				let store = await request({
					url : 'https://thehealthsciencesacademy1562524525.api-us1.com/api/3/contacts',
					method : 'POST',
					headers : {
						'Api-Token' : '9420229f8a7362246d4d1a0cfb584dc0fb137996b708ff7ffea8b97189ab153dc224292c',
						'Content-Type' : 'application/json'
					},
					body : {
						contact: {
							email: "johndoe@example.com",
							firstName: "John",
							lastName: "Doe",
							phone: "7223224241"
						}
					},
					json : true
				})
				.then(function (res) {
					// POST succeeded...
					console.log({Status: "Success", Email: res.email, Queue: count+1});
				})
				.catch(function (err) {
					// POST failed...
					console.log('Error storing to activecampaign');
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

timer = setInterval(transfer, 200);
module.exports = router;