import { publicKeyCreate } from 'secp256k1';
import { getAddressFromPubKey } from '../common/Blockchain';
import { LOGIN_WITH_PRIVATE_KEY, LOGOUT, SET_ACCOUNT, SET_ACTIVE_BALANCE } from '../actions/account';

const initialState = {
  address: undefined,
  balance: undefined,
  lock: undefined,
  active: {
    key: undefined,
    address: undefined,
    balance: undefined,
    lock: undefined
  }
};

export function account(state = initialState, action) {
  switch (action.type) {
    case LOGIN_WITH_PRIVATE_KEY: {
      return {
        ...state,
        active: {
          ...state.active,
          key: action.prikey,
          address: getAddressFromPubKey(publicKeyCreate(Buffer.from(action.prikey, 'hex'), false)),
        }
      }
    }

    case LOGOUT: {
      return {
        ...state,
        active: initialState.active,
      }
    }

    case SET_ACCOUNT: {
			return {
        ...state,
        address: action.address,
        balance: action.account.balance,
        lock: action.account.lock
			}
    }
    
    case SET_ACTIVE_BALANCE: {
      return {
        ...state, 
        active: {
          ...state.active,
          balance: action.balance,
          lock: action.lock
        }
      }
    }

		default:
			return state;
  }
}
