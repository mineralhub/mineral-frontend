import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Block } from '../components';
import './DelegateListContainer.css';

export class DelegateListContainer extends Component {
  render() {
    /*
    let { setBlock } = this.props;
    if (setBlock === SET_BLOCK_PENDING) {
      return (
        <div>LOADING!</div>
      );
    } else if (setBlock === SET_BLOCK_SUCCESS) {
      return (
        <div className="block">
          <div className="container">
            <Block />
          </div>
        </div>
      );
    } else if (setBlock === SET_BLOCK_FAILURE) {
    }
    */
    return <div>HI?</div>
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(DelegateListContainer);