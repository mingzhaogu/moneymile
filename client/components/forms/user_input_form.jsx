import React from "react"
import NavBar from "../ui/nav"
import UserRideSelection from "../user/user_ride_selection"
import * as LatLongTool from "../../util/latlong_conversion"
import * as AlgorithmLogic from "../../util/algorithm_logic"

class UserInputForm extends React.Component {
  constructor(props) {
    super(props)

    const addressInput = this.props.currentAddress
    this.state = {
      dollarInput: "",
      addressInput: addressInput,
      formSubmitted: false,
      boundaries: [],
      rideType: "lyft"
    }

    this.parseAddressToLatLng = LatLongTool.parseAddressToLatLng.bind(this)
    this.getBoundaries = AlgorithmLogic.getBoundaries.bind(this)
    this.rideEstimate = AlgorithmLogic.rideEstimate.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.currentAddress !== newProps.currentAddress) {
      this.setState({ addressInput: newProps.currentAddress })
    }
  }

  changeFormState = () => {
    this.refs.btn.removeAttribute("disabled")
  }

  submitForm = e => {
    e.preventDefault()
    this.props.loadingMount()
    this.refs.btn.setAttribute("disabled", "disabled")

    let elements = document.getElementsByClassName("selected")
    while (elements.length > 0) {
      elements[0].classList.remove("selected")
    }

    if (this.state.formSubmitted) {
      this.props.resetMap()
      this.setState({ rideType: "lyft", boundaries: [] }, () => {
        let dft = document.getElementById("default-select")
        dft.classList.add("selected")
      })
    }

    this.setState({ formSubmitted: true, boundaries: [] }, () => {
      this.parseAddressToLatLng(this.state.addressInput, res =>
        this.centerMap(res)
      )
    })
  }

  updateInput = field => {
    return e => {
      this.setState({ [field]: e.target.value })
    }
  }

  getRideType = type => {
    this.props.loadingMount()
    this.setState({ rideType: type, boundaries: [] }, () => {
      this.parseAddressToLatLng(this.state.addressInput)
    })
  }

  validateDollar = amt => {
    const regex = /^\$?[0-9]+(\.[0-9][0-9])?$/
    const bound = amt >= 9.99 && amt <= 400
    return regex.test(amt) && bound ? true : false
  }

  validate = () => {
    const { dollarInput, addressInput } = this.state
    let checkValidDollar = this.validateDollar(dollarInput)
    return checkValidDollar && addressInput.length > 0
  }

  render() {
    if (!this.props.currentAddress) return null
    const isEnabled = this.validate()

    let navBar = <div />
    let formName
    let formClassName
    let rideSelection
    let infoContainer
    if (this.state.formSubmitted) {
      formName = "submitted"
      formClassName = "user-submitted-form"
      rideSelection = (
        <UserRideSelection
          activeType={this.state.rideType}
          getRideType={this.getRideType}
          clearOverlay={this.props.clearOverlay}
          selectedRideTypes={this.props.selectedRideTypes}
        />
      )
      infoContainer = ""
    } else {
      navBar = <NavBar />
      formName = ""
      formClassName = "user-input-form"
      infoContainer = (
        <div className="info-container">
          <p>
            Welcome to MoneyMile, a Lyft API ride estimates application. Enter a
            dollar amount between $10 - $400 into the form above and we'll
            calculate a matrix displaying how far you can go in your next Lyft
            ride request!
          </p>
        </div>
      )
    }

    return (
      <React.Fragment>
        {navBar}
        <form className={formClassName} onSubmit={this.submitForm}>
          <div id={formName} className="question">
            WHERE CAN I GO WITH
          </div>

          <div id={formName} className="dollar-input-div">
            <img
              className="dollar-input-icon"
              src="https://i.imgur.com/um4yd7D.png"
            />
            <input
              type="number"
              id={formName}
              className={`dollar-input`}
              value={this.state.dollarInput}
              min="10"
              max="500"
              onChange={this.updateInput("dollarInput")}
            />
          </div>

          <div id={formName} className="question">
            &nbsp;FROM&nbsp;
          </div>

          <div id={formName} className="address-input-div">
            <img
              className="address-input-icon"
              src="https://i.imgur.com/UFHf4wX.png"
            />
            <input
              type="text"
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
            onClick={this.submitForm}
          />
          {infoContainer}
        </form>
        {rideSelection}
      </React.Fragment>
    )
  }
}

export default UserInputForm
