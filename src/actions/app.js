export const SHOW_KEYSTORE_INPUT_MODAL = 'SHOW_KEYSTORE_INPUT_MODAL';
export const SHOW_SEND_TRANSACTION_MODAL = 'SHOW_SEND_TRANSACTION_MODAL';
export const SHOW_LOCK_TRANSACTION_MODAL = 'SHOW_LOCK_TRANSACTION_MODAL';

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
