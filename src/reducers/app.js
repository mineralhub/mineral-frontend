import { SHOW_KEYSTORE_INPUT_MODAL, SHOW_SEND_TRANSACTION_MODAL, SHOW_LOCK_TRANSACTION_MODAL, SHOW_UNLOCK_TRANSACTION_MODAL } from '../actions/app';

const initialState = {
  account: {
    key: undefined,
    address: undefined,
    isLoggedIn: false,
  },
  keystore: undefined,
  showModal: {
    sendTransaction: false,
    lockTransaction: false,
    unlockTransaction: false,
  }
};

export function app(state = initialState, action) {
  switch (action.type) {
    case SHOW_KEYSTORE_INPUT_MODAL: {
      return {
        ...state,
        keystore: action.keystore === undefined ? undefined : JSON.parse(action.keystore)
      }
    }
    case SHOW_SEND_TRANSACTION_MODAL: {
      return {
        ...state,
        showModal: {
          ...state.showModal,
          sendTransaction: action.show
        }
      }
    }
    case SHOW_LOCK_TRANSACTION_MODAL: {
      return {
        ...state,
        showModal: {
          ...state.showModal,
          lockTransaction: action.show
        }
      }
    }
    case SHOW_UNLOCK_TRANSACTION_MODAL: {
      return {
        ...state,
        showModal: {
          ...state.showModal,
          unlockTransaction: action.show
        }
      }
    }
    default:
    return state;
  }
}