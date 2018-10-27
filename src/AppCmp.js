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
import { encryptKey, decryptString, generateMac } from './common/Blockchain';
import SendTransactionModal from './components/Transaction/SendTransactionModal';

export class AppCmp extends Component {
  renderModal = () => {
    let { keystore, showModal } = this.props;
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
    keystore: state.app.keystore,
    showModal: {
      sendTransaction: state.app.showModal.sendTransaction
    }
  };
};

const mapDispatchToProps = {
  login,
  showKeystoreInputModal,
  showSendTransactionModal
};

export default connect(mapStateToProps, mapDispatchToProps)(AppCmp);