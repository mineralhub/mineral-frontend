import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { Header } from './components';
import { HomeContainer, TransactionContainer, BlockContainer, AccountContainer, CreateAccountContainer, RegisterDelegateContainer, DelegateListContainer } from './containers';
import { ToastContainer } from "react-toastify";
import InputPasswordModal from './components/Account/InputPasswordModal';
import { showKeystoreInputModal, showSendTransactionModal, showLockTransactionModal, showUnlockTransactionModal } from './actions/app';
import { login } from './actions/account';
import { toast } from 'react-toastify';
import { toFixed8Long, encryptKey, decryptString, generateMac } from './common/Blockchain';
import SendTransactionModal from './components/Transaction/SendTransactionModal';
import LockTransactionModal from './components/Transaction/LockTransactionModal';
import UnlockTransactionModal from './components/Transaction/UnlockTransactionModal';

import {
  TransferTransaction,
  LockTransaction,
  UnlockTransaction,
  Transaction,
  TransactionType
} from './common/Transaction';
import { addTransaction } from './actions/blockchain';
import { ErrorCode } from './client/nodeClient';

export class AppCmp extends Component {
  renderModal = () => {
    let { active, keystore, showModal } = this.props;
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
            let transfer = new TransferTransaction(active.address);
            transfer.to[state.to] = toFixed8Long(state.amount);
            if (transfer.to[state.to] === undefined) {
              toast.error('invalid amount.', { position: toast.POSITION.BOTTOM_RIGHT });
              return;
            }
            let tx = new Transaction(TransactionType.Transfer, transfer);
            tx.setTimestamp();
            tx.sign(active.key);

            this.props.addTransaction([...tx.toBuffer()])
            .then((result) => {
              toast.success("successed. transfer transaction.", { position: toast.POSITION.BOTTOM_RIGHT });
              this.props.showSendTransactionModal(false);
            })
            .catch((e) => {
              toast.error('failed. transfer transaction.', { position: toast.POSITION.BOTTOM_RIGHT });
            });
          }
        }
      />

      <LockTransactionModal
        isOpen={showModal.lockTransaction}
        onClose={
          () => {
            this.props.showLockTransactionModal(false);
          }
        }
        onConfirm={
          (state) => {
            let lock = new LockTransaction(active.address);
            lock.lockValue = toFixed8Long(state.amount);
            if (lock.lockValue === undefined) {
              toast.error('invalid amount.', { position: toast.POSITION.BOTTOM_RIGHT });
              return;
            }
            let tx = new Transaction(TransactionType.Lock, lock);
            tx.setTimestamp();
            tx.sign(active.key);
            this.props.addTransaction([...tx.toBuffer()])
            .then((result) => {
              toast.success("successed. lock transaction.", { position: toast.POSITION.BOTTOM_RIGHT });
              this.props.showLockTransactionModal(false);
            })
            .catch((e) => {
              toast.error('failed. lock transaction.', { position: toast.POSITION.BOTTOM_RIGHT });
            });
          }
        }
      />

      <UnlockTransactionModal 
        isOpen={showModal.unlockTransaction}
        onClose={
          () => {
            this.props.showUnlockTransactionModal(false);
          }
        }
        onConfirm={
          () => {
            let tx = new Transaction(TransactionType.Unlock, new UnlockTransaction(active.address));
            tx.setTimestamp();
            tx.sign(active.key);
            this.props.addTransaction([...tx.toBuffer()])
            .then((result) => {
              toast.success("successed. unlock transaction.", { position: toast.POSITION.BOTTOM_RIGHT });
              this.props.showUnlockTransactionModal(false);
            })
            .catch((e) => {
              this.props.showUnlockTransactionModal(false);
              if (e.code === ErrorCode.E_TX_LOCK_TTL_NOT_ARRIVED) {
                toast.error('failed. unlock transaction. TTL', { position: toast.POSITION.BOTTOM_RIGHT });  
                return;
              }
              toast.error('failed. unlock transaction.', { position: toast.POSITION.BOTTOM_RIGHT });
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
            <Route path="/delegate/register" component={RegisterDelegateContainer} />
            <Route path="/delegatelist" component={DelegateListContainer} />
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
    active: state.account.active,
    keystore: state.app.keystore,
    showModal: state.app.showModal
  };
};

const mapDispatchToProps = {
  login,
  showKeystoreInputModal,
  showSendTransactionModal,
  showLockTransactionModal,
  showUnlockTransactionModal,
  addTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppCmp);