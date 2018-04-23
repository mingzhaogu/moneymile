import React from 'react';

import MapStyle from './map_style';

class Map extends React.Component {
  constructor(props) {
    super(props);
     this.directionsServiceObject = new google.maps.DirectionsService()
     this.directionsRenderer = new google.maps.DirectionsRenderer()
  }

  componentDidMount() {
    this.initializeMap();
  }

  initializeMap() {
    const mapOptions = {
      center: { lat: 37.773972, lng: -122.431297 },
      zoom: 13,
      styles: MapStyle
    }

    this.map = new google.maps.Map(this.refs.renderedMap, mapOptions);
    const infoWindow = new google.maps.InfoWindow;

    // GET USER'S LOCATION -- MAY REFACTOR LATER:
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(this.userLocation);
        infoWindow.setContent('Location found.');
        infoWindow.open(this.map);
        this.map.setCenter(this.userLocation)
      }, (error) => {
        // should we set a default center if error returns?
        console.log(error)
      });
    } else {
      // should be same thing as our error callback
      console.log("Browser doesn't support geolocation.")
    }
  }

  render() {
    return (
      <React.Fragment>
        <div ref="renderedMap" id="map-container"></div>
      </React.Fragment>
    )
  }

}

export default Map;
