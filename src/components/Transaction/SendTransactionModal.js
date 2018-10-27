import React, { Component } from 'react';
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';

class SendTransactionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      to: '',
      amount: ''
    };
  }

  clear = () => {
    this.setState({to: '', amount: ''});
  }

  onConfirm = () => {
    let { onConfirm } = this.props;
    onConfirm(this.state);
    this.clear();
  }

  onClose = () => {
    let { onClose } = this.props;
    onClose();
    this.clear();
  }

  isConfirmValid = () => {
    return this.state.to !== '' && this.state.amount !== '';
  }

  render() {
    let { isOpen } = this.props;
    return (
      <div>
      <Modal isOpen={isOpen} className={this.props.className}>
        <ModalHeader>Send Transaction</ModalHeader>
        <ModalBody>
          <Label>To Address</Label>
          <Input 
            type="text" 
            placeholder="address" 
            onChange = {(e) => {
              this.setState({to:e.target.value});
            }}
          />
          <Label>Amount</Label>
          <Input
            type="text"
            placeholder="0.00000000"
            onChange = {(e) => {
              this.setState({amount:e.target.value});
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button 
            color="primary" 
            onClick={this.onConfirm}
            disabled={!this.isConfirmValid()}
          >
          Send
          </Button>
          <Button color="secondary" onClick={this.onClose}>Cancel</Button>
        </ModalFooter>
      </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(SendTransactionModal);