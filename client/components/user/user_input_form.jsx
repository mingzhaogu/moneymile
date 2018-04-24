import React from 'react';

class UserInputForm extends React.Component {
  constructor(props) {
    super(props);

    const addressInput = this.props.currentAddress;
    console.log("addressinput", addressInput);
    this.state = {
      dollarInput: "",
      addressInput: addressInput,
      formSubmitted: false
    };

    this.updateAddress = this.updateAddress.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(e) {
    e.preventDefault();
    this.setState({ formSubmitted: true });
    this.props.parseAddressToLatLng(this.state.addressInput);
  }

  updateInput(field) {
    return (e) => { this.setState({ [field]: e.target.value }); };
  }

  updateAddress(e) {
    this.setState({ addressInput: e.target.value });
  }

  render() {
    if (!this.props.currentAddress) return null;

    let submitted;
    let formClassName;
    if (this.state.formSubmitted) {
      submitted = "submitted";
      formClassName = "user-submitted-form"
    } else {
      submitted = "";
      formClassName = "user-input-form"
    }

    return (
      <form className={formClassName}
        onSubmit={this.submitForm}>
        <p id={submitted}
          className={`question}`}>
          WHERE CAN I GO WITH $
          <input type="number"
            id={submitted}
            className={`dollar-input`}
            value={this.state.dollarInput}
            onChange={this.updateInput("dollarInput")}
          />
          &nbsp;FROM&nbsp;
          <input type="text"
            id={submitted}
            className={`address-input`}
            value={this.state.addressInput}
            onChange={this.updateInput("addressInput")}
          />
          ?
        </p>
        <input type="submit"
          id={submitted}
          className={`submit-button`}
          value="ask moneymile"
        />
      </form>
    );
  }
}

export default UserInputForm;
