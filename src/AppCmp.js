import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { Header } from './components';
import { HomeContainer, TransactionContainer, BlockContainer, AccountContainer, CreateAccountContainer } from './containers';
import { ToastContainer } from "react-toastify";
import InputPasswordModal from './components/Account/InputPasswordModal';
import { login, showKeystoreInputModal, showSendTransactionModal } from './actions/app';
import { toast } from 'react-toastify';
import { toFixed8Long, encryptKey, decryptString, generateMac } from './common/Blockchain';
import SendTransactionModal from './components/Transaction/SendTransactionModal';

import {
  TransferTransaction,
  Transaction,
  TransactionType
} from './common/Transaction';
import { sendTo } from './actions/blockchain';

export class AppCmp extends Component {
  renderModal = () => {
    let { account, keystore, showModal } = this.props;
    return (
      <div>
      <InputPasswordModal
        isOpen={keystore !== undefined}
        onClose={
          () => {
            this.props.showKeystoreInputModal(undefined);
          }
        }
        onConfirm={
          (password) => {
            let key = encryptKey(password, keystore.crypto.kdf.params, keystore.crypto.kdf.alg);
            let mac = generateMac(keystore.crypto.cipher.text, key);
            if (mac === keystore.crypto.mac) {
              let privateKey = decryptString(keystore.crypto.cipher.text, key, keystore.crypto.cipher.params.iv, keystore.crypto.cipher.alg);
              this.props.login(privateKey).then(() => {
                toast.success("Success Login", { position: toast.POSITION.BOTTOM_RIGHT });
              });
              this.props.showKeystoreInputModal(undefined);  
            } else  {
              toast.error("Failed Login. Check password.", { position: toast.POSITION.BOTTOM_RIGHT });
            }
          }
        }
      />

      <SendTransactionModal
        isOpen={showModal.sendTransaction}
        onClose={
          () => {
            this.props.showSendTransactionModal(false);
          }
        }
        onConfirm={
          (state) => {
            let transfer = new TransferTransaction(account.address);
            transfer.to[state.to] = toFixed8Long(state.amount);
            if (transfer.to[state.to] === undefined) {
              toast.error('invalid amount.', { position: toast.POSITION.BOTTOM_RIGHT });
              return;
            }
            let tx = new Transaction(TransactionType.Transfer, transfer);
            tx.setTimestamp();
            tx.sign(account.key);
            console.log(tx);
            this.props.sendTo([...tx.toBuffer()]).then((result) => {
              console.log(result);
            });
          }
        }
      />
      </div>
    )
  }

  render() {
    return (
      <Router>
        <div>
          <Header />
          <Switch>
            <Route exact path="/" component={HomeContainer} />
            <Route path="/transaction/:hash" component={TransactionContainer} />
            <Route path="/block/:height" component={BlockContainer} />
            <Route path="/account/create" component={CreateAccountContainer} />
            <Route path="/account/:address" component={AccountContainer} />
          </Switch>
          <ToastContainer />
          {this.renderModal()}
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account: state.app.account,
    keystore: state.app.keystore,
    showModal: {
      sendTransaction: state.app.showModal.sendTransaction
    }
  };
};

const mapDispatchToProps = {
  login,
  showKeystoreInputModal,
  showSendTransactionModal,
  sendTo
};

export default connect(mapStateToProps, mapDispatchToProps)(AppCmp);