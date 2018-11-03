import React, { Component } from 'react';
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';

class UnlockTransactionModal extends Component {
  constructor(props) {
    super(props);
  }

  onConfirm = () => {
    let { onConfirm } = this.props;
    onConfirm();
  }

  onClose = () => {
    let { onClose } = this.props;
    onClose();
  }

  render() {
    let { isOpen } = this.props;
    return (
      <div>
      <Modal isOpen={isOpen} className={this.props.className}>
        <ModalHeader>Unlock Transaction</ModalHeader>
        <ModalBody>
          <Label>All votes will be taken back.</Label>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="primary" 
            onClick={this.onConfirm}
          >
          Unlock
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

export default connect(mapStateToProps, mapDispatchToProps)(UnlockTransactionModal);