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
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(e) {
    e.preventDefault();
    this.props.parseAddressToLatLng(this.state.addressInput);
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

        <input type="text"
          value={this.state.addressInput}
          onChange={this.updateAddress}
        />

        <input type="submit" />
      </form>
    )
  }
}

export default UserInputForm;
