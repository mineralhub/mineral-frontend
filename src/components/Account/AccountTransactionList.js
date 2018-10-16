import React, { Component } from 'react';
import { connect } from "react-redux";
import { lognToSatosi, getAddressFromAddressHash } from '../../common/Blockchain';
import moment from 'moment';
import { TransactionLink, AccountLink } from '../../common/Links';

class AccountTransactionList extends Component {
  renderRewardTransaction = (tx, index) => {
    return (
      <tr key={index}>
        <td scope="row">
          <TransactionLink hash={tx.hash} text={tx.hash.substr(0, 20) + '...'} />
        </td>
        <td>{moment.unix(tx.created_time).fromNow()}</td>
        <td>-</td>
        <td><AccountLink
            address={getAddressFromAddressHash(tx.data.from)} 
          />
        </td>
        <td>{lognToSatosi(tx.data.reward)}</td>
      </tr>
    )
  }

  renderTransaction = (tx, index) => {
    switch (tx.type) {
      case 1:
        return this.renderRewardTransaction(tx, index);
      case 2:
    }
    return (<div></div>);
  }

  render() {
    let { transactions } = this.props;
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