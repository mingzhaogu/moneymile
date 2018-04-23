import React from 'react';

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
      zoom: 13
    }

    // this.map = new google.maps.Map(this.refs.renderedMap, mapOptions)
    this.map = new google.maps.Map(
      document.getElementById("map-container"),
      mapOptions
    )
  }

  render() {
    debugger
    return (
      <div ref="renderedMap" id="map-container"></div>
    )
  }

}

export default Map;
