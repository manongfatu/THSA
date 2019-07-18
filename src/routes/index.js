let express = require('express');
let router = express.Router();
var WPAPI = require( 'wpapi' );
var mysql = require('mysql');
var wordpress = require( "wordpress" );

var getWPPost = function(req, res){
	var request = require('request');
    var headers, options;

    // Set the headers
    headers = {
        'Content-Type':'application/x-www-form-urlencoded'
    }

    // Configure the request
    options = {
        url: 'http://localhost/cli_testing/wordpress/index.php/wp-json/wp/v2/posts?per_page=100',
        method: 'GET',
        headers: headers
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
			if(body){
				console.log('Fetched data')
			}
			var con = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "",
				database: 'cli_test'
			  });
			var bodys = JSON.parse(body);
			
			con.connect(function(err) {
				if (err) throw err;
				console.log("Connected!");
				var results = [[bodys[2].title.rendered]];
			
				var sql = "INSERT INTO posts (title) VALUES ?";
				
				con.query(sql, [results], function (err, result) {
				  if (err) throw err;
				  console.log("Stored 1 data");
				});
			  });
		
        } else {
             console.log(error);
        }
     });
   };

router.get('/', (req, res) => {
	
	getWPPost(req, res);
	// var wp = new WPAPI({ endpoint: 'http://localhost/cli_testing/wordpress/?rest_route=/'});

    // wp.posts().get(function( err, data ) {
		
	//     if ( err ) {
	//     	console.log({err});
	//     }else{
	//     	console.log({ data: data.length });
    // 		res.send({ data });
	//     }
	// });
});



 module.exports = router;