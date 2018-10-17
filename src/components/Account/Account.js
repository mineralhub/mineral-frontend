import React, { Component } from 'react';
import { connect } from "react-redux";
import { longToSatosi } from '../../common/Blockchain';
import { AccountLink } from '../../common/Links';

class Account extends Component {
  render() {
    let { account } = this.props;
    return (
      <dl className="row">
        <dt className="col col-sm-3">Address:</dt>
        <dd className="col col-sm-9"><AccountLink address={account.address} /></dd>
        <dt className="col col-sm-3">Balance:</dt>
        <dd className="col col-sm-9">{longToSatosi(account.balance)}</dd>
      </dl>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.account
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);