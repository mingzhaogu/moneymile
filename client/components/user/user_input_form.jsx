import React from 'react';
import axios from 'axios';
import async from 'async';
import UserRideSelection from './user_ride_selection';

class UserInputForm extends React.Component {
  constructor(props) {
    super(props);

    const addressInput = this.props.currentAddress;
    console.log("addressinput", addressInput);
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
  }

  submitForm(e) {
    e.preventDefault();
    this.setState({ formSubmitted: true }, () => {
      this.getBoundaries();
    });
  }

  getBoundaries() {
    const stdDev = 2;
    const amount = 15;
    const defaultRadiusInMeters = 32000;
    const currentLatLng = new google.maps.LatLng({lat: 37.7987837, lng: -122.4013864});
    const directions = [0, 45, 90, 135, 180, 225, 270, 315];
    const googleGeometry = google.maps.geometry.spherical;

    async.each(directions, (direction, callback) => {
      const endLatLng = new googleGeometry.computeOffset(currentLatLng, defaultRadiusInMeters, direction);
      console.log(endLatLng);
      this.rideEstimate(currentLatLng, endLatLng, amount, stdDev, callback);
      callback(null);
    });
  }

  async rideEstimate(start, end, amount, stdDev, completed, callback) {
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

    if (result.data) {
      let estimate = result.data.cost_estimates[0].estimated_cost_cents_max / 100;
      if (estimate < (amount + stdDev) && estimate > (amount - stdDev)) {
        console.log(end.lat());
        console.log(end.lng());
        console.log(estimate);
        this.setState({ boundaries: [...this.state.boundaries, end] },
        () => console.log(this.state.boundaries));
      } else {
        let deltaLat = Math.abs(end.lat()) - Math.abs(start.lat());
        let deltaLng = Math.abs(end.lng()) - Math.abs(start.lng());
        let ratio = amount / estimate;
        let newEndLat = start.lat() + (deltaLat * ratio);
        let newEndLng = start.lng() + (deltaLng * ratio);
        const newEnd = new google.maps.LatLng({lat: newEndLat, lng: newEndLng});
        // console.log('deltalat' + deltaLat);
        // console.log('deltalng' + deltaLng);
        // console.log('ratio' + ratio);
        // console.log('newEnd' + newEnd);
        this.rideEstimate(start, newEnd, amount, stdDev);
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
      <React.Component>
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
      {rideSelection}
      </React.Component>
    );
  }

}

export default UserInputForm;
