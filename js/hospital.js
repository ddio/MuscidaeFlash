'use strict'

var ST_URL = 'https://script.google.com/macros/s/AKfycbwFse-INUkS6qvZ2waHiBYe_skn1CBp8TqPPK1C9ksvYfwJyAIW/exec';

function ViewModel() {

	this.hospital = $('#hospital-id').text();
	this.comments = ko.observable([]);

	$.ajax( ST_URL, {
		dataType: 'json',
		context: this
	})
	.done( function( resp ) {

		var target = _.find( resp, function( hospital ) {
			return (hospital.city + hospital.name) == this.hospital;
		}, this);

		if( target ) {
			this.comments( target.comments );
		};
	});
}

$( function() {

	var vm = new ViewModel();

	ko.applyBindings( vm );
});
