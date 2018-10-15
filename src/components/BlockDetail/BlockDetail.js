import React, { Component } from 'react';
import { connect } from "react-redux";
import moment from 'moment';

class BlockDetail extends Component {
  render() {
    let { block } = this.props;
    console.log(block);
    return (
      <div className="container">
        <dl className="row">
          <dt className="col col-sm-3">Height:</dt>
          <dd className="col col-sm-9">{block.height}</dd>
          <dt className="col col-sm-3">Hash:</dt>
          <dd className="col col-sm-9">{block.hash}</dd>
          <dt className="col col-sm-3">Previous Hash:</dt>
          <dd className="col col-sm-9">{block.prevhash}</dd>
          <dt className="col col-sm-3">Version:</dt>
          <dd className="col col-sm-9">{block.version}</dd>
          <dt className="col col-sm-3">Created Time:</dt>
          <dd className="col col-sm-9">
            {moment.unix(block.created_time).fromNow()}
            ({moment.unix(block.created_time).format("YYYY-MM-DD HH:mm Z")})
          </dd>
          <dt className="col col-sm-3">Transactions:</dt>
          <dd className="col col-sm-9">{block.transactions}</dd>
        </dl>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    block: state.blockchain.block
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockDetail);