import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class InputForm extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="input-form-container">
        <form className="input-form">
          <label htmlFor="money-input" className="money-prompt">
            {'HOW FAR CAN I TRAVEL WITH $'}
          </label>
          <input className="money-input" type="number" />
          <label htmlFor="location-input" className="location-prompt">
            {'FROM'}
          </label>
          <input classNAme="location-input" type="number"></input>
        </form>
      </div>
    );
  }
}
