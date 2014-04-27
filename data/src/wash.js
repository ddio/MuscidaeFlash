#!/usr/bin/nodejs

'use strict';

if( process.argv.length <= 2 ) {
	process.stderr.write( "Usage: " + process.argv[0] + " <in file1> <in file2>.. \n");
}

var fs = require('fs'),
	orgMap = {};

process.argv.slice( 2 ).forEach( function( val ) {

	var data = fs.readFileSync( val + '.csv', 'utf8' );

	data.split( "\n" ).slice( 1 ).forEach( function( line ) {

		var data = line.split( ',' );

		if( data.length == 3 ) {

			var name = data[0],
				city = data[2].slice( 0, 3 );

			if( !( city in orgMap ) ) {
				orgMap[ city ] = [];
			}

			orgMap[ city ].push( name );
		}
	});
});

fs.writeFile( 'map.all.json', JSON.stringify( orgMap ) );

for( var city in orgMap ) {
	fs.writeFile( 'map.' + city + '.json', JSON.stringify( orgMap[city] ) );
}



