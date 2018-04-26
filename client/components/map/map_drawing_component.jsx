import React from 'react';

import UserInputForm from '../user/user_input_form';
import MapStyle from './map_style';

const coordArray = [
  { lat: 37.800212, lng: -122.410818 },
  { lat: 37.803670, lng: -122.421761 },
  { lat: 37.798273, lng: -122.432508 },
  { lat: 37.788403, lng: -122.430319 },
  { lat: 37.785705, lng: -122.422075 },
  { lat: 37.787366, lng: -122.408385 },
  { lat: 37.794222, lng: -122.402910 },
  { lat: 37.800596, lng: -122.407895 }
]

class MapDrawing extends React.Component {
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
    this.centerMap = this.centerMap.bind(this);
    this.parseAddressToLatLng = this.parseAddressToLatLng.bind(this);
    this.drawBoundaries = this.drawBoundaries.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
    // this.getUserLocation();
    this.drawBoundaries();
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
      styles: MapStyle,
    };

    this.map = new google.maps.Map(this.refs.renderedMap, mapOptions);
  }

  centerMap(locationLatLng) {
    this.setState({
      userLocation: locationLatLng
    })
  }

  drawBoundaries(){
    const bermudaTriangle = new google.maps.Polygon({
         paths: coordArray,
         strokeColor: '#FF0000',
         strokeOpacity: 0.8,
         strokeWeight: 3,
         fillColor: '#FF0000',
         fillOpacity: 0.35
       });
    const bounds = new google.maps.LatLngBounds();
    coordArray.forEach((coord) => bounds.extend(coord))
    this.map.fitBounds(bounds);
    bermudaTriangle.setMap(this.map);

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
      form = <UserInputForm
                currentAddress={this.state.userAddress}
                parseAddressToLatLng={this.parseAddressToLatLng}
              />
    }

    return (
      <div className="map-component">
        <div ref="renderedMap" id="map-container" />
      </div>
    );
  }
}

export default MapDrawing;
