import React, { Component } from 'react';
import { connect } from 'react-redux';
import './AccountContainer.css';
import { SET_ACCOUNT_PENDING, SET_ACCOUNT_SUCCESS, SET_ACCOUNT_FAILURE, loadAccount } from '../actions/account';
import { SET_TRANSACTIONS_FROM_ADDRESS_PENDING, SET_TRANSACTIONS_FROM_ADDRESS_SUCCESS, SET_TRANSACTIONS_FROM_ADDRESS_FAILURE, loadTransactionFromAddress } from '../actions/blockchain';
import Account from '../components/Account/Account';
import AccountTransactionList from '../components/Account/AccountTransactionList';

export class AccountContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { match } = this.props;
    this.load(match.params.address);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.key !== this.props.location.key) {
      this.load(nextProps.match.params.address);
    }
  }

  load = async (address) => {
    const {dispatch} = this.props;
    dispatch(await loadAccount(address));
    dispatch(await loadTransactionFromAddress(address, 1));
  }

  renderTransactions() {
    let { setTransactionsFromAddress } = this.props;
    if (setTransactionsFromAddress === SET_TRANSACTIONS_FROM_ADDRESS_PENDING) {
      return (
        <div>LOADING!</div>
      );
    } else if (setTransactionsFromAddress === SET_TRANSACTIONS_FROM_ADDRESS_SUCCESS) {
      return (
        <AccountTransactionList />
      );
    } else {
      return <div></div>
    }
  }

  render() {
    let { setAccount } = this.props;
    if (setAccount === SET_ACCOUNT_PENDING) {
      return (
        <div>LOADING!</div>
      );
    } else if (setAccount === SET_ACCOUNT_SUCCESS) {
      return (
        <div className="container account">
          <Account />
          {this.renderTransactions()}
        </div>
      );
    } else if (setAccount === SET_ACCOUNT_FAILURE) {

    }
    return <div></div>
  }
}

function mapStateToProps(state) {
  return {
    setAccount: state.network.setAccount,
    setTransactionsFromAddress: state.network.setTransactionsFromAddress,
    account: state.app.account
  };
}

export default connect(mapStateToProps)(AccountContainer);