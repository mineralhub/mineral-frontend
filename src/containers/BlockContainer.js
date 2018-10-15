import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Block } from '../components';
import { loadBlock,
  SET_BLOCK_PENDING, SET_BLOCK_SUCCESS, SET_BLOCK_FAILURE } from '../actions/blockchain';
import './BlockContainer.css';

export class BlockContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { match } = this.props;
    this.load(match.params.hash);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.key !== this.props.location.key) {
      this.load(nextProps.match.params.hash);
    }
  }

  load = async (hash) => {
    const {dispatch} = this.props;
    dispatch(await loadBlock(hash));
  }

  render() {
    let { setBlock } = this.props;
    if (setBlock === SET_BLOCK_PENDING) {
      return (
        <div>LOADING!</div>
      );
    } else if (setBlock === SET_BLOCK_SUCCESS) {
      return (
        <div className="block">
          <div className="container">
            <Block />
          </div>
        </div>
      );
    } else if (setBlock === SET_BLOCK_FAILURE) {
    }
    return <div></div>
  }
}

function mapStateToProps(state) {
  return {
    setBlock: state.network.setBlock
  };
}

export default connect(mapStateToProps)(BlockContainer);