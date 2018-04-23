import React from 'react';

import MapStyle from 'map_style';

class Map extends React.Component {
  constructor(props) {
    super(props);
     this.directionsServiceObject = new google.maps.DirectionsService()
     this.directionsRenderer = new google.maps.DirectionsRenderer()
  }

  componentDidMount() {
    debugger
    this.initializeMap();
  }

  initializeMap() {
    const mapOptions = {
      center: { lat: 37.773972, lng: -122.431297 },
      zoom: 13,
      styles: MapStyle
    }

    // this.map = new google.maps.Map(this.refs.renderedMap, mapOptions)
    this.map = new google.maps.Map(
      document.getElementById("map-container"),
      mapOptions
    )
  }

  render() {
    return (
      <React.Fragment>
        <h1>hiiasdfasdfasdfiiii</h1>
        <div ref="renderedMap" id="map-container"></div>
        <h1>hiiasdfasdfasdfiiii</h1>
      </React.Fragment>
    )
  }

}
// <div ref="renderedMap" id="map-container" style={{height: 500 + 'px', width: 500 + 'px'}}></div>

export default Map;
