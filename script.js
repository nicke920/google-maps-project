var map;
var markers = [];

var polygon;


function initMap() {
	var styles = [
    {
        "featureType": "landscape",
        "stylers": [
            {
                "hue": "#FFBB00"
            },
            {
                "saturation": 43.400000000000006
            },
            {
                "lightness": 37.599999999999994
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "hue": "#FFC200"
            },
            {
                "saturation": -61.8
            },
            {
                "lightness": 45.599999999999994
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "hue": "#FF0300"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 51.19999999999999
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "hue": "#FF0300"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 52
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "hue": "#0078FF"
            },
            {
                "saturation": -13.200000000000003
            },
            {
                "lightness": 2.4000000000000057
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "hue": "#00FF6A"
            },
            {
                "saturation": -1.0989010989011234
            },
            {
                "lightness": 11.200000000000017
            },
            {
                "gamma": 1
            }
        ]
    }
]
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.719526, lng: -74.0089934},
		zoom: 8,
		styles: styles, //styles applied to the map
		mapTypeControl: false, //disables user from changing map to satellite or terrain, etc...
		streetViewControl: true //false takes away street view pegman to user
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
                createInfoWindow(this, eachinfoWindow)
                console.log(this)

            });
        })


        function createInfoWindow(marker, infowindow) {
            if (infowindow.marker != marker) {
                infowindow.marker = marker;
                


                var streetViewService = new google.maps.StreetViewService();
                var radius = 50;

                function getStreetView(data, status) {
                    if (status == google.maps.StreetViewStatus.OK) {
                        var nearestStreetViewLocation = data.location.latLng;

                        //computeheading() allows us to specify the direction the camera is looking towards.. calculated by passing two latlng objects.. in this case the nearest availble latlng and the latlng of the actual address
                        var heading = google.maps.geometry.spherical.computeHeading(nearestStreetViewLocation, marker.position);

                        //set the content with the pano div to display the streetview
                        infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');

                        var panoramicOptions = {
                            position: nearestStreetViewLocation,
                            pov: {
                                heading: heading,
                                pitch: 30
                            }
                        };
                        
                        //actually creating the panorama object and placing it inside the div we created in the infowindow
                        var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramicOptions)

                    }
                }

                streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);


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





    //initializing drawing manager
    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON, //default drawing mode
        drawingControl: true, 
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT, 
            drawingModes: [google.maps.drawing.OverlayType.POLYGON] //available drawing modes
        }
    })

    function toggleDrawing() {
        //if the drawing manager has a map property already, disable it to null... else add it to the drawing manager.... this basically enables the drawing manager on the overlay

        //pt.2: once user done polygon and clicks the toggle polygon btn again, we want to get rid of the polygon from the map
        if (drawingManager.map) {
            drawingManager.setMap(null);
            if (polygon) {
                polygon.setMap(null)
            }
        } else {
            drawingManager.setMap(map);
        }
        console.log(drawingManager)
    }

    drawingManager.addListener('overlaycomplete', function(e) {
        console.log('e', e)
        //first, if there already is another polygon, get rid of it and remove the markers
        if (polygon) {
            polygon.setMap(null);
            hideListings();
        }
        
        //switch pointer to the hand instead of the drawing one
        drawingManager.setDrawingMode(null);

        //being able to edit the polygon once its been created
        polygon = e.overlay;
        polygon.setEditable(true);

        searchWithinThePolygon();

        polygon.getPath().addListener('set_at', searchWithinThePolygon)
        polygon.getPath().addListener('insert_at', searchWithinThePolygon)

    })

    function searchWithinThePolygon() {
        //loops through the markers array, and if the marker's position is within the polygon area, set it to the map... else hide it.
        $.each(markers, function(index, marker) {
            if (google.maps.geometry.poly.containsLocation(marker.position, polygon)) {
                marker.setMap(map);
            } else {
                marker.setMap(null);
            }
        })
    }


   

	//by adding this click event, we still load our info into the markers array on initialize, but hold off on showing it on the map. OnClick, we loop through markers array, and setMap() puts the marker on the page, and we set the bounds of the map
	document.getElementById('show-listings').addEventListener('click', showListings)

	document.getElementById('hide-listings').addEventListener('click', hideListings)

    document.getElementById('toggle-drawing').addEventListener('click', function() {
        toggleDrawing(drawingManager)
    })

    document.getElementById('zoom-to-area').addEventListener('click', function() {
        zoomToArea();
    })
    document.getElementById('zoom-to-area2').addEventListener('click', function() {
        geoCodeAddress();
    })

    //     $('#zoom-to-area').on('click', function() {
    //     zoomToArea();
    // })

    function zoomToArea() {
        var geocoder = new google.maps.Geocoder;

        var address = $('#zoom-to-area-text').val();

        if (address === '') {
            alert('Cannot enter a blank address')
        } else {
            geocoder.geocode({
                address: address, 
                componentRestrictions: {        //restricts the search to only be within the New York locality
                    locality: "New York"
                }
            }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {

                    map.setCenter(results[0].geometry.location);
                    map.setZoom(15);
                } else {
                    alert('sorry could not be found')
                }
            })
        }
    }

    function geoCodeAddress() {
        //create new instance of Geocoder class
        var geocoder = new google.maps.Geocoder;

        //get value from input
        var address = $('#zoom-to-area-text2').val();


        //if input is blank, alert user... else, geocode the input passing in address parameter.. then use callback to execute upon retrieval of results.. this callback takes a results and status parameter
        if (address === '') {
            alert('its blank')
        } else {
            geocoder.geocode({
                address: address
            }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location)
                    map.setZoom(15)
                }
                
            })
        }
    }

    

}
