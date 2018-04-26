import React from 'react';
import axios from 'axios';
import async from 'async';

class UserInputForm extends React.Component {
  constructor(props) {
    super(props);

    const addressInput = this.props.currentAddress;
    console.log("addressinput: ", addressInput);
    this.state = {
      dollarInput: "",
      addressInput: addressInput,
      formSubmitted: false,
      boundaries: []
    };

    this.updateAddress = this.updateAddress.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.rideEstimate = this.rideEstimate.bind(this);
    this.getBoundaries = this.getBoundaries.bind(this);
    this.parseAddressToLatLng = this.parseAddressToLatLng.bind(this);
    this.centerMap = this.centerMap.bind(this);
    // this.getSnappedRoads = this.getSnappedRoads.bind(this);
  }

  submitForm(e) {
    e.preventDefault();
    this.setState({ formSubmitted: true }, () => {
      this.parseAddressToLatLng(this.state.addressInput);
    });
  }

  parseAddressToLatLng(address, callback) {
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK') {
        const addressLatLng = new google.maps.LatLng(
          results[0].geometry.location.lat(),
          results[0].geometry.location.lng()
        );
        this.setState({ addressLatLng }, () => {
          this.getBoundaries();
        });
        this.centerMap(addressLatLng);
      }
    });
  }

  centerMap(locationLatLng) {
    this.setState({
      userLocation: locationLatLng
    });
  }

  getBoundaries() {
    const stdDev = 2;
    const amount = 15;
    const defaultRadiusInMeters = 32000;
    const currentLatLng = this.state.addressLatLng;
    let directions = [];

    for (let i = 0; i < 360; i+=20) {
      directions.push(i);
    }

    // const directions = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5];
    const googleGeometry = google.maps.geometry.spherical;

    async.eachOf(directions, (direction, index, callback) => {
      const endLatLng = new googleGeometry.computeOffset(currentLatLng, defaultRadiusInMeters, direction);
      this.rideEstimate(currentLatLng, endLatLng, amount, stdDev, index, direction);
      callback(null);
    });
  }

  // getSnappedRoads(boundaries) {
  //   let boundariesArray = [];
  //
  //   for (let i = 0; i < 18; i++) {
  //     boundariesArray.push(i);
  //   }
  //
  //   boundariesArray = boundariesArray.map(index =>
  //     `${boundaries[index].lat()},${boundaries[index].lng()}`);
  //
  //   axios.request({
  //     url: 'https://roads.googleapis.com/v1/nearestRoads',
  //     method: 'get',
  //     params: {
  //       // interpolate: true,
  //       key: `AIzaSyB33R4lz668AdGEbbJ0NDxUHcwQ21k5QyA`,
  //       points: boundariesArray.join("|")
  //     }
  //   })
  //   .then(res =>
  //     this.setState({
  //       boundaries: res.data.snappedPoints.map(point => {
  //         return (
  //           new google.maps.LatLng(
  //             point.location.latitude,
  //             point.location.longitude
  //           )
  //         )
  //       })
  //     }, () => {
  //       this.props.drawBoundaries(this.state.boundaries)
  //     })
  //   )
  // }

  async rideEstimate(start, end, amount, stdDev, index, direction) {
    let result;
    await axios.get('/rideEstimate', {
      params: {
        start_lat: start.lat(),
        start_lng: start.lng(),
        end_lat: end.lat(),
        end_lng: end.lng(),
        ride_type: 'lyft'
      }
    })
    .then(res => {result = res})
    .catch(errors => console.log(errors))

    // console.log(result);
    // console.log('start: ' + start.lat() + ", " + start.lng());
    // console.log('end: ' + end.lat() + ", " + end.lng());
    this.props.newMarker(end);
    if (result.data) {
      let estimate = result.data.cost_estimates[0].estimated_cost_cents_max / 100;
      if (estimate < (amount + stdDev) && estimate > (amount - stdDev)) {
        let newBoundaries = Object.assign({}, this.state.boundaries);
        newBoundaries[index] = end;
        // console.log("end: ", end.lat(), end.lng());
        // console.log("estimate: ", estimate);
        this.setState({ boundaries: newBoundaries },
        () => {
          if (Object.keys(this.state.boundaries).length === 18)
            this.props.drawBoundaries(this.state.boundaries);
        });
      } else {
        // let deltaLat = Math.abs(end.lat() - start.lat());
        // let deltaLng = Math.abs(end.lng() - start.lng());
        let ratio = amount / estimate;

        const googleGeometry = google.maps.geometry.spherical;
        const newDistance = googleGeometry.computeDistanceBetween(start, end);
        const newEnd = new googleGeometry.computeOffset(start, ratio * newDistance, direction);
        // console.log('deltalat: ' + deltaLat);
        // console.log('deltalng: ' + deltaLng);
        // console.log('ratio: ' + ratio);
        this.rideEstimate(start, newEnd, amount, stdDev, index, direction);
      }
    }
  }

  updateInput(field) {
    return (e) => { this.setState({ [field]: e.target.value }); };
  }

  updateAddress(e) {
    this.setState({ addressInput: e.target.value });
  }

  render() {
    if (!this.props.currentAddress) return null;

    let formName;
    let formClassName;
    if (this.state.formSubmitted) {
      formName = "-submitted";
      formClassName = "user-submitted-form";
    } else {
      formClassName = "user-input-form";
    }

    return (
      <form className={formClassName}
        onSubmit={this.submitForm}>
        <p className={`question${formName}`}>
          WHERE CAN I GO WITH $
          <input type="number"
            className={`dollar-input${formName}`}
            value={this.state.dollarInput}
            onChange={this.updateInput("dollarInput")}
          />
          &nbsp;FROM&nbsp;
          <input type="text"
            className={`address-input${formName}`}
            value={this.state.addressInput}
            onChange={this.updateInput("addressInput")}
          />
          ?
        </p>
        <input type="submit"
          className={`submit-button${formName}`}
          value="ask moneymile"
        />
      </form>
    );
  }

}

export default UserInputForm;
