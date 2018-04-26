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
    // this.landOrWater = this.landOrWater.bind(this);
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

    const googleGeometry = google.maps.geometry.spherical;

    async.eachOf(directions, (direction, index, callback) => {
      const endLatLng = new googleGeometry.computeOffset(currentLatLng, defaultRadiusInMeters, direction);
      this.landOrWater(endLatLng.lat(), endLatLng.lng(), res => console.log(res))
      this.rideEstimate(currentLatLng, endLatLng, amount, stdDev, index, direction);
      callback(null);
    });
  }

  landOrWater(lat, lng, callback) {
      const map_url = "http://maps.googleapis.com/maps/api/staticmap?center="+lat+","+lng+"&zoom="+this.props.map.getZoom()+"&size=1x1&maptype=roadmap"
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let result;

      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = map_url;

      image.onload = function() {
          canvas.width = image.width;
          canvas.height = image.height;
          canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
          const pixelData = canvas.getContext('2d').getImageData(0, 0, 1, 1).data;
          if( pixelData[0] > 160 && pixelData[0] < 181 && pixelData[1] > 190 && pixelData[1] < 210 ) {
              result = "water";
          } else {
              result = "land";
          }
          callback(result);
      }
  }

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

    console.log("end: ", end.lat(), end.lng());
    this.props.newMarker(end);
    if (result.data) {
      let estimate = result.data.cost_estimates[0].estimated_cost_cents_max / 100;
      console.log("estimate: ", estimate);
      if (estimate < (amount + stdDev) && estimate > (amount - stdDev)) {
        let newBoundaries = Object.assign({}, this.state.boundaries);
        newBoundaries[index] = end;
        this.setState({ boundaries: newBoundaries },
        () => {
          if (Object.keys(this.state.boundaries).length === 18)
            this.props.drawBoundaries(this.state.boundaries);
        });
      } else {
        let ratio = amount / estimate;
        const googleGeometry = google.maps.geometry.spherical;
        const newDistance = googleGeometry.computeDistanceBetween(start, end);
        const newEnd = new googleGeometry.computeOffset(start, ratio * newDistance, direction);
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
