import React, { Component } from 'react';
import { connect } from "react-redux";
import { Input, Label, Button } from 'reactstrap';
import { Config } from '../../common/Config';

class RegisterDelegate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    }
  }

  isConfirmValid = () => {
    return this.state.name !== '' && new Buffer(this.state.name, 'utf-8').length < Config.DelegateNameMaxLength;
  }

  onConfirm = () => {
    let { onConfirm } = this.props;
    onConfirm(this.state.name);
  }

  render() {
    return (
      <div>
        <div className="d-flex justify-content-center text-center">
          <div className="col-md-12">
            <h5>Register Delegate</h5>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="col-md-5">
            <div className="text-center">
              <Label>Name</Label>
              <Input
                type="text"
                placeholder="input delegate name"
                onChange={(e) => {
                  this.setState({ name: e.target.value });
                }}
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="mt-1">
            <Button
              color="primary"
              onClick={this.onConfirm}
              disabled={!this.isConfirmValid()}
            >
            Register
            </Button>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterDelegate);