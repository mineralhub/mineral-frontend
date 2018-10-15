import axios from 'axios';

export const SET_BALANCE = 'SET_BALANCE';

export const SET_ACCOUNT = 'SET_ACCOUNT';
export const SET_ACCOUNT_PENDING = 'SET_ACCOUNT_PENDING';
export const SET_ACCOUNT_SUCCESS = 'SET_ACCOUNT_SUCCESS';
export const SET_ACCOUNT_FAILURE = 'SET_ACCOUNT_FAILURE';

export const setBalance = (wallet) => ({
  type: SET_BALANCE,
  wallet
});

export const setAccount = (account) => ({
  type: SET_ACCOUNT,
  account
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
    let response = await axios.get(`http://127.0.0.1:80/account/balance/${app.account.address.toString('hex')}`);
    dispatch(setBalance(response.data));
  }
};

export const loadAccount = (address) => {
	return (dispatch) => {
    dispatch(setAccountPending());
    console.log(address);
		axios.get(`http://127.0.0.1:80/account/${address}`)
			.then((response) => {
				dispatch(setAccount(response.data));
				dispatch(setAccountSuccess());
			}).catch((error) => {
				dispatch(setAccountFailure());
			});
	}
};