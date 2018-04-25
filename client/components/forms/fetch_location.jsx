import React from 'react';
import axios from 'axios';
import async from 'async';

class FetchLocationForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const status = this.props.currentStatus;

    return (
      <form className="fetch-location-form">
        {status}
      </form>
    );
  }
}

export default FetchLocationForm;
