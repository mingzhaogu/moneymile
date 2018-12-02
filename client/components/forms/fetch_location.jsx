import React from "react"
import NavBar from "../ui/nav"

class FetchLocationForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const status = this.props.currentStatus

    return (
      <React.Fragment>
        <NavBar />
        <form className="fetch-location-form">
          <img
            className="fetch-location-img"
            src="https://i.imgur.com/P0CmA6f.png"
          />
          {status}
          <p className="wait-text">Please wait...</p>
        </form>
      </React.Fragment>
    )
  }
}

export default FetchLocationForm
