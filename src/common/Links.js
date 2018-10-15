import React from 'react';
import {Link} from "react-router-dom";

export const TransactionLink = ({hash, text}) => (
  <Link to={`/transaction/${hash}`}>{text}</Link>
);

export const BlockLink = ({hash, text}) => (
  <Link to={`/block/${hash}`}>{text}</Link>
);

export const AccountLink = ({address, text}) => (
  <Link to={`/account/${address}`}>{text}</Link>
);