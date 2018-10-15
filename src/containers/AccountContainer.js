import React, { Component } from 'react';
import { connect } from 'react-redux';
import './AccountContainer.css';
import { SET_ACCOUNT_PENDING, SET_ACCOUNT_SUCCESS, SET_ACCOUNT_FAILURE, loadAccount } from '../actions/account';
import Account from '../components/Account/Account';

export class AccountContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { match } = this.props;
    this.load(match.params.address);
  }

  load = async (address) => {
    const {dispatch} = this.props;
    dispatch(await loadAccount(address));
  }

  render() {
    let { setAccount } = this.props;
    if (setAccount === SET_ACCOUNT_PENDING) {
      return (
        <div>LOADING!</div>
      );
    } else if (setAccount === SET_ACCOUNT_SUCCESS) {
      return (
        <div className="account">
          <div className="container">
            <Account />
          </div>
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
    account: state.app.account
  };
}

export default connect(mapStateToProps)(AccountContainer);