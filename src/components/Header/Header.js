import React, { Component } from 'react';
import { connect } from "react-redux";
import {login} from '../../actions/app';
import {AccountLink} from '../../common/Links';
import {Link} from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      privateKey: '',
    }
  }

  onChangeSearch = (e) => {
    this.setState({
      search: e.target.value
    })
  }

  onClickSearch = () => {
  }

  onChangePrivateKey = (e) => {
    this.setState({
      privateKey: e.target.value
    });
  }

  onClickLogin = () => {
    let {privateKey} = this.state;
    this.props.login(privateKey);
  }

  isLoginValid = () => {
    let {privateKey} = this.state;
    if (!privateKey || privateKey.length !== 64) {
      return false;
    }
    return true;
  }

  renderAccount = () => {
    let { account } = this.props;
    if (account.isLoggedIn) {
      return (
        <div className="collapse navbar-collapse dual-collapse2">
          <ul className="nav navbar-nav flex-row justify-content-between ml-auto">
            <li className="dropdown order-1">
              <button type="button" id="dropdownMenu1" data-toggle="dropdown" className="btn btn-outline-secondary dropdown-toggle">Account<span className="caret"></span></button>
              <ul className="dropdown-menu dropdown-menu-right mt-2" style={{ width: 320 }}>
                <li className="px-3 py-2 mb-2">
                  <small>
                  <AccountLink address={account.address} text={account.address} />
                  </small>
                  <button
                    type="button"
                    className="btn btn-primary btn-block mt-3"
                    onClick={this.onClickLogin}>
                    Logout
                </button>
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
              <button type="button" id="dropdownMenu1" data-toggle="dropdown" className="btn btn-outline-secondary dropdown-toggle">Login<span className="caret"></span></button>
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
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-block mt-3"
                    disabled={!this.isLoginValid()}
                    onClick={this.onClickLogin}>
                    Submit
                    </button>
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
        {this.renderAccount()};
      </nav>
    )
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account
  };
};

const mapDispatchToProps = {
  login
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);