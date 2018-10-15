import React, { Component } from 'react';
import { connect } from "react-redux";
import { LongToSatosi } from '../../common/Blockchain';
import moment from 'moment';

class Account extends Component {
  render() {
    let { account } = this.props;
    return (
      <div className="container">
        <dl className="row">
          <dt className="col col-sm-3">Address:</dt>
          <dd className="col col-sm-9">{account.address}</dd>
          <dt className="col col-sm-3">Balance:</dt>
          <dd className="col col-sm-9">{LongToSatosi(account.balance)}</dd>
        </dl>
      </div>
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