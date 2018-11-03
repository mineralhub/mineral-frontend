export const SET_BLOCKS = 'SET_BLOCKS';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const SET_TRANSACTION_PENDING = 'SET_TRANSACTION_PENDING';
export const SET_TRANSACTION_SUCCESS = 'SET_TRANSACTION_SUCCESS';
export const SET_TRANSACTION_FAILURE = 'SET_TRANSACTION_FAILURE';
export const SET_TRANSACTION = 'SET_TRANSACTION';

export const SET_TRANSACTIONS_FROM_ADDRESS_PENDING = 'SET_TRANSACTIONS_FROM_ADDRESS_PENDING';
export const SET_TRANSACTIONS_FROM_ADDRESS_SUCCESS = 'SET_TRANSACTIONS_FROM_ADDRESS_SUCCESS';
export const SET_TRANSACTIONS_FROM_ADDRESS_FAILURE = 'SET_TRANSACTIONS_FROM_ADDRESS_FAILURE';
export const SET_TRANSACTIONS_FROM_ADDRESS = 'SET_TRANSACTIONS_FROM_ADDRESS';

export const SET_BLOCK_PENDING = 'SET_BLOCK_PENDING';
export const SET_BLOCK_SUCCESS = 'SET_BLOCK_SUCCESS';
export const SET_BLOCK_FAILURE = 'SET_BLOCK_FAILURE';
export const SET_BLOCK = 'SET_BLOCK';

const cli = require('./../client/nodeClient');

export const setBlocks = (blocks = []) => ({
  type: SET_BLOCKS,
  blocks
});

export const setTransactions = (transactions = []) => ({
	type: SET_TRANSACTIONS,
	transactions
});

export const setTransaction = (transaction) => ({
	type: SET_TRANSACTION,
	transaction
});

export const setTransactionPending = () => ({
	type: SET_TRANSACTION_PENDING
});

export const setTransactionSuccess = () => ({
	type: SET_TRANSACTION_SUCCESS
});

export const setTransactionFailure = () => ({
	type: SET_TRANSACTION_FAILURE
});

export const setTransactionsFromAddress = (transactions) => ({
	type: SET_TRANSACTIONS_FROM_ADDRESS,
	transactions
});

export const setTransactionsFromAddressPending = () => ({
	type: SET_TRANSACTIONS_FROM_ADDRESS_PENDING
});

export const setTransactionsFromAddressSuccess = () => ({
	type: SET_TRANSACTIONS_FROM_ADDRESS_SUCCESS
});

export const setTransactionsFromAddressFailure = () => ({
	type: SET_TRANSACTIONS_FROM_ADDRESS_FAILURE
});

export const setBlock = (block) => ({
	type: SET_BLOCK,
	block
});

export const setBlockPending = () => ({
	type: SET_BLOCK_PENDING
});

export const setBlockSuccess = () => ({
	type: SET_BLOCK_SUCCESS
});

export const setBlockFailure = () => ({
	type: SET_BLOCK_FAILURE
});

export const loadBlocks = (socket) => {
	return (dispatch) => {
		socket.on('lastblocks', (recv) => {
			dispatch(setBlocks(recv));
		});
	}
}

export const loadTransactions = (socket) => {
	return (dispatch) => {
		socket.on('lasttransactions', (recv) => {
			dispatch(setTransactions(recv));
		});
	}
}

export const loadTransaction = (hash) => {
	return async (dispatch) => {
		try {
			dispatch(setTransactionPending());
			let res = await cli.loadTransaction(hash);
			dispatch(setTransaction(res.data));
			dispatch(setTransactionSuccess());
		} catch (e) {
			dispatch(setTransactionFailure());
			throw e;
		}
	}
}

export const loadTransactionFromAddress = (address, page) => {
	return async (dispatch) => {
		try {
			dispatch(setTransactionsFromAddressPending());
			let res = await cli.loadTransactionFromAddress(address, page);
			dispatch(setTransactionsFromAddress(res.data === '' ? undefined : res.data));
			dispatch(setTransactionsFromAddressSuccess());
		} catch (e) {
			dispatch(setTransactionsFromAddressFailure());
			throw e;
		}
	}
}

export const loadBlock = (height) => {
	return async (dispatch) => {
		try {
			dispatch(setBlockPending());
			let res = await cli.loadBlock(height);
			dispatch(setBlock(res.data));
			dispatch(setBlockSuccess());
		} catch (e) {
			dispatch(setBlockFailure());
			throw e;
		}
	}
}

export const addTransaction = (bytes) => async (dispatch, getState) => {
	try {
		let res = await cli.addTransaction(bytes);
		return res.data;
	} catch (e) {
		throw e;
	}
}