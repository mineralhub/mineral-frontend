import { publicKeyCreate } from 'secp256k1';
import { LOGIN_WITH_PRIVATE_KEY, LOGOUT, SHOW_KEYSTORE_INPUT_MODAL, SHOW_SEND_TRANSACTION_MODAL } from '../actions/app';
import { getAddressFromPubKey } from '../common/Blockchain';

const initialState = {
  account: {
    key: undefined,
    address: undefined,
    isLoggedIn: false,
  },
  keystore: undefined,
  showModal: {
    sendTransaction: false
  }
};

export function app(state = initialState, action) {
  switch (action.type) {
    case LOGIN_WITH_PRIVATE_KEY: {
      return {
        ...state,
        account: {
          key: action.privateKey,
          address: getAddressFromPubKey(publicKeyCreate(Buffer.from(action.privateKey, 'hex'), false)),
          isLoggedIn: true
        }
      }
    }
    case LOGOUT: {
      return {
        ...state,
        account: initialState.account,
        keystore: undefined
      }
    }
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
          sendTransaction: action.show
        }
      }
    }
    default:
    return state;
  }
}