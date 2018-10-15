import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransactionDetail } from '../components';
import { loadTransaction,
  SET_TRANSACTION_PENDING, SET_TRANSACTION_SUCCESS, SET_TRANSACTION_FAILURE } from '../actions/blockchain';
import './TransactionContainer.css';

export class TransactionContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { match } = this.props;
    this.load(match.params.hash);
  }

  load = async(hash) => {
    const {dispatch} = this.props;
    dispatch(await loadTransaction(hash));
  }

  render() {
    let { setTransaction } = this.props;
    if (setTransaction === SET_TRANSACTION_PENDING) {
      return (
        <div>LOADING!</div>
      );
    } else if (setTransaction === SET_TRANSACTION_SUCCESS) {
      return (
        <div className="transaction">
          <div className="container">
            <TransactionDetail />
          </div>
        </div>
      );
    } else if (setTransaction === SET_TRANSACTION_FAILURE) {
    }
    return <div></div>
  }
}

function mapStateToProps(state) {
  return {
    setTransaction: state.network.setTransaction
  };
}

export default connect(mapStateToProps)(TransactionContainer);