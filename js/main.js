'use strict'

var ST_URL = 'https://script.google.com/macros/s/AKfycbwFse-INUkS6qvZ2waHiBYe_skn1CBp8TqPPK1C9ksvYfwJyAIW/exec',
	MAX_N_HOSPITAL = 50;

function ViewModel() {

	this.geoMap = {};
	this.hospitals = ko.observable();
	this.map = new google.maps.Map( $('#map')[0] );


	$.ajax( ST_URL, {
		cache: false,
		dataType: 'json',
		context: this
	})
	.done( function( resp ) {

		this.geoMap = resp.map;

		var dict = resp.map.hospitals,
			newHospitals = _.clone( resp.map.locations );

		_.each( newHospitals, function( hospital, id ) {
			hospital.id = id;
			hospital.comments = [];
		});

		_.each( resp.comments, function( hospital ) {
			var fullname = hospital.city + hospital.name;
			if( fullname in dict ) {
				var comments = newHospitals[ dict[fullname].id ].comments;
				comments.push.apply( comments, hospital.comments );
			}
		}, this);

		this.hospitals(
			_.sortBy( newHospitals, function( hospital ) { 
				return hospital.comments.length * -1; 
			}));

		this.initMap();
	});

}

ViewModel.prototype.initMap = function() {
}

$( function() {

	var vm = new ViewModel();

	ko.applyBindings( vm );
});
