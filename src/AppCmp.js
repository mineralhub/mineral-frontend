import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { Header } from './components';
import { HomeContainer, TransactionContainer, BlockContainer, AccountContainer, CreateAccountContainer } from './containers';
import { ToastContainer } from "react-toastify";
import InputPasswordModal from './components/Account/InputPasswordModal';
import { login, showKeystoreInputModal } from './actions/app';
import { toast } from 'react-toastify';
import { encryptKey, decryptString } from './common/Blockchain';

export class AppCmp extends Component {
  renderModal = () => {
    let { keystore } = this.props;
    return (
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
            let privateKey = decryptString(keystore.crypto.cipher.text, key, keystore.crypto.cipher.params.iv, keystore.crypto.cipher.alg);
            this.props.login(privateKey).then(() => {
              toast.success("Success Login", { position: toast.POSITION.BOTTOM_RIGHT });
            });
            this.props.showKeystoreInputModal(undefined);
          }
        }
      />
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
    keystore: state.app.keystore
  };
};

const mapDispatchToProps = {
  login,
  showKeystoreInputModal
};

export default connect(mapStateToProps, mapDispatchToProps)(AppCmp);