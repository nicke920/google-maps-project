$(function() {
	      var map;
	      function initMap() {
	        map = new google.maps.Map(document.getElementById('map'), {
	          center: {lat: 40.719526, lng: -74.0089934},
	          zoom: 8
	        });

		var markers = [];

		var eachinfoWindow = new google.maps.InfoWindow();


		var bounds = new google.maps.LatLngBounds();

		var locations = [
		          {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
		          {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
		          {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
		          {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
		          {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
		          {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
		        ];

		$.each(locations, function(i, location) {
			var title = location.title;
			var position = location.location;

			var marker = new google.maps.Marker({
				position: position, 
				map: map, 
				title: title,
				animation: google.maps.Animation.DROP,
				id: i
			})

			markers.push(marker)

			//extends the boundries of the map to fit each marker
			bounds.extend(marker.position);


			marker.addListener('click', function() {
				//'this' means the marker that was clicked
				nicksfunction(this, eachinfoWindow)
			});
		})
		map.fitBounds(bounds);

		function nicksfunction(marker, infowindow) {
			if (infowindow.marker != marker) {
				infowindow.marker = marker;
				infowindow.setContent('<div>' + marker.title + '</div>');
				infowindow.open(map, marker);

				infowindow.addListener('closeclick', function() {
					infowindow.setMarker(null);
				})
			}
		}

	}
})