import React from 'react';

import NavBar from '../ui/nav';
import UserInputForm from '../forms/user_input_form';
import FetchLocationForm from '../forms/fetch_location';
import MapStyle from './map_style';
import * as MapTools from '../../util/cartographic_tools';

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
    this.drawBoundaries = MapTools.drawBoundaries.bind(this);
    this.newMarker = this.newMarker.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
    this.setState({ status: "FETCHING CURRENT LOCATION..."});
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
        });
  }

  centerMap(locationLatLng) {
    this.setState({
      userLocation: locationLatLng
    })
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
      this.setState({ status: "SORRY, COULDN'T FIND YOU..."});
      setTimeout(function(){
        this.setState({userAddress: " "});
      }.bind(this), 3000);
    }

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      timeout: 10000,
      enableHighAccuracy: true
    });
  }

  newMarker(pos) {
    new google.maps.Marker({
      position: pos,
      map: this.map,
      title: `${pos.lat()}, ${pos.lng()}`
    });
  }

  render() {
    let form;
    if (this.state.userAddress) {
      form = <UserInputForm
                currentAddress={this.state.userAddress}

                drawBoundaries={this.drawBoundaries}
                newMarker={this.newMarker}
                map={this.map}
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
