import React, { Component } from 'react';
import { connect } from "react-redux";
import { TransactionLink } from '../../common/Links';
import { setTransactions } from '../../actions/blockchain';
import { getTxTypeString } from '../../common/Blockchain';
import moment from 'moment';

class TransactionList extends Component {
  render() {
    let { transactions = [] } = this.props;
    return (
    <ul className="list-group">
      {
        transactions.reverse().map((tx, index) => {
          return (
            <li key={index} className="list-group-item list-group-item-action flex-column align-items-start">
              <div className="d-flex w-100 justify-content-between">
                <TransactionLink hash={tx.hash} text={tx.hash.substr(0, 15)+'...'} />
                <small>{moment.unix(tx.timestamp).fromNow()}</small>
              </div>
              <p>{getTxTypeString(tx.type)}</p>
              <small>From : <a href="#">{tx.data.from.substr(0, 15) + '...'}</a></small>
            </li>
          );
        })
      }
    </ul>
    );
  }
}

function mapStateToProps(state) {
  return {
    transactions: state.blockchain.transactions
  };
}

const mapDispatchToProps = {
  setTransactions
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList);