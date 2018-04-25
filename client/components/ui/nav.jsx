import React from 'react';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const action = this.props.currentAction;

    return (
      <nav className="nav-bar">
        <div className="logo">MoneyMile</div>
        <div className="login-icon">Login with Lyft</div>
      </nav>
    );
  }
}

export default NavBar;
