import React, { Component } from 'react';
import { connect } from 'react-redux';
import './CreateAccountContainer.css'
import CreateAccount from '../components/Account/CreateAccount';

class CreateAccountContainer extends Component {
  render() {
    return (
      <div className="container">
        <div className="create-account">
          <CreateAccount />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    ...state
  };
}

export default connect(mapStateToProps)(CreateAccountContainer);