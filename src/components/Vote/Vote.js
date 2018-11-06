import React, { Component } from 'react';
import { connect } from "react-redux";
import { Input, Label, Button } from 'reactstrap';
import { Config } from '../../common/Config';

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

  render() {
		let { delegates = [] } = this.props;
		console.log(delegates);
    return (
			<div>Vote!</div>
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