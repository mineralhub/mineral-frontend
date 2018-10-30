import { SET_ACTIVE_ACCOUNT, SET_ACCOUNT, SET_BALANCE } from '../actions/account';

const initialState = {
  address: undefined,
  balance: undefined,
  active: {
    address: undefined,
    balance: undefined
  }
};

export function account(state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE_ACCOUNT: {
      return {
        ...state,
        active: {
          address: action.address
        }
      }
    }

    case SET_ACCOUNT: {
			return {
        ...state,
        address: action.address,
        balance: action.account.balance
			}
    }
    
    case SET_BALANCE: {
      return {
        ...state, 
        active: {
          ...state.active,
          balance: action.balance
        }
      }
    }

		default:
			return state;
  }
}
