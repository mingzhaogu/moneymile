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
    this.resetMarkerPositionOnClick = this.resetMarkerPositionOnClick.bind(this);
    this.geocodeLocation = this.geocodeLocation.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
    this.setState({ status: 'FETCHING CURRENT LOCATION...' });
    this.getUserLocation();
  }

  // componentDidUpdate() {
  //   // this.initializeMap();
  // }

  initializeMap() {
    const sfCenter = { lat: 37.773972, lng: -122.431297 };
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
      draggable: true
    });


    this.marker.addListener('dragend', () => this.resetMarkerPositionOnClick(this.marker));
    this.marker.addListener('click', () => this.resetMarkerPositionOnClick(this.marker))
    this.map.addListener('click', e => {
      this.marker.setPosition(e.latLng);
      this.resetMarkerPositionOnClick(this.marker)
    });
  }

  geocodeLocation(latLngObject){
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLngObject }, (results, status) => {
      if (status === 'OK') {
        this.setState(
          { userAddress: results[0].formatted_address },
          console.log(results[0].formatted_address)
        );
      } else {
        console.log('did not work');
      }
    });
  }

  resetMarkerPositionOnClick(centerMarker){
    const newPosition = centerMarker.getPosition();
    this.geocodeLocation(newPosition);
    this.centerMap(newPosition)
  }

  centerMap(locationLatLng) {
    this.map.setCenter(locationLatLng);
    this.setState({
      userLocation: locationLatLng
    });
  }

  getUserLocation() {
    const successCallback = position => {
      const parsedLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      this.setState({ userLocation: parsedLocation });
      this.geocodeLocation(parsedLocation);
      this.marker.setPosition(parsedLocation)
      this.centerMap(parsedLocation)
    };

    const errorCallback = error => {
      console.log(error);
      this.setState({ status: "SORRY, COULDN'T FIND YOU..." });
      setTimeout(
        function() {
          this.setState({ userAddress: ' ' });
        }.bind(this),
        3000
      );
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      timeout: 10000,
      enableHighAccuracy: true
    });
  }

  newMarker(pos) {
    new google.maps.Marker({
      position: pos,
      map: this.map,
      title: `${pos.lat()}, ${pos.lng()}`,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new google.maps.Size(20, 20)
      }
    });
  }

  render() {
    let form;
    if (this.state.userAddress) {
      form = (
        <UserInputForm
          currentAddress={this.state.userAddress}
          drawBoundaries={this.drawBoundaries}
          newMarker={this.newMarker}
          map={this.map}
        />
      );
    } else {
      form = <FetchLocationForm currentStatus={this.state.status} />;
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
