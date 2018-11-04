import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { RegisterDelegate } from '../components';
import {
  RegisterDelegateTransaction,
  Transaction,
  TransactionType
} from '../common/Transaction';
import { addTransaction } from '../actions/blockchain';
import './RegisterDelegateContainer.css';
import { ErrorCode } from '../client/nodeClient';

export class RegisterDelegateContainer extends Component {
  componentDidMount() {
    let {active} = this.props;
    if (active.address === undefined) {
      toast.error('This page requires login', { position: toast.POSITION.BOTTOM_RIGHT });
      this.props.history.push('/');
    }
  }

  render() {
    let { active } = this.props;
    return (
      <div className="container">
        <div className="register-delegate">
          <RegisterDelegate 
            onConfirm={
              (name) => {
                let register = new RegisterDelegateTransaction(active.address);
                register.name = new Buffer(name, 'utf-8');
                let tx = new Transaction(TransactionType.RegisterDelegate, register);
                tx.setTimestamp();
                tx.sign(active.key);

                this.props.addTransaction([...tx.toBuffer()])
                .then((result) => {
                  toast.success("successed. register delegate transaction.", { position: toast.POSITION.BOTTOM_RIGHT });
                  this.props.history.push('/');
                })
                .catch((e) => {
                  console.log(e);
                  if (e.code) {
                    if (e.code === ErrorCode.E_TX_DELEGATE_ALREADY_REGISTER) {
                      toast.error('Already Register', { position: toast.POSITION.BOTTOM_RIGHT });
                      this.props.history.push('/');
                      return;
                    } else if (e.code === ErrorCode.E_TX_DELEGATE_NAME_INVALID) {
                      toast.error('Invalid Name', { position: toast.POSITION.BOTTOM_RIGHT });
                      return;
                    }
                  }
                  toast.error('failed. register delegate transaction.', { position: toast.POSITION.BOTTOM_RIGHT });
                });
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
    active: state.account.active
  };
}

const mapDispatchToProps = {
  addTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterDelegateContainer);