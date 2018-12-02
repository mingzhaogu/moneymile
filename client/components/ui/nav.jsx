import React from "react"

class NavBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const action = this.props.currentAction

    return (
      <nav className="nav-bar">
        <img className="logo" src="https://i.imgur.com/3ko7M3m.png" />
        <div className="login-icon" />
        <ul className="app-info-container">
          <li>
            <a href="https://github.com/mingzhaogu/moneymile">github</a>
          </li>
          <li>
            <a href="https://developer.lyft.com/v1/reference#availability-ride-estimates">
              <img
                className="lyft-logo"
                src="https://i.imgur.com/zXnHuRO.png"
              />
            </a>
          </li>
        </ul>
      </nav>
    )
  }
}

export default NavBar
