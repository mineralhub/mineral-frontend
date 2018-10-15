import { publicKeyCreate, privateKeyVerify } from 'secp256k1';
import { LOGIN_WITH_PRIVATE_KEY } from '../actions/app';
import { PubKeyToAddress } from '../common/Blockchain';

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
          address: PubKeyToAddress(publicKeyCreate(Buffer.from(action.privateKey, 'hex'), false)),
          isLoggedIn: true
        }
      }
    }
    default:
    return state;
  }
}