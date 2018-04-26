import React from 'react';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const action = this.props.currentAction;

    return (
      <nav className="nav-bar">
        <img className="logo" src="https://i.imgur.com/3ko7M3m.png"/>
        <div className="login-icon">Login with Lyft</div>
      </nav>
    );
  }
}

export default NavBar;
