import React from 'react';
import {Link} from "react-router-dom";

export const TransactionLink = ({hash, text=hash}) => (
  <Link to={`/transaction/${hash}`}>{text}</Link>
);

export const BlockLink = ({height, text=height}) => (
  <Link to={`/block/${height}`}>{text}</Link>
);

export const AccountLink = ({address, text=address, className=""}) => (
  <Link className={className} to={`/account/${address}`}>{text}</Link>
);

export const CreateAccountLink = ({text='Create Account'}) => (
  <Link className="btn btn-primary btn-block" to="/account/create">{text}</Link>
);

export const RegisterDelegateLink = ({text='Register Delegate'}) => (
  <Link className="btn btn-primary btn-block mt-3" to={`/delegate/register`}>{text}</Link>
);