import React, { Component } from 'react';
import { connect } from "react-redux";
import { TransactionLink, AccountLink } from '../../common/Links';
import { setTransactions } from '../../actions/blockchain';
import { getTxTypeString, getAddressFromAddressHash } from '../../common/Blockchain';
import moment from 'moment';

class TransactionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: moment()
    }
  }

  tick() {
    this.setState({
      time: moment()
    })
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let { transactions = [] } = this.props;
    return (
    <ul className="list-group">
      {
        transactions.map((tx, index) => {
          return (
            <li key={index} className="list-group-item list-group-item-action flex-column align-items-start">
              <div className="d-flex w-100 justify-content-between">
                <span className="d-inline-block text-truncate" style={{maxWidth:"300px"}}>
                  <TransactionLink hash={tx.hash} />
                </span>
                <small>{moment.unix(tx.timestamp).fromNow()}</small>
              </div>
              <p>{getTxTypeString(tx.type)}</p>
              <small>From : <AccountLink address={getAddressFromAddressHash(tx.data.from)}/></small>
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