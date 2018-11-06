import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Vote } from '../components';
import {
	VoteTransaction,
	Transaction,
	TransactionType
} from '../common/Transaction';
import { loadDelegates, SET_DELEGATES_PENDING, SET_DELEGATES_SUCCESS, SET_DELEGATES_FAILURE } from '../actions/blockchain';
import './VoteContainer.css';
import { ErrorCode } from '../client/nodeClient';

export class VoteContainer extends Component {
	componentDidMount() {
		let { match } = this.props;
    this.load();
  }

  load = async() => {
		const {dispatch} = this.props;
		dispatch(await loadDelegates());
	}
	
	render() {
		let { active, delegates, setDelegates } = this.props;
		if (setDelegates === SET_DELEGATES_PENDING) {
			return (
				<div>LOADING!</div>
			);
		} else if (setDelegates === SET_DELEGATES_SUCCESS) {
			return (
				<div className="container">
					<div className="vote">
						<Vote delegates={delegates}></Vote>
					</div>
				</div>
			);
		} else if (setDelegates === SET_DELEGATES_FAILURE) {
		}
		return <div></div>
	}
}

function mapStateToProps(state) {
	return {
		active: state.account.active,
		delegates: state.blockchain.delegates,
		setDelegates: state.network.setDelegates
	};
}

export default connect(mapStateToProps)(VoteContainer);