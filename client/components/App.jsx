import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import Map from './map/map_component';
import InputForm from './input_form';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <Map />
      </React.Fragment>
    );
  }
}
