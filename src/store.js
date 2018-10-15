import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { createBrowserHistory } from 'history';

export const reduxHistory = createBrowserHistory({

});

export function configureStore() {
	const enhancer = compose(
		applyMiddleware(
			thunk,
		)
	)

	return createStore(combineReducers({...reducers}), enhancer);
}

export const store = configureStore();