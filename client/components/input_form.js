import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class InputForm extends React.Component {
  constructor() {
    super();
    this.state = {
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
        start_lat: 37.7987837,
        start_lng: -122.4013864,
        end_lat: 37.7988899,
        end_lng: -122.403466,
        ride_type: 'lyft'
      }
    }).then(function(res) {
      console.log(res);
    });
  }

  render() {
    this.rideEstimate();
    return (
      <React.Fragment>
        <h2>app academy!</h2>
      </React.Fragment>
    );
  }
}
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
