import React, { Component } from 'react';
import {connect} from 'react-redux';
import { BlockList, TransactionList } from '../components';
import io from 'socket.io-client';
import { loadBlocks, loadTransactions } from '../actions/blockchain';
import './HomeContainer.css';

export class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket : io('http://localhost:3001')
    };
    const {dispatch} = this.props;
    dispatch(loadBlocks(this.state.socket));
    dispatch(loadTransactions(this.state.socket));
  }

  componentWillUnmount() {
    this.state.socket.disconnect();
  }

  render() {
    return (
      <div className="home">
        <div className="container">
          <div className="row">
            <div className="col-md">
              @ Block List
              <div className="viewbox">
                <BlockList/>
              </div>
            </div>
            <div className="col-md">
              @ Transaction List
              <div className="viewbox">
                <TransactionList/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state = {}) => {
  return {...state};
};

export default connect(mapStateToProps)(HomeContainer);