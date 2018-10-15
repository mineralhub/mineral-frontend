import { SET_ACCOUNT } from '../actions/account';

const initialState = {
  address: undefined,
  balance: undefined,
};

export function account(state = initialState, action) {
  switch (action.type) {
    case SET_ACCOUNT: {
			return {
				...state,
        address: action.account.address,
        balance: action.account.balance
			}
		}

		default:
			return state;
  }
}
