import React, { Component } from 'react';
import { connect } from 'react-redux';
import './CreateAccountContainer.css'

export class CreateAccountContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(CreateAccountContainer);