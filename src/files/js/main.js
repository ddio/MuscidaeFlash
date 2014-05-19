'use strict'

var ST_URL = 'https://script.google.com/macros/s/AKfycbwFse-INUkS6qvZ2waHiBYe_skn1CBp8TqPPK1C9ksvYfwJyAIW/exec',
	MAX_N_HOSPITAL = 50;

function ViewModel() {

	this.geoMap = {};
	this.hospitals = ko.observable([]);
	this.topFly = ko.computed( function() {
		if( this.hospitals().length > 0 ) {
			return this.hospitals()[0];
		}
		return { name: '' };
	}, this);
	this.totalComments = ko.observable(0);

	this.map = new google.maps.Map( document.getElementById( 'map-canvas' ), { zoom: 9 } );
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

		this.hospitals(
			_.sortBy( resp, function( hospital ) { 
				return hospital.comments.length * -1; 
			}));

		this.totalComments(
			_.reduce( resp, function( memo, hospital ) {
				return memo + hospital.comments.length
			}, 0));

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
				title: item.name,
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

	this.mapBoundry = boundry;

	if( this.markers.length == 1 ) {
		this.viewTop();
	} else {
		this.viewAll();
	}
}

$( function() {

	var vm = new ViewModel();

	ko.applyBindings( vm );
});
