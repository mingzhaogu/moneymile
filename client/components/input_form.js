import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import async from 'async';

export default class InputForm extends React.Component {
  constructor() {
    super();
    this.state = {
      start_lat: '',
      start_lng: '',
      ride_type: '',
      boundaries: []
    };
    this.rideEstimate = this.rideEstimate.bind(this);
    this.getGeometry = this.getGeometry.bind(this);
  }

  getGeometry() {
    const stdDev = 2;
    const amount = 15;
    const defaultRadiusInMeters = 32000;
    const currentLatLng = new google.maps.LatLng({lat: 37.7987837, lng: -122.4013864});
    const directions = [0, 45, 90, 135, 180, 225, 270, 315];
    const googleGeometry = google.maps.geometry.spherical;

    async.each(directions, (direction, callback) => {
      const endLatLng = new googleGeometry.computeOffset(currentLatLng, defaultRadiusInMeters, direction);
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

  render() {
    return (
      <React.Fragment>
        <button onClick={() => this.getGeometry()}>Get Geometry</button>
      </React.Fragment>
    );
  }
}
