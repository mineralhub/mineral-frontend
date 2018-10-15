import axios from 'axios';

export const SET_BLOCKS = 'SET_BLOCKS';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const SET_TRANSACTION_PENDING = 'SET_TRANSACTION_PENDING';
export const SET_TRANSACTION_SUCCESS = 'SET_TRANSACTION_SUCCESS';
export const SET_TRANSACTION_FAILURE = 'SET_TRANSACTION_FAILURE';
export const SET_TRANSACTION = 'SET_TRANSACTION';

export const SET_BLOCK_PENDING = 'SET_BLOCK_PENDING';
export const SET_BLOCK_SUCCESS = 'SET_BLOCK_SUCCESS';
export const SET_BLOCK_FAILURE = 'SET_BLOCK_FAILURE';
export const SET_BLOCK = 'SET_BLOCK';

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
	return (dispatch) => {
		dispatch(setTransactionPending());
		axios.get(`http://127.0.0.1:80/transaction/${hash}`)
			.then((response) => {
				dispatch(setTransaction(response.data));
				dispatch(setTransactionSuccess());
			}).catch((error) => {
				dispatch(setTransactionFailure());
			});
	}
}

export const loadBlock = (hash) => {
	return (dispatch) => {
		dispatch(setBlockPending());
		axios.get(`http://127.0.0.1:80/block/${hash}`)
			.then((response) => {
				dispatch(setBlock(response.data));
				dispatch(setBlockSuccess());
			}).catch((error) => {
				dispatch(setBlockFailure());
			});
	}
}