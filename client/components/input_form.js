import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
var querystring = require('querystring');

export default class InputForm extends React.Component {
  constructor() {
    super();
    this.state = {
      amount: '',
      start_lat: '',
      start_lng: '',
      end_lat: '',
      end_lng: '',
      ride_type: ''

    };
    this.rideEstimate = this.rideEstimate.bind(this);
  }

  rideEstimate() {
    axios.get('/rideEstimate', {
      params: {
        amount: 10,
        start_lat: 37.798861,
        start_lng: -122.401347,
        end_lat: 37.7598053,
        end_lng: -122.3907224,
        ride_type: 'lyft'
      }
    }, {
    }).then(function(response) {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    this.rideEstimate();
    return <div></div>;//(
      // <div className="input-form-container">
      //   <form className="input-form">
      //     <label htmlFor="money-input" className="money-prompt">
      //       {'HOW FAR CAN I TRAVEL WITH $'}
      //     </label>
      //     <input className="money-input" type="number" />
      //     <label htmlFor="location-input" className="location-prompt">
      //       {'FROM'}
      //     </label>
      //     <input classNAme="location-input" type="number"></input>
      //   </form>
      // </div>
    // )
  }
}
