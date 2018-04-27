import React from 'react';
import NavBar from '../ui/nav';
import UserRideSelection from '../user/user_ride_selection';
import * as MapTools from '../../util/cartographic_tools';
import * as LatLongTool from '../../util/latlong_conversion';
import * as AlgorithmLogic from '../../util/algorithm_logic';

class UserInputForm extends React.Component {
  constructor(props) {
    super(props);

    const addressInput = this.props.currentAddress;
    console.log("addressinput", addressInput);
    this.state = {
      dollarInput: "",
      addressInput: addressInput,
      formSubmitted: false,
      boundaries: [],
      rideType: "lyft",
    };

    this.updateInput = this.updateInput.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.centerMap = this.centerMap.bind(this);
    this.getRideType = this.getRideType.bind(this);

    this.parseAddressToLatLng = LatLongTool.parseAddressToLatLng.bind(this);
    this.getBoundaries = AlgorithmLogic.getBoundaries.bind(this);
    this.landOrWater = AlgorithmLogic.landOrWater.bind(this);
    this.rideEstimate = AlgorithmLogic.rideEstimate.bind(this);

    this.changeFormState = this.changeFormState.bind(this);
    this.validate = this.validate.bind(this);
  }

  changeFormState(){
    this.refs.btn.removeAttribute("disabled");
  }

  submitForm(e) {
    e.preventDefault();
    this.refs.btn.setAttribute("disabled", "disabled");

    this.setState({ formSubmitted: true }, () => {
      this.parseAddressToLatLng(this.state.addressInput);
    });
  }

  centerMap(locationLatLng) {
    this.setState({
      userLocation: locationLatLng
    });
  }

  updateInput(field) {
    return (e) => { this.setState({ [field]: e.target.value }); };
  }

  getRideType(type) {
    this.setState({ rideType: type }, () => { this.getBoundaries(); });
  }

  validate() {
    const { dollarInput, addressInput } = this.state;
    return (
      dollarInput.length > 0 &&
      addressInput.length > 0
    );
  }


  render() {
    if (!this.props.currentAddress) return null;

    // validation for button and input fields
    const isEnabled = this.validate();

    let navBar = <div></div>;
    let formName;
    let formClassName;
    let rideSelection;
    if (this.state.formSubmitted) {
      formName = "submitted";
      formClassName = "user-submitted-form";
      rideSelection = <UserRideSelection
        activeType={this.state.rideType}
        getRideType={this.getRideType}/>
    } else {
      navBar = <NavBar />
      formName = "";
      formClassName = "user-input-form";
    }

    return (
      <React.Fragment>
        {navBar}
        <form className={formClassName}
          onSubmit={this.submitForm}>

          <div id={formName}
            className="question"
          >WHERE CAN I GO WITH</div>

          <div id={formName} className="dollar-input-div">
            <img className="dollar-input-icon" src="https://i.imgur.com/KdVi5oB.png" />
            <input type="number"
              id={formName}
              className={`dollar-input`}
              value={this.state.dollarInput}
              onChange={this.updateInput("dollarInput")}
            />
          </div>

          <div id={formName}
            className="question"
          >&nbsp;FROM&nbsp;</div>

          <div id={formName} className="address-input-div">
            <img className="address-input-icon" src="https://i.imgur.com/UFHf4wX.png" />
            <input type="text"
              id={formName}
              className={`address-input`}
              value={this.state.addressInput}
              onChange={this.updateInput("addressInput")}
            />
          </div>

          <button
            id={formName}
            disabled={!isEnabled}
            className="submit"
            ref="btn"
            onClick={this.submitForm}><img id={formName} className="go-icon" src="https://i.imgur.com/wIo7DEh.png" /></button>
        </form>
        {rideSelection}
      </React.Fragment>
    );
  }
}

export default UserInputForm;
