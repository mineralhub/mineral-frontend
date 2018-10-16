import {loadBalance} from './account';

export const LOGIN_WITH_PRIVATE_KEY = 'LOGIN_WITH_PRIVATE_KEY';
export const LOGOUT = 'LOGOUT';

export const loginWithPrivateKey = (privateKey) => ({
  type: LOGIN_WITH_PRIVATE_KEY,
  privateKey
});

export const logout = () => ({
  type: LOGOUT
});

export const login = (privateKey) => async (dispatch, getstate) => {
  await dispatch(loginWithPrivateKey(privateKey));
  await dispatch(loadBalance());
}