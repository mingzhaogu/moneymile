import React from "react"

import NavBar from "../ui/nav"
import UserInputForm from "../forms/user_input_form"
import FetchLocationForm from "../forms/fetch_location"
import MapStyle from "./map_style"
import * as MapTools from "../../util/cartographic_tools"
import * as AlgorithmLogic from "../../util/algorithm_logic"
import UserRideSelection from "../user/user_ride_selection"

class Map extends React.Component {
  static rideTypes = ["lyft", "lyft_plus", "lyft_line"]

  constructor(props) {
    super(props)
    this.directionsServiceObject = new google.maps.DirectionsService()
    this.directionsRenderer = new google.maps.DirectionsRenderer()

    this.state = {
      userLocation: null,
      userAddress: null,
      status: "",
      newBoundary: {},
      loading: false
    }

    this.drawBoundaries = MapTools.drawBoundaries.bind(this)
    this.getBoundaries = AlgorithmLogic.getBoundaries.bind(this)
  }

  componentDidMount() {
    this.initializeMap()
    this.setState({ status: "FETCHING CURRENT LOCATION" })
    this.getUserLocation()
  }

  loadingMount = () => {
    this.setState({ loading: true })
  }

  initializeMap = () => {
    const sfCenter = { lat: 37.773972, lng: -122.431297 }
    const center = this.state.userLocation || sfCenter

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
    }

    this.map = new google.maps.Map(this.refs.renderedMap, mapOptions)
    this.marker = new google.maps.Marker({
      position: center,
      map: this.map,
      draggable: true
    })

    this.marker.addListener("dragend", () =>
      this.resetMarkerPositionOnClick(this.marker)
    )
    this.marker.addListener("click", () =>
      this.resetMarkerPositionOnClick(this.marker)
    )
    this.map.addListener("click", e => {
      this.marker.setPosition(e.latLng)
      this.resetMarkerPositionOnClick(this.marker)
    })
  }

  geocodeLocation = latLngObject => {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: latLngObject }, (results, status) => {
      if (status === "OK") {
        this.setState({ userAddress: results[0].formatted_address })
      }
    })
  }

  clearOverlay = rideType => {
    this.state.newBoundary[rideType].setMap(null)

    const currentBoundaries = this.state.newBoundary
    delete currentBoundaries[rideType]
    this.setState({ newBoundary: currentBoundaries })
  }

  resetMarkerPositionOnClick = centerMarker => {
    this.resetMap()
    const newPosition = centerMarker.getPosition()
    this.geocodeLocation(newPosition)
    this.centerMap(newPosition)
  }

  centerMap = locationLatLng => {
    this.map.setCenter(locationLatLng)
    this.setState({
      userLocation: locationLatLng
    })
    this.marker.setPosition(locationLatLng)
  }

  resetMap = () => {
    rideTypes.map(type => {
      if (this.state.newBoundary[type]) {
        this.clearOverlay(type)
      }
    })

    let elements = document.getElementsByClassName("selected")
    while (elements.length > 0) {
      elements[0].classList.remove("selected")
    }
  }

  redrawBoundaries() {
    Object.keys(this.state.newBoundary).forEach(rideType => {
      this.getBoundaries(this.state.userLocation, rideType)
    })
  }

  getUserLocation = () => {
    const successCallback = position => {
      const parsedLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      this.setState({ userLocation: parsedLocation })
      this.geocodeLocation(parsedLocation)
      this.marker.setPosition(parsedLocation)
      this.centerMap(parsedLocation)
    }

    const errorCallback = error => {
      this.setState({ status: "SORRY, COULDN'T FIND YOU..." })
      setTimeout(
        function() {
          this.setState({ userAddress: " " })
        }.bind(this),
        3000
      )
    }

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      timeout: 10000,
      enableHighAccuracy: true
    })
  }

  newMarker = pos => {
    new google.maps.Marker({
      position: pos,
      map: this.map,
      title: `${pos.lat()}, ${pos.lng()}`,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new google.maps.Size(20, 20)
      }
    })
  }

  render() {
    let form, loading, rideSelection
    if (this.state.loading) {
      loading = (
        <div id="loading">
          <p id="loading-text">CALCULATING DISTANCE</p>
        </div>
      )
    }

    if (this.state.userAddress) {
      form = (
        <UserInputForm
          currentAddress={this.state.userAddress}
          centerMap={this.centerMap}
          resetMap={this.resetMap}
          clearOverlay={this.clearOverlay}
          drawBoundaries={this.drawBoundaries}
          newMarker={this.newMarker}
          map={this.map}
          loadingMount={this.loadingMount}
          selectedRideTypes={Object.keys(this.state.newBoundary)}
        />
      )
    } else {
      form = <FetchLocationForm currentStatus={this.state.status} />
    }

    return (
      <div className="map-component">
        <div ref="renderedMap" id="map-container" />
        {loading}
        {form}
      </div>
    )
  }
}

export default Map
