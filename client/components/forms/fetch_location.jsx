import React from 'react';
import NavBar from '../ui/nav';

class FetchLocationForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const status = this.props.currentStatus;

    return (
      <React.Fragment>
        <NavBar />
        <form className="fetch-location-form">
          {status}
        </form>
      </React.Fragment>
    );
  }
}

export default FetchLocationForm;
