import React, { Component } from 'react';
import { connect } from "react-redux";
import { BlockLink } from '../../common/Links';
import { setBlocks } from '../../actions/blockchain';
import moment from 'moment';

class BlockList extends Component {
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
    let { blocks = [] } = this.props;
    return (
    <ul className="list-group">
      {
        blocks.map((block, index) => {
          return (
            <li key={index} className="list-group-item list-group-item-action flex-column align-items-start">
              <div className="d-flex w-100 justify-content-between">
                <BlockLink height={block.header.height} />
                <small>{moment.unix(block.header.timestamp).fromNow()}</small>
              </div>
              <p>Transactions : {block.transactions.length}</p>
              <small>Produced by : <a href="#">Skypeople</a></small>
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
    blocks: state.blockchain.blocks
  };
}

const mapDispatchToProps = {
  setBlocks
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockList);