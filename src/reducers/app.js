import { publicKeyCreate } from 'secp256k1';
import { LOGIN_WITH_PRIVATE_KEY, LOGOUT } from '../actions/app';
import { getAddressFromPubKey } from '../common/Blockchain';

const initialState = {
  account: {
    key: undefined,
    address: undefined,
    isLoggedIn: false
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
        account: initialState.account
      }
    }
    default:
    return state;
  }
}