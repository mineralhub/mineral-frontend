import { SET_TRANSACTION_PENDING, SET_TRANSACTION_FAILURE, SET_TRANSACTION_SUCCESS, 
  SET_BLOCK_PENDING, SET_BLOCK_FAILURE, SET_BLOCK_SUCCESS,
  SET_TRANSACTIONS_FROM_ADDRESS_PENDING, SET_TRANSACTIONS_FROM_ADDRESS_FAILURE, SET_TRANSACTIONS_FROM_ADDRESS_SUCCESS } from "../actions/blockchain";
import { SET_ACCOUNT_PENDING, SET_ACCOUNT_FAILURE, SET_ACCOUNT_SUCCESS } from "../actions/account";

const initialState = {
  setBlock: undefined,
  setTransaction: undefined,
  setAccount: undefined,
}

export function network(state = initialState, action) {
  switch (action.type) {
    case SET_TRANSACTION_PENDING:
    case SET_TRANSACTION_FAILURE:
    case SET_TRANSACTION_SUCCESS: {
      return {
        ...state,
        setTransaction: action.type
      }
    }

    case SET_BLOCK_PENDING:
    case SET_BLOCK_FAILURE:
    case SET_BLOCK_SUCCESS: {
      return {
        ...state,
        setBlock: action.type
      }
    }

    case SET_TRANSACTIONS_FROM_ADDRESS_PENDING:
    case SET_TRANSACTIONS_FROM_ADDRESS_FAILURE:
    case SET_TRANSACTIONS_FROM_ADDRESS_SUCCESS: {
      return {
        ...state,
        setTransactionsFromAddress: action.type
      }
    }

    case SET_ACCOUNT_PENDING:
    case SET_ACCOUNT_FAILURE:
    case SET_ACCOUNT_SUCCESS: {
      return {
        ...state,
        setAccount: action.type
      }
    }

    default:
      return state;
  }
}