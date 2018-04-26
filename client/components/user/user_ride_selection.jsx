import React from 'react';

class UserRideSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: ["lyft"]
    }

    this.updateType = this.updateType.bind(this);
  }

  updateType(type) {
    const selectedRideTypes = this.state.selected

    return (e) => {
      if (this.state.selected.includes(type)) {
        e.target.classList.remove('selected');
        const index = selectedRideTypes.indexOf(type);
        selectedRideTypes.splice(type, 1)
        this.setState({
          selected: selectedRideTypes
        }, console.log("selected", this.state.selected))
      } else {
        e.target.classList.add('selected');
        selectedRideTypes.push(type);
        this.setState({
          selected: selectedRideTypes
        }, console.log("selected", this.state.selected))
      }
      this.props.getRideType(type)
    }
  }

  changeSelection() {

  }

  render() {
    // const lines = ["lyft", "lyft_plus"]
    // lines.map((line, idx) => (
    //   <li className=`${line}` onClick={this.updateType(line)}>
    //     <p>test</p>
    //   </li>
    // ))

    return (
      <ul className="user_ride_selection">
        <li onClick={this.updateType("lyft")}>
          <p>test</p>
        </li>
        <li onClick={this.updateType("lyft_plus")}>
          <p>test</p>
        </li>
        <li onClick={this.updateType("lyft_line")}>
          <p>test</p>
        </li>
        <li onClick={this.updateType("lyft_premier")}>
          <p>test</p>
        </li>
        <li onClick={this.updateType("lyft_lux")}>
          <p>test</p>
        </li>
        <li onClick={this.updateType("lyft_luxsuv")}>
          <p>test</p>
        </li>
      </ul>
    );
  }
}

export default UserRideSelection;
