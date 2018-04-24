import React from 'react';

class UserInputForm extends React.Component {
  constructor(props) {
    super(props)

    const addressInput = this.props.currentAddress;
    console.log("addressinput", addressInput);
    this.state = {
      dollarInput: "",
      addressInput: addressInput
    }

    this.updateAddress = this.updateAddress.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(e) {
    e.preventDefault();
    this.props.parseAddressToLatLng(this.state.addressInput);
  }

  updateInput(field) {
    return (e) => { this.setState({ [field]: e.target.value }) }
  }

  updateAddress(e) {
    this.setState({ addressInput: e.target.value })
  }

  render() {
    if (!this.props.currentAddress) return null;

    return (
      <form className="user-input-form"
        onSubmit={this.submitForm}
      >
        <h1>WHERE CAN I</h1>
        <h1>GO WITH</h1>
        <p>$
          <input type="number"
            value={this.state.dollarInput}
            onChange={this.updateInput("dollarInput")} />
        </p>
        <h1>FROM</h1>
        <p>
          <input type="text"
            value={this.state.addressInput}
            onChange={this.updateInput("addressInput")}
          />?
        </p>
        <input type="submit" value="ask moneymile"/>
      </form>
    )
  }
}

export default UserInputForm;
