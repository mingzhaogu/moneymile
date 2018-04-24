import React from 'react';

import UserInputForm from '../input_form';
import MapStyle from './map_style';


class Map extends React.Component {
  constructor(props) {
    super(props);
    this.directionsServiceObject = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.state = {
      userLocation: null,
      userAddress: null,
    };

    this.getUserLocation = this.getUserLocation.bind(this);
    this.initializeMap = this.initializeMap.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
    this.getUserLocation();
  }

  componentDidUpdate() {
    this.initializeMap();
  }

  initializeMap() {
    const sfCenter = { lat: 37.773972, lng: -122.431297 }
    const center = this.state.userLocation || sfCenter;

    const mapOptions = {
      center: center,
      zoom: 13,
      styles: MapStyle
    };

    this.map = new google.maps.Map(this.refs.renderedMap, mapOptions);
  }

  getUserLocation() {
    const successCallback = position => {
      const parsedLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      this.setState({userLocation: parsedLocation})

      const geocoder = new google.maps.Geocoder;
      this.setState({ userLocation: parsedLocation });
      geocoder.geocode({ location: parsedLocation }, (results, status) => {
        //include componentRestrictions? Restrict to areas lyft operates?
        if (status === 'OK') {
          this.setState(
            { userAddress: results[0].formatted_address },
            console.log("should have recentered")
          )
        } else {
          console.log('did not work')
        }
      });
    };

    function errorCallback(error) {
      console.log(error);
    }

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      timeout: 10000,
      enableHighAccuracy: true
    });
  }

  render() {
    let form;
    if (this.state.userAddress) {
      form = <UserInputForm currentAddress={this.state.userAddress}/>
    }

    return (
      <React.Fragment>
        <div ref="renderedMap" id="map-container" />
        {form}
      </React.Fragment>
    );
  }
}

export default Map;
