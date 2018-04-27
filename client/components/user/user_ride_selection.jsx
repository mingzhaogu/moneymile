import React from 'react';

class UserRideSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: ["lyft"]
    };

    this.updateType = this.updateType.bind(this);
  }

  updateType(type) {
    const selectedRideTypes = this.state.selected;
    console.log(this.state.selected);
    return (e) => {
      if (this.state.selected.includes(type)) {
        e.currentTarget.classList.remove('selected');
        const index = selectedRideTypes.indexOf(type);
        selectedRideTypes.splice(index, 1);
        this.setState({selected: selectedRideTypes});
      } else {
        e.currentTarget.classList.add('selected');
        selectedRideTypes.push(type);
        this.setState({selected: selectedRideTypes});
        this.props.getRideType(type);
      }
    }
  }

  render() {

    return (
      <ul className="user_ride_selection">
        <li className="selected" onClick={this.updateType("lyft")}>
          <img className="car-icon" src="https://i.imgur.com/1PtENWQ.png"/>
          <p>Lyft</p>
        </li>
        <li onClick={this.updateType("lyft_plus")}>
          <img className="car-icon" src="https://i.imgur.com/1PtENWQ.png"/>
          <p>Plus</p>
        </li>
        <li onClick={this.updateType("lyft_line")}>
          <img className="car-icon" src="https://i.imgur.com/1PtENWQ.png"/>
          <p>Line</p>
        </li>
        <li onClick={this.updateType("lyft_premier")}>
          <img className="car-icon" src="https://i.imgur.com/1PtENWQ.png"/>
          <p>Premier</p>
        </li>
        <li onClick={this.updateType("lyft_lux")}>
          <img className="car-icon" src="https://i.imgur.com/1PtENWQ.png"/>
          <p>Lux</p>
        </li>
        <li onClick={this.updateType("lyft_luxsuv")}>
          <img className="car-icon" src="https://i.imgur.com/1PtENWQ.png"/>
          <p>Lux SUV</p>
        </li>
      </ul>
    );
  }
}

export default UserRideSelection;
