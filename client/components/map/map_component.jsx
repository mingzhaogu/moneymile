import React from 'react';

import NavBar from '../ui/nav';
import UserInputForm from '../forms/user_input_form';
import FetchLocationForm from '../forms/fetch_location';
import MapStyle from './map_style';
import * as MapTools from '../../util/cartographic_tools';
import * as AlgorithmLogic from '../../util/algorithm_logic';
import UserRideSelection from '../user/user_ride_selection';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.directionsServiceObject = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();

    this.state = {
      userLocation: null,
      userAddress: null,
      status: '',
      newBoundary: {},

    };

    this.getUserLocation = this.getUserLocation.bind(this);
    this.initializeMap = this.initializeMap.bind(this);
    this.centerMap = this.centerMap.bind(this);
    this.drawBoundaries = MapTools.drawBoundaries.bind(this);
    this.newMarker = this.newMarker.bind(this);
    this.resetMarkerPositionOnClick = this.resetMarkerPositionOnClick.bind(this);
    this.geocodeLocation = this.geocodeLocation.bind(this);
    this.clearOverlay = this.clearOverlay.bind(this);
    this.getBoundaries = AlgorithmLogic.getBoundaries.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
    this.setState({ status: 'FETCHING CURRENT LOCATION' });
    this.getUserLocation();
  }

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

  geocodeLocation(latLngObject) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLngObject }, (results, status) => {
      if (status === 'OK') {
        this.setState(
          { userAddress: results[0].formatted_address },
        );
      }
    });
  }

  clearOverlay(rideType) {
    this.state.newBoundary[rideType].setMap(null);

    const currentBoundaries = this.state.newBoundary;
    delete currentBoundaries[rideType];
    this.setState({ newBoundary: currentBoundaries })
  }

  resetMarkerPositionOnClick(centerMarker) {
    this.resetMap();
    const newPosition = centerMarker.getPosition();
    this.geocodeLocation(newPosition);
    this.centerMap(newPosition)
    // this.redrawBoundaries();
  }

  centerMap(locationLatLng) {
    this.map.setCenter(locationLatLng);
    this.setState({
      userLocation: locationLatLng
    });
    this.marker.setPosition(locationLatLng);
  }

  resetMap() {
    if (this.state.newBoundary.lyft) {
      this.clearOverlay("lyft");
    }
    if (this.state.newBoundary.lyft_plus) {
      this.clearOverlay("lyft_plus");
    }
    if (this.state.newBoundary.lyft_line) {
      this.clearOverlay("lyft_line");
    }

    let elements = document.getElementsByClassName('selected');
    while(elements.length > 0){
      elements[0].classList.remove('selected');
    }
  }

  redrawBoundaries() {
    // console.log("asdf", Object.keys(this.state.newBoundary));
    Object.keys(this.state.newBoundary).forEach((rideType) => {
      this.getBoundaries(this.state.userLocation, rideType)
    })
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
    let rideSelection;
    if (this.state.userAddress) {
      form = (
        <UserInputForm
          currentAddress={this.state.userAddress}
          centerMap={this.centerMap}
          drawBoundaries={this.drawBoundaries}
          newMarker={this.newMarker}
          map={this.map}
          selectedRideTypes={Object.keys(this.state.newBoundary)}
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
