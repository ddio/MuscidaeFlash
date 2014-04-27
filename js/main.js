'use strict'

var ST_URL = 'https://script.google.com/macros/s/AKfycbwFse-INUkS6qvZ2waHiBYe_skn1CBp8TqPPK1C9ksvYfwJyAIW/exec',
	HOSPITAL_ST = {};

$.ajax( stUrl, {
	cache: false,
	dataType: 'json'
})
.done( function( resp ) {
	HOSPITAL_ST = resp;
});

$( function() {

});
