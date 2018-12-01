import React from 'react';

class UserRideSelection extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   selected: ["lyft"]
    // };

  }

  updateType = (type) => {
    // console.log("selectedRideTypes", this.props.selectedRideTypes);
    return (e) => {
      // if (this.state.selected.includes(type)) {
      if (this.props.selectedRideTypes.includes(type)) {
        e.currentTarget.classList.remove('selected');
        // const index = selectedRideTypes.indexOf(type);
        // selectedRideTypes.splice(index, 1);
        // this.setState({ selected: selectedRideTypes });
        this.props.clearOverlay(type);
      } else {
        e.currentTarget.classList.add('selected');
        // selectedRideTypes.push(type);
        // this.setState({selected: selectedRideTypes});
        this.props.getRideType(type);
      }
    };
  }

  render() {
    return (
      <ul className="user_ride_selection">
        <li id="default-select" className="selected" onClick={this.updateType("lyft")}>
          <img className="car-icon" src="https://i.imgur.com/1PtENWQ.png"/>
          <p>Lyft</p>
        </li>
        <li onClick={this.updateType("lyft_plus")}>
          <img className="car-icon" src="https://i.imgur.com/RjJTuOV.png"/>
          <p>Plus</p>
        </li>
        <li onClick={this.updateType("lyft_line")}>
          <img className="car-icon" src="https://i.imgur.com/mXvN9Fd.png"/>
          <p>Line</p>
        </li>
      </ul>
    );
  }
}

export default UserRideSelection;
