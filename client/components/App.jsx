import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import Map from './map/map_component';


export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    axios.request({
      url: "/oauth/token",
      method: "post",
      baseURL: "https://api.lyft.com/",
      auth: {
        username: process.env.LYFT_CLIENT_ID,
        password: process.env.LYFT_CLIENT_SECRET
      },
      data: {
        "grant_type": "client_credentials",
        "scope": "public"
      }
    }).then(function(res) {
      console.log(res);
    });
  }

  render() {
    return (
      <React.Fragment>
        <Map />
      </React.Fragment>
    );
  }
}
