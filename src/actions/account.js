export const LOGOUT = 'LOGOUT';
export const LOGIN_WITH_PRIVATE_KEY = 'LOGIN_WITH_PRIVATE_KEY';
export const SET_ACTIVE_BALANCE = 'SET_ACTIVE_BALANCE';
export const SET_ACCOUNT = 'SET_ACCOUNT';
export const SET_ACCOUNT_PENDING = 'SET_ACCOUNT_PENDING';
export const SET_ACCOUNT_SUCCESS = 'SET_ACCOUNT_SUCCESS';
export const SET_ACCOUNT_FAILURE = 'SET_ACCOUNT_FAILURE';

const cli = require('./../client/nodeClient');

export const loginWithPrivateKey = (prikey) => ({
  type: LOGIN_WITH_PRIVATE_KEY,
  prikey
});

export const setActiveBalance = (balance, lock) => ({
  type: SET_ACTIVE_BALANCE,
  balance: balance,
  lock: lock
});

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

export const login = (prikey) => async (dispatch, getState) => {
  await dispatch(loginWithPrivateKey(prikey));
  await dispatch(loadActiveBalance());
};

export const logout = () => ({
  type: LOGOUT
});

export const loadActiveBalance = () => async (dispatch, getState) => {
  let {account} = getState();
  if (account.active.address) {
    try {
      let res = await cli.loadBalance(account.active.address.toString('hex'));
      dispatch(setActiveBalance(res.data.balance, res.data.lock));
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