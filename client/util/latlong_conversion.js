export const parseAddressToLatLng = function(address, callback) {
  const geocoder = new google.maps.Geocoder()
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      const addressLatLng = new google.maps.LatLng(
        results[0].geometry.location.lat(),
        results[0].geometry.location.lng()
      )
      this.props.centerMap(addressLatLng)
      this.setState({ addressLatLng }, () => {
        this.getBoundaries()
      })
    }
  })
}
