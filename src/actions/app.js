import {setActiveAccount, loadBalance} from './account';

export const LOGIN_WITH_PRIVATE_KEY = 'LOGIN_WITH_PRIVATE_KEY';
export const LOGOUT = 'LOGOUT';
export const SHOW_KEYSTORE_INPUT_MODAL = 'SHOW_KEYSTORE_INPUT_MODAL';
export const SHOW_SEND_TRANSACTION_MODAL = 'SHOW_SEND_TRANSACTION_MODAL';
export const SHOW_LOCK_TRANSACTION_MODAL = 'SHOW_LOCK_TRANSACTION_MODAL';

export const loginWithPrivateKey = (privateKey) => ({
  type: LOGIN_WITH_PRIVATE_KEY,
  privateKey
});

export const logout = () => ({
  type: LOGOUT
});

export const login = (privateKey) => async (dispatch, getState) => {
  await dispatch(loginWithPrivateKey(privateKey));

  let {app} = getState();
  await dispatch(setActiveAccount(app.account.address));
  await dispatch(loadBalance());
}

export const showKeystoreInputModal = (keystore) => ({
  type: SHOW_KEYSTORE_INPUT_MODAL,
  keystore
});

export const showSendTransactionModal = (show) => ({
  type: SHOW_SEND_TRANSACTION_MODAL,
  show
});

export const showLockTransactionModal = (show) => ({
  type: SHOW_LOCK_TRANSACTION_MODAL,
  show
})
