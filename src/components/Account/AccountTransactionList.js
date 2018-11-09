import React, { Component } from 'react';
import { connect } from "react-redux";
import { toFixed8Str, toAddressFromHash } from '../../common/blockchain';
import moment from 'moment';
import { TransactionLink, AccountLink } from '../../common/Links';
import { TransactionType, EnumToString } from '../../common/Transaction';

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
        <td>{EnumToString(TransactionType, tx.type)}</td>
        <td>{moment.unix(tx.created_time).fromNow()}</td>
        <td>-</td>
        <td>{this.renderAccountLink(toAddressFromHash(tx.data.from))}</td>
        <td>{toFixed8Str(tx.data.reward - tx.data.fee)}</td>
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
        let addr = toAddressFromHash(tx.data.to[0].addr);
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
    let from = toAddressFromHash(tx.data.from);
    if (from === this.props.address) {
      for (let addr in tx.data.to) {
        change -= tx.data.to[addr].amount + tx.data.fee;
      }
    } else {
      for (let i in tx.data.to) {
        if (this.props.address === toAddressFromHash(tx.data.to[i].addr)) {
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
        <td>{EnumToString(TransactionType, tx.type)}</td>
        <td>{moment.unix(tx.created_time).fromNow()}</td>
        <td>{this.renderAccountLink(from)}</td>
        <td>{this.renderTansferTo(change, tx)}</td>
        <td>{toFixed8Str(change)}</td>
      </tr>
    )
  }

  renderRegisterDelegate = (tx, index) => {
    return (
      <tr key={index}>
        <td scope="row">
          <TransactionLink hash={tx.hash} text={tx.hash.substr(0, 20) + '...'} />
        </td>
        <td>{EnumToString(TransactionType, tx.type)}</td>
        <td>{moment.unix(tx.created_time).fromNow()}</td>
        <td>{this.renderAccountLink(toAddressFromHash(tx.data.from))}</td>
        <td>-</td>
        <td>-{toFixed8Str(tx.data.fee)}</td>
      </tr>      
    )
  }

  renderLock = (tx, index) => {
    return (
      <tr key={index}>
        <td scope="row">
          <TransactionLink hash={tx.hash} text={tx.hash.substr(0, 20) + '...'} />
        </td>
        <td>{EnumToString(TransactionType, tx.type)}</td>
        <td>{moment.unix(tx.created_time).fromNow()}</td>
        <td>{this.renderAccountLink(toAddressFromHash(tx.data.from))}</td>
        <td>-</td>
        <td>{toFixed8Str(-(tx.data.locks + tx.data.fee))}</td>
      </tr>
    )
  }

  renderUnlock = (tx, index) => {
    return (
      <tr key={index}>
        <td scope="row">
          <TransactionLink hash={tx.hash} text={tx.hash.substr(0, 20) + '...'} />
        </td>
        <td>{EnumToString(TransactionType, tx.type)}</td>
        <td>{moment.unix(tx.created_time).fromNow()}</td>
        <td>{this.renderAccountLink(toAddressFromHash(tx.data.from))}</td>
        <td>-</td>
        <td>{toFixed8Str(tx.sub_data.lock - tx.data.fee)}</td>
      </tr>      
    )
  }

  renderVote = (tx, index) => {
    return (
      <tr key={index}>
        <td scope="row">
          <TransactionLink hash={tx.hash} text={tx.hash.substr(0, 20) + '...'} />
        </td>
        <td>{EnumToString(TransactionType, tx.type)}</td>
        <td>{moment.unix(tx.created_time).fromNow()}</td>
        <td>{this.renderAccountLink(toAddressFromHash(tx.data.from))}</td>
        <td>-</td>
        <td>{-toFixed8Str(tx.data.fee)}</td>        
      </tr>
    )
  }

  renderTransaction = (tx, index) => {
    switch (tx.type) {
      case TransactionType.Reward:
        return this.renderReward(tx, index);
      case TransactionType.Transfer:
        return this.renderTransfer(tx, index);
      case TransactionType.RegisterDelegate:
        return this.renderRegisterDelegate(tx, index);
      case TransactionType.Lock:
        return this.renderLock(tx, index);
      case TransactionType.Unlock:
        return this.renderUnlock(tx, index);
      case TransactionType.Vote:
        return this.renderVote(tx, index);
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
        <thead className="thead-light">
          <tr>
            <th scope="col">Hash</th>
            <th scope="col">Type</th>
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