let express = require('express');
let router = express.Router();
var WPAPI = require( 'wpapi' );
var mysql = require('mysql');
var wordpress = require( "wordpress" );
var request = require('request');
var timer = null;

var resultCount = process.env.record || 0;
const dbSource = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "",
				database: 'cli_app'
			  });

const dbTransfered = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "",
				database: 'cli_test'
			  });


const getWPPost = function(req, res){
	
	timer = setInterval(transfer, 1000);
	
	 
   };

const transfer = function(req, res){
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
    request(options, function (error, response, body) {
		
		var result = JSON.parse(body);
        if (!error && response.statusCode == 200) {
			
			if(result>0){
          
			var data = [result[0].id, result[0].title.rendered, result[0].content.rendered, result[0].status];

			var queryIns = "INSERT INTO posts (post_id, post_title, post_content, post_status) VALUES (?, ?, ?, ?)";

			dbTransfered.query(queryIns, data, function(errno, resultTransfer){
				if(errno)
					console.log(errno);
				else
					console.log({Status: "Success", PostID: count});
			});

			}
			else{
				console.log({Last_Record: "TRUE"});
				clearInterval(timer);
			}
           
        } else {
             console.log(error);
        }
	 });
}



// const transfer = function(req, res){
// 	var query = `SELECT * from wp_posts limit ${resultCount++} , 1`;
	
// 	dbSource.query(query, function(err, results, fields){
// 		console.log(query);
// 		if(err)
// 			console.log(err);

// 		if(results.length > 0){
// 			var result = JSON.stringify(results);
// 			result = JSON.parse(result);

// 			var data = [result[0].ID, result[0].post_title, result[0].post_content, result[0].post_status];

// 			var queryIns = "INSERT INTO posts (post_id, post_title, post_content, post_status) VALUES (?, ?, ?, ?)";

// 			dbTransfered.query(queryIns, data, function(errno, resultTransfer){
// 				if(errno)
// 					console.log(errno);
// 				else
// 					console.log({Status: "Success", PostID: result[0].ID});
// 			});
// 		}else{
// 			console.log({Last_Record: "TRUE", Last_ID: --resultCount});
// 			clearInterval(timer);
// 		}
// 	});
//  }

router.get('/', (req, res) => {
	getWPPost(req, res);
});

 module.exports = router;