import React, { Component } from 'react';
import { connect } from "react-redux";
import { showKeystoreInputModal, showSendTransactionModal, showLockTransactionModal, showUnlockTransactionModal } from '../../actions/app';
import { login, logout } from '../../actions/account';
import { AccountLink, CreateAccountLink, RegisterDelegateLink } from '../../common/Links';
import { toFixed8 } from '../../common/Blockchain';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { readFileContentsFromEvent, KEYSTORE_EXTENSION } from '../../common/File';
import { Label, Button } from 'reactstrap';

class Header extends Component {
  constructor(props) {
    super(props);

    this.fileRef = React.createRef();

    this.state = {
      privateKey: ''
    }
  }

  onChangePrivateKey = (e) => {
    this.setState({
      privateKey: e.target.value
    });
  }

  onClickLogin = () => {
    let { privateKey } = this.state;
    this.props.login(privateKey).then(() => {
      toast.success("Success Login", { position: toast.POSITION.BOTTOM_RIGHT });
    });
  }

  onClickOpenKeystore = () => {
    this.selectFile();
  }

  selectFile = () => {
    this.fileRef.current.click();
  }

  onSelectedFile = async (e) => {
    let content = await readFileContentsFromEvent(e);
    this.fileRef.current.value = '';
    this.props.showKeystoreInputModal(content);
  }

  isLoginValid = () => {
    let { privateKey } = this.state;
    if (!privateKey || privateKey.length !== 64) {
      return false;
    }
    return true;
  }

  onSendTransaction = () => {
    this.props.showSendTransactionModal(true);
  }

  onLockTransaction = () => {
    this.props.showLockTransactionModal(true);
  }

  onUnlockTransaction = () => {
    this.props.showUnlockTransactionModal(true);
  }

  onClickLogout = () => {
    this.props.logout();
    this.setState({
      privateKey: ''
    });

    toast.success("Success Logout", { position: toast.POSITION.BOTTOM_RIGHT });
  }

  renderBalance = () => {
    let { active } = this.props;
    if (active.balance !== undefined) {
      return (
        <div>
          <Label style={{display:"block"}}>balance : {toFixed8(active.balance)}</Label>
          <Label style={{display:"block", lineHeight:"0em"}}>lock : {toFixed8(active.lock)}</Label>
        </div>
      )
    } else {
      return (
        <div>
          <Label style={{display:"block"}}>balance : LOADING...</Label>
          <Label style={{display:"block", lineHeight:"0em"}}>lock : LOADING...</Label>
        </div>
      )
    }
  }

  renderAccount = () => {
    let { active } = this.props;
    console.log(active);
    if (active.address) {
      return (
        <div className="collapse navbar-collapse dual-collapse2">
          <ul className="nav navbar-nav flex-row justify-content-between ml-auto">
            <li className="dropdown order-1">
              <Button type="button" id="dropdownMenu1" data-toggle="dropdown" className="btn btn-outline-secondary dropdown-toggle">Account<span className="caret"></span></Button>
              <ul className="dropdown-menu dropdown-menu-right mt-2" style={{ width: 320 }}>
                <li className="px-3 py-2 mb-2">
                  <div className="text-center">
                    <small>
                      <AccountLink address={active.address} text={active.address} />
                      {this.renderBalance()}
                    </small>
                  </div>
                  <Button
                    color="primary" 
                    className="btn btn-block mt-3"
                    onClick={this.onSendTransaction}>
                    Send
                  </Button>
                  <Button
                    color="primary" 
                    className="btn btn-block mt-3"
                    onClick={this.onLockTransaction}>
                    Lock
                  </Button>
                  <Button
                    color="primary" 
                    className="btn btn-block mt-3"
                    disabled={active.lock === "0"}
                    onClick={this.onUnlockTransaction}>
                    Unlock
                  </Button>                  
                  <RegisterDelegateLink />
                  <Button
                    color="primary" 
                    className="btn btn-block mt-3"
                    onClick={this.onClickLogout}>
                    Logout
                  </Button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="collapse navbar-collapse dual-collapse2">
          <ul className="nav navbar-nav flex-row justify-content-between ml-auto">
            <li className="dropdown order-1">
              <Button type="button" id="dropdownMenu1" data-toggle="dropdown" className="btn btn-outline-secondary dropdown-toggle">Login<span className="caret"></span></Button>
              <ul className="dropdown-menu dropdown-menu-right mt-2" style={{ width: 320 }}>
                <li className="px-3 py-2 mb-2">
                  <div className="form-group">
                    <div className="text-center"><p>Private Key</p></div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="input private key"
                      onChange={this.onChangePrivateKey}>
                    </input>
                    <Button
                    color="primary"
                    className="btn-block mt-3"
                    disabled={!this.isLoginValid()}
                    onClick={this.onClickLogin}>
                    Login
                    </Button>
                  </div>
                  <hr />
                  <div className="form-group">
                    <div className="text-center"><p>Keystore File</p></div>
                    <Button
                    color="primary"
                    className="btn-block mt-3"
                    onClick={this.onClickOpenKeystore}>
                    Open Keystore
                    </Button>
                    <input type="file" ref={this.fileRef} className="d-none"
                      onChange={this.onSelectedFile}
                      accept={KEYSTORE_EXTENSION} />
                  </div>
                  <hr />
                  <CreateAccountLink />
                </li>
              </ul>
            </li>
          </ul>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <Link to='/' className="navbar-brand">Mineral Explorer</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse dual-collapse2">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link to='/' className="nav-link">Home</Link>
            </li>
          </ul>
        </div>
        {this.renderAccount()}
      </nav>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account,
    active: state.account.active
  };
};

const mapDispatchToProps = {
  login,
  logout,
  showKeystoreInputModal,
  showSendTransactionModal,
  showLockTransactionModal,
  showUnlockTransactionModal
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);