'use strict'

var ST_URL = 'https://script.google.com/macros/s/AKfycbwFse-INUkS6qvZ2waHiBYe_skn1CBp8TqPPK1C9ksvYfwJyAIW/exec',
	MAX_N_HOSPITAL = 50;

//ST_URL = 'data/tmp.json';

function ViewModel() {

	this.geoMap = {};
	this.hospitals = ko.observable([]);
	this.topFly = ko.computed( function() {
		if( this.hospitals().length > 0 ) {
			return this.hospitals()[0];
		}
		return { hospital: '' };
	}, this);
	this.totalComments = ko.observable(0);

	this.map = new google.maps.Map( document.getElementById( 'map-canvas' ) );
	this.markers = [];
	this.mapBoundry = null;

	this.viewTop = function() {
		if( this.markers.length > 0 ) {
			this.map.setCenter( this.markers[0].getPosition() );
			return true;
		}
	}

	this.viewAll = function() {
		if( this.mapBoundry ) {
			this.map.fitBounds( this.mapBoundry );
			return true;
		}
	}

	$.ajax( ST_URL, {
		dataType: 'json',
		context: this
	})
	.done( function( resp ) {

		this.geoMap = resp.map;

		var dict = resp.map.hospitals,
			newHospitals = _.clone( resp.map.locations ),
			totalComments = 0;

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
			totalComments += hospital.comments.length;

		}, this);

		newHospitals = _.filter( newHospitals, function( hospital ) {
			return hospital.comments.length > 0;
		});

		this.hospitals(
			_.sortBy( newHospitals, function( hospital ) { 
				return hospital.comments.length * -1; 
			}));

		this.totalComments( totalComments );

		this.initMap();
	});

}

ViewModel.prototype.initMap = function() {

	var targetItems = this.hospitals().slice( 0, MAX_N_HOSPITAL ),
		iconSizes = [ 100, 70, 50, 30 ],
		boundry = new google.maps.LatLngBounds();

	_.each( targetItems, function( item, i ) {

		var iconSize = iconSizes[i];

		if( i >= iconSizes.length ) {
			iconSize = _.last( iconSizes );
		}

		var position = new google.maps.LatLng( item.lat, item.lng ),
			marker = new google.maps.Marker({
				title: item.hospital,
				position: position,
				map: this.map,
				icon: 'images/marker.'+iconSize+'.png'
			});

		this.markers.push( marker );

		boundry.extend( position );

		if( i == 0 ) {
			marker.setAnimation(google.maps.Animation.BOUNCE);
		}

		//TODO: add click event
	}, this);

	this.map.fitBounds( boundry );
	this.mapBoundry = boundry;
}

$( function() {

	var vm = new ViewModel();

	ko.applyBindings( vm );
});
