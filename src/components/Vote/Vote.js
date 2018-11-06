import React, { Component } from 'react';
import { connect } from "react-redux";
import { Table, Button } from 'reactstrap';
import { AccountLink } from '../../common/Links';

class Vote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vote: {}
    }
  }

  isConfirmValid = () => {
		for (let k in this.state.vote) {
			if (0 < this.state.vote[k])
				return true;
		}
		return false;
  }

  onConfirm = () => {
    let { onConfirm } = this.props;
    onConfirm(this.state.vote);
  }

  onStartVoting = () => {
    console.log('??');
  }

  renderStartVote() {
    return (
      <div className="text-center">
      <a onClick={this.onStartVoting}>
        Start Voting
      </a>
      </div>
    )
  }

  render() {
    let { delegates, active } = this.props;
    if (delegates === undefined) {
      return (<div></div>)
    }
    let allvote = 0;
    for (let k in delegates) {
      allvote += delegates[k].total_vote;
    }

    return (
      <div>
        {this.renderStartVote(active)}
        <Table>
          <thead className="thead-dark">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Address</th>
              <th scope="col">Vote</th>
              <th scope="col">Live Vote</th>
              <th scope="col">Percent</th>
            </tr>
          </thead>
          <tbody>
            {
              delegates.map((v, index) => {
                return (
                  <tr key={index}>
                    <td scope="row">
                      <AccountLink address={v.address} text={v.name} />
                    </td>
                    <td>
                      <AccountLink address={v.address} />
                    </td>
                    <td>{v.round_vote}</td>
                    <td>{v.total_vote}</td>
                    <td>{"0" === v.total_vote ? 0 : (v.total_vote / allvote).toFixed(2)}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Vote);