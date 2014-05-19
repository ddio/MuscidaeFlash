'use strict'

var ST_URL = 'https://script.google.com/macros/s/AKfycbwFse-INUkS6qvZ2waHiBYe_skn1CBp8TqPPK1C9ksvYfwJyAIW/exec',
	SRC_DIC = 'src/documents/',
	request = require('request'),
	_ = require('underscore'),
	fs = require('fs');

request( ST_URL, function( error, resp, body ) {
	if( error || resp.statusCode != 200 ) {
		console.log( 'Get data error' );
		return;
	}

	_.each( JSON.parse( body ), function( hospital ) {

		var filePath = SRC_DIC + hospital.city + hospital.name + '.html';

		fs.exists( filePath, function( exists ) {
			if( !exists ) {
				console.log( '[CREATE] ' + hospital.city + hospital.name );
				fs.writeFile( filePath, 
					"---\n" + 
					"title: " + hospital.city + hospital.name + "\n" +
					'layout: hospital\n' +
					"---\n"
					);
			}
		});
	});

});
