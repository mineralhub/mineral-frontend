import React, { Component } from 'react';
import { connect } from "react-redux";
import { toFixed8, getAddressFromAddressHash } from '../../common/Blockchain';
import moment from 'moment';
import { TransactionLink, AccountLink } from '../../common/Links';
import { TransactionType } from '../../common/Transaction';

class AccountTransactionList extends Component {
  renderAccountLink = (addr) => {
    return (
      <AccountLink address={addr} text={addr.substr(0, 15) + '...'}/>
    );
  }

  renderReward = (tx, index) => {
    return (
      <tr key={index}>
        <td scope="row">
          <TransactionLink hash={tx.hash} text={tx.hash.substr(0, 20) + '...'} />
        </td>
        <td>{moment.unix(tx.created_time).fromNow()}</td>
        <td>-</td>
        <td>{this.renderAccountLink(getAddressFromAddressHash(tx.data.from))}</td>
        <td>{toFixed8(tx.data.reward)}</td>
      </tr>
    )
  }

  renderTansferTo = (change, tx) => {
    if (change < 0) {
      // sender is me.
      if (1 < tx.data.to.length) {
        return (
          <p>number of {tx.data.to.length}</p>
        )
      } else {
        let addr = getAddressFromAddressHash(tx.data.to[0].addr);
        return (
          this.renderAccountLink(addr)
        )
      }
    } else {
      // to is me.
      return (
        this.renderAccountLink(this.props.address)
      )
    }
  }

  renderTransfer = (tx, index) => {
    let change = 0;
    let from = getAddressFromAddressHash(tx.data.from);
    if (from === this.props.address) {
      for (let addr in tx.data.to) {
        change -= tx.data.to[addr].amount;
      }
    } else {
      for (let i in tx.data.to) {
        if (this.props.address === getAddressFromAddressHash(tx.data.to[i].addr)) {
          change = tx.data.to[i].amount;
          break;
        }
      }
    }

    return (
      <tr key={index}>
        <td scope="row">
          <TransactionLink hash={tx.hash} text={tx.hash.substr(0, 20) + '...'} />
        </td>
        <td>{moment.unix(tx.created_time).fromNow()}</td>
        <td>{this.renderAccountLink(from)}</td>
        <td>{this.renderTansferTo(change, tx)}</td>
        <td>{toFixed8(change)}</td>
      </tr>
    )
  }

  renderLock = (tx, index) => {
    return (
      <tr key={index}>
        <td scope="row">
          <TransactionLink hash={tx.hash} text={tx.hash.substr(0, 20) + '...'} />
        </td>
        <td>{moment.unix(tx.created_time).fromNow()}</td>
        <td>{this.renderAccountLink(getAddressFromAddressHash(tx.data.from))}</td>
        <td>-</td>
        <td>{toFixed8(-tx.data.locks)}</td>
      </tr>
    )
  }

  renderTransaction = (tx, index) => {
    switch (tx.type) {
      case TransactionType.Reward:
        return this.renderReward(tx, index);
      case TransactionType.Transfer:
        return this.renderTransfer(tx, index);
      case TransactionType.Lock:
        return this.renderLock(tx, index);
      default:
        return (<div></div>);
    }
  }

  render() {
    let { transactions } = this.props;
    if (transactions === undefined) {
      return (<div></div>);
    }
    return (
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Hash</th>
            <th scope="col">Age</th>
            <th scope="col">From</th>
            <th scope="col">To</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          {
            transactions.map(this.renderTransaction)
          }
        </tbody>
      </table>
    )
  }
}

function mapStateToProps(state) {
  return {
    transactions: state.blockchain.addressTransactions
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountTransactionList);