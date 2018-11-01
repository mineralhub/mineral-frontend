import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RegisterDelegate } from '../components';
import {
  RegisterDelegateTransaction,
  Transaction,
  TransactionType
} from '../common/Transaction';
import './RegisterDelegateContainer.css';

export class RegisterDelegateContainer extends Component {
  render() {
    let { account } = this.props;
    return (
      <div className="container">
        <div className="register-delegate">
          <RegisterDelegate 
            onConfirm={
              (name) => {
                let register = new RegisterDelegateTransaction(account.address);
                register.name = new Buffer(name, 'utf-8');
                let tx = new Transaction(TransactionType.RegisterDelegate, register);
                tx.setTimestamp();
                tx.sign(account.key);
              }
            }
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account
  };
}

export default connect(mapStateToProps)(RegisterDelegateContainer);