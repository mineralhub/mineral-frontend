import { SET_BLOCKS, SET_TRANSACTIONS, SET_TRANSACTION, SET_BLOCK	} from '../actions/blockchain';

const initialState = {
	blocks: []
};

export function blockchain(state = initialState, action) {
	console.log(action);

  switch (action.type) {
    case SET_BLOCKS: {
			return {
				...state,
				blocks: action.blocks.block,
			}
		}
		case SET_TRANSACTIONS: {
			return {
				...state,
				transactions: action.transactions.transaction,
			}
		}
		case SET_TRANSACTION: {
			return {
				...state,
				transaction: action.transaction,
			}
		}
		case SET_BLOCK: {
			return {
				...state,
				block: action.block,
			}
		}
		
		default:
			return state;
  }
}