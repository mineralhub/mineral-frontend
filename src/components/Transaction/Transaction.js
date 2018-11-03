import React, { Component } from 'react';
import { connect } from "react-redux";
import { getTxTypeString, toFixed8, getAddressFromAddressHash } from '../../common/Blockchain';
import { TransactionType } from '../../common/Transaction';
import { TransactionLink, AccountLink, BlockLink } from '../../common/Links';
import moment from 'moment';

class Transaction extends Component {
  renderReward = (transaction) => {
    return (
      <dl className="row">
        <dt className="col col-sm-3">To:</dt>
        <dd className="col col-sm-9">{toFixed8(transaction.data.reward)}</dd>
      </dl>
    );
  }

  renderTransfer = (transaction) => {
    return (
      <dl className="row">
        <dt className="col col-sm-3">To:</dt>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Address</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {
              transaction.data.to.map((v, idx) => {
                console.log(v);
                return (
                  <tr key={idx}>
                    <td scope="row">
                      <AccountLink
                        address={getAddressFromAddressHash(v.addr)}
                      />
                    </td>
                    <td>{toFixed8(v.amount)}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </dl>
    )
  }

  renderRegisterDelegate = (transaction) => {
    console.log(transaction);
    return (
      <dl className="row">
        <dt className="col col-sm-3">Name:</dt>
        <dd className="col col-sm-9">{(transaction.data.name)}</dd>
      </dl>
    );
  }

  renderLock = (transaction) => {
    return (
      <dl className="row">
        <dt className="col col-sm-3">Lock:</dt>
        <dd className="col col-sm-9">{toFixed8(transaction.data.locks)}</dd>
      </dl>
    );
  }

  renderTransactionData = (transaction) => {
    switch (transaction.type) {
      case TransactionType.Reward:
        return this.renderReward(transaction);
      case TransactionType.Transfer:
        return this.renderTransfer(transaction);
      case TransactionType.RegisterDelegate:
        return this.renderRegisterDelegate(transaction);
      case TransactionType.Lock:
        return this.renderLock(transaction);
      default:
        return (<div></div>);
    }
  }

  render() {
    let { transaction } = this.props;
    return (
      <div className="container">
        <dl className="row">
          <dt className="col col-sm-3">Type:</dt>
          <dd className="col col-sm-9">{getTxTypeString(transaction.type)}</dd>
          <dt className="col col-sm-3">Hash:</dt>
          <dd className="col col-sm-9">
            <TransactionLink
              hash={transaction.hash}
            />
          </dd>
          <dt className="col col-sm-3">Version:</dt>
          <dd className="col col-sm-9">{transaction.version}</dd>
          <dt className="col col-sm-3">Block Height:</dt>
          <dd className="col col-sm-9"><BlockLink height={transaction.block_height} /></dd>
          <dt className="col col-sm-3">Created Time:</dt>
          <dd className="col col-sm-9">
            {moment.unix(transaction.created_time).fromNow()}
            ({moment.unix(transaction.created_time).format("YYYY-MM-DD HH:mm Z")})
          </dd>
          <dt className="col col-sm-3">From:</dt>
          <dd className="col col-sm-9">
            <AccountLink
              address={getAddressFromAddressHash(transaction.data.from)}
            />
          </dd>
        </dl>
        {this.renderTransactionData(transaction)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    transaction: state.blockchain.transaction
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);