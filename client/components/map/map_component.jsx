import React from 'react';

import MapStyle from './map_style';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.directionsServiceObject = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.getUserLocation = this.getUserLocation.bind(this);
    this.initializeMap = this.initializeMap.bind(this);
    this.state = {
      userLocation: 'a',
      userAddress: 'b',
    };
    window.state = this.state;
  }

  componentDidMount() {
    this.initializeMap();
  }

  initializeMap() {
    const mapOptions = {
      center: { lat: 37.773972, lng: -122.431297 },
      zoom: 13,
      styles: MapStyle
    };

    this.map = new google.maps.Map(this.refs.renderedMap, mapOptions);
    const infoWindow = new google.maps.InfoWindow();
    this.getUserLocation();
    console.log(this.state.userLocation);
    // let positionCoordinates =
    // GET USER'S LOCATION -- MAY REFACTOR LATER:
    // let location;
    // if (navigator.geolocation) {
    //   location = navigator.geolocation.getCurrentPosition((position) => {
    //     this.userLocation = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     };
    //     window.position = position;
    //
    //     infoWindow.setPosition(this.userLocation);
    //     infoWindow.setContent('Location found.');
    //     infoWindow.open(this.map);
    //     this.map.setCenter(this.userLocation)
    //   }, (error) => {
    //     // should we set a default center if error returns?
    //     console.log(error)
    //   });
    // } else {
    //   // should be same thing as our error callback
    //   console.log("Browser doesn't support geolocation.")
    // }
  }

  getUserLocation() {
    console.log('start');
    const successCallback = position => {
      const parsedLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var geocoder = new google.maps.Geocoder;
      this.setState({ userLocation: parsedLocation });
      geocoder.geocode({ location: parsedLocation }, function(results, status) {
        //include componentRestrictions? Restrict to areas lyft operates?
        if (status === 'OK') {
          console.log(results[0].formatted_address)
        } else {
          console.log('did not work')
        }
      });
      console.log(this.state.userLocation);
    };

    function errorCallback(error) {
      console.log(error);
    }
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      timeout: 10000
    });
  }

  render() {
    // if (this.state.userLocation === 'a') return null;

    return (
      <React.Fragment>
        <div ref="renderedMap" id="map-container" />
      </React.Fragment>
    );
  }
}

export default Map;
