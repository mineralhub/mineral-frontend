export const SET_BALANCE = 'SET_BALANCE';

export const SET_ACTIVE_ACCOUNT = 'SET_ACTIVE_ACCOUNT';
export const SET_ACCOUNT = 'SET_ACCOUNT';
export const SET_ACCOUNT_PENDING = 'SET_ACCOUNT_PENDING';
export const SET_ACCOUNT_SUCCESS = 'SET_ACCOUNT_SUCCESS';
export const SET_ACCOUNT_FAILURE = 'SET_ACCOUNT_FAILURE';

const cli = require('./../client/nodeClient');

export const setBalance = (balance) => ({
  type: SET_BALANCE,
  balance: balance.balance
});

export const setActiveAccount = (address) => ({
  type: SET_ACTIVE_ACCOUNT,
  address
})

export const setAccount = (address, account) => ({
  type: SET_ACCOUNT,
  account,
  address
});

export const setAccountPending = () => ({
  type: SET_ACCOUNT_PENDING
});

export const setAccountSuccess = () => ({
  type: SET_ACCOUNT_SUCCESS
});

export const setAccountFailure = () => ({
  type: SET_ACCOUNT_FAILURE
});

export const loadBalance = () => async (dispatch, getState) => {
  let {app} = getState();
  if (app.account.isLoggedIn) {
    try {
      let res = await cli.loadBalance(app.account.address.toString('hex'));
      dispatch(setBalance(res.data));
    }
    catch (e) {
      throw e;
    }
  }
};

export const loadAccount = (address) => {
	return async (dispatch) => {
    try {
      dispatch(setAccountPending());
      let res = await cli.loadAccount(address);
      dispatch(setAccount(address, res.data));
      dispatch(setAccountSuccess());
    } catch (e) {
      dispatch(setAccountFailure());
      throw e;
    }
	}
};