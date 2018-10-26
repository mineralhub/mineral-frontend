import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import { connect } from "react-redux";

class InputPasswordModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: ''
    };
  }

  onChangePassword = (e) => {
    this.setPassword(e.target.value);
  }

  onConfirm = () => {
    let { onConfirm } = this.props;
    onConfirm(this.state.password);
    this.setPassword('');
  }

  onClose = () => {
    let { onClose } = this.props;
    onClose();
    this.setPassword('');
  }

  isConfirmValid = () => {
    return this.state.password !== '';
  }

  setPassword = (v) => {
    this.setState({
      password: v
    });
  }

  render() {
    let { isOpen } = this.props;
    return (
      <div>
        <Modal isOpen={isOpen} className={this.props.className}>
          <ModalHeader>Input Keystore Password</ModalHeader>
          <ModalBody>
            <Label>Password</Label>
            <Input 
              type="password" 
              placeholder="input keystore password" 
              onChange = {this.onChangePassword} 
            />
          </ModalBody>
          <ModalFooter>
            <Button 
              color="primary" 
              onClick={this.onConfirm}
              disabled={!this.isConfirmValid()}
            >
            Login
            </Button>
            <Button color="secondary" onClick={this.onClose}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    
  };
};

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(InputPasswordModal);