let express = require('express');
let router = express.Router();
var WPAPI = require( 'wpapi' );
var mysql = require('mysql');
var wordpress = require( "wordpress" );
var request = require('request-promise');
var timer;

var resultCount = process.env.record || 0;
const dbTransfered = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "",
				database: 'cli_test'
			  });

const getWPPost = async function(req, res){
	
	timer = await setInterval(transfer, 20);

}
const transfer = async function(req, res){
	var headers, options;
	var count = resultCount++;
    // Set the headers
    headers = {
        'Content-Type':'application/x-www-form-urlencoded'
    }

    // Configure the request
    options = {
        url: 'http://localhost/cli_testing/wordpress/index.php/wp-json/wp/v2/posts?per_page=1&offset='+count,
        method: 'GET',
        headers: headers
    }
	// Start the request
	try{
		let output = await request(options);
		
		var result = JSON.parse(output);
			if(timer)
			if(result.length>0){
          
			var data =[result[0].id, result[0].title.rendered, result[0].content.rendered, result[0].status];

			var queryIns = "INSERT INTO posts (post_id, post_title, post_content, post_status) VALUES (?, ?, ?, ?)";

			await dbTransfered.query(queryIns, data, function(errno, resultTransfer){
				if(errno)
					console.log(errno);
				else
					console.log({Status: "Success", PostID: result[0].id, Queue: count+1});
			});

			}
			else{
				clearInterval(timer);
				console.log({Last_Record: "TRUE"});
				
			}    
	}catch(e){
		console.log('Fetch failed.');
	}
	     
}

router.get('/', (req, res) => {
	getWPPost(req, res);
});

 module.exports = router;