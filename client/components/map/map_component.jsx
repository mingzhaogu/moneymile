import React from 'react';

import NavBar from '../ui/nav';
import UserInputForm from '../forms/user_input_form';
import FetchLocationForm from '../forms/fetch_location';
import MapStyle from './map_style';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.directionsServiceObject = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();

    this.state = {
      userLocation: null,
      userAddress: null,
      status: ''
    };

    this.getUserLocation = this.getUserLocation.bind(this);
    this.initializeMap = this.initializeMap.bind(this);
    this.centerMap = this.centerMap.bind(this);
    this.parseAddressToLatLng = this.parseAddressToLatLng.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
    this.setState({ status: "Fetching Current Location."})
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
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      styles: MapStyle
    };

    this.map = new google.maps.Map(this.refs.renderedMap, mapOptions);
    this.marker = new google.maps.Marker({
          position: center,
          map: this.map,
          // title: 'Hello World!'
        });
  }

  centerMap(locationLatLng) {
    this.setState({
      userLocation: locationLatLng
    })
  }

  parseAddressToLatLng(address) {
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({ address: address }, (results, status) => {
      //include componentRestrictions? Restrict to areas lyft operates?
      if (status === 'OK') {
        const addressLatLng = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        }
        console.log("addy", addressLatLng);
        this.centerMap(addressLatLng)
      } else {
        console.log('did not work')
      }
    });
  }

  getUserLocation() {
    const successCallback = (position) => {
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

    const errorCallback = (error) => {
      console.log(error);
      this.setState({ status: `Couldn't find current location.. &#9785`})
    }

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      timeout: 10000,
      enableHighAccuracy: true
    });
  }

  render() {
    let form;
    if (this.state.userAddress) {
      form = <UserInputForm
                currentAddress={this.state.userAddress}
                parseAddressToLatLng={this.parseAddressToLatLng}
              />;
    } else {
      form = <FetchLocationForm currentStatus={this.state.status} />
    }

    return (
      <div className="map-component">
        <div ref="renderedMap" id="map-container" />
        {form}
      </div>
    );
  }
}

export default Map;
