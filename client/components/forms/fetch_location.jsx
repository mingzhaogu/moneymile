import React, { Fragment } from 'react';
import NavBar from '../ui/nav';
import { Loading } from '../_reusables/loading';

class FetchLocationForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { currentStatus } = this.props;

    return <Fragment>
        <NavBar />
        <Loading customClasses="fetch-location">
          <img className="fetch-location-img" src="https://i.imgur.com/P0CmA6f.png" />
          <p className="status">{currentStatus}</p>
          <p className="wait-text">Please wait...</p>
        </Loading>
      </Fragment>;
  }
}

export default FetchLocationForm
