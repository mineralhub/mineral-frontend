import React, { Component } from 'react';
import { connect } from "react-redux";
import { LongToSatosi } from '../../common/Blockchain';
import moment from 'moment';
import { TransactionLink } from '../../common/Links';

class AccountTransactionList extends Component {
  render() {
    let { transactions } = this.props;
    console.log(transactions);
    return (
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Hash</th>
            <th scope="col">Age</th>
          </tr>
        </thead>
        <tbody>
          {
            transactions.map((tx, index) => {
              return (
                <tr key={index}>
                  <td scope="row">
                  <TransactionLink hash={tx.hash} text={tx.hash.substr(0, 20)+'...'} />
                  </td>
                  <td>{moment.unix(tx.created_time).fromNow()}</td>
                </tr>
              );
            })
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