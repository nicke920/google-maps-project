var markers = [];
function initMap() {
	var map;
	map = new google.maps.Map(document.getElementById('map'), {
	center: {lat: 40.719526, lng: -74.0089934},
	zoom: 8
	});

	var eachinfoWindow = new google.maps.InfoWindow();

	

	var locations = [
	          {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
	          {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
	          {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
	          {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
	          {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
	          {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
	        ];


	//looping through locations and spitting out a marker onto the map
	//to add more info to each marker, we simply add it to the Marker object...here we added coordinates and icon to it

	var mapIcon;

	function typeOfIcon(place) {
		if (place.location.lng > -73.9638) {
			mapIcon = 'map-marker.png'
		} else {
			mapIcon = 'map-marker1.png'
		}
	}

	$.each(locations, function(i, location) {
		typeOfIcon(location)
		var title = location.title;
		var position = location.location;

		var marker = new google.maps.Marker({
			position: position, 
			coordinates: position,
			icon: mapIcon,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
		})

		markers.push(marker)

		//extends the boundries of the map to fit each marker


		marker.addListener('click', function() {
			//'this' means the marker that was clicked
			nicksfunction(this, eachinfoWindow)
			console.log(this)

		});
	})


	function nicksfunction(marker, infowindow) {
		if (infowindow.marker != marker) {
			infowindow.marker = marker;
			infowindow.setContent('<div>' + marker.title + marker.coordinates.lat + marker.coordinates.lng + '</div>');
			infowindow.open(map, marker);

			infowindow.addListener('closeclick', function() {
				infowindow.close()
			})
		}
	}


	function showListings() {
		var bounds = new google.maps.LatLngBounds();

		$.each(markers, function(i, marker) {
			marker.setMap(map)
			bounds.extend(marker.position)
		})

		map.fitBounds(bounds)
	}

	function hideListings() {
		$.each(markers, function(i, marker) {
			marker.setMap(null) //by setting it to null, it doesnt delete em off page, just hides them
		})
	}

	//by adding this click event, we still load our info into the markers array on initialize, but hold off on showing it on the map. OnClick, we loop through markers array, and setMap() puts the marker on the page, and we set the bounds of the map
	document.getElementById('show-listings').addEventListener('click', showListings)

	document.getElementById('hide-listings').addEventListener('click', hideListings)


}
