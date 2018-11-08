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
import { addTransaction } from '../actions/blockchain';
import { toFixed8Long, isZero } from '../common/Blockchain';

export class VoteContainer extends Component {
	componentDidMount() {
    this.load();
  }

  load = async() => {
		await this.props.loadDelegates();
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
						<Vote delegates={delegates} active={active} 
							onConfirm = {
								(vote) => {
									let txvote = new VoteTransaction(active.address);
									for (let k in vote) {
										let v = toFixed8Long(vote[k]);;
										if (v === undefined) {
											toast.error("Has invalid value. " + k, { position: toast.POSITION.BOTTOM_RIGHT });
											return;
										}
										if (v.toNumber() === 0) {
											continue;
										}

										txvote.votes[k] = v;
									}
									console.log(txvote);
									let tx = new Transaction(TransactionType.Vote, txvote);
									tx.setTimestamp();
									tx.sign(active.key);

									this.props.addTransaction([...tx.toBuffer()])
									.then((result) => {
										toast.success("successed. vote transaction.", { position: toast.POSITION.BOTTOM_RIGHT });
									})
									.catch((e) => {
										console.log(e);
										toast.error('failed. vote transaction.', { position: toast.POSITION.BOTTOM_RIGHT });
									});
								}
							}
						/>
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

const mapDispatchToProps = {
	addTransaction,
	loadDelegates
};

export default connect(mapStateToProps, mapDispatchToProps)(VoteContainer);