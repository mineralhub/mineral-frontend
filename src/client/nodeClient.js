const axios = require('axios');
var host = 'http://127.0.0.1:8080';

exports.ErrorCode = {
  E_TX_NOT_ENOUGH_LOCKBALANCE: 2000,
  E_TX_NO_LOCK_BALANCE: 2001,
  E_TX_LOCK_VALUE_CANNOT_NEGATIVE: 2002,
  E_TX_LOCK_TTL_NOT_ARRIVED: 2003,

  E_TX_VOTE_TTL_NOT_ARRIVED: 2100,
  E_TX_VOTE_OVERCOUNT: 2101,

  E_TX_DELEGATE_NAME_INVALID: 2200,
  E_TX_DELEGATE_ALREADY_REGISTER: 2201
}

exports.loadBalance = (address) => {
  return new Promise((resolve, reject) => {
    axios.get(`${host}/account/balance/${address}`)
    .then((res) => {
      resolve(res);
    })
    .catch((e) => {
      reject(e);
    });
  });
}

exports.loadAccount = (address) => {
  return new Promise((resolve, reject) => {
    axios.get(`${host}/account/${address}`)
    .then((res) => {
      resolve(res);
    })
    .catch((e) => {
      reject(e);
    });
  });
}

exports.loadTransaction = (hash) => {
  return new Promise((resolve, reject) => {
    axios.get(`${host}/transaction/${hash}`)
    .then((res) => {
      resolve(res);
    })
    .catch((e) => {
      reject(e);
    })
  });
}

exports.loadTransactionFromAddress = (address, page) => {
  return new Promise((resolve, reject) => {
    axios.get(`${host}/transaction/${address}/${page}`)
    .then((res) => {
      resolve(res);
    })
    .catch((e) => {
      reject(e);
    })
  });
}

exports.loadBlock = (height) => {
  return new Promise((resolve, reject) => {
    axios.get(`${host}/block/${height}`)
    .then((res) => {
      resolve(res);
    })
    .catch((e) => {
      reject(e);
    })
  });
}

exports.loadDelegates = () => {
  return new Promise((resolve, reject) => {
    axios.get(`${host}/delegate/all`)
    .then((res) => {
      resolve(res);
    })
    .catch((e) => {
      reject(e);
    })
  });
}

exports.addTransaction = (bytes) => {
  return new Promise((resolve, reject) => {
    axios.post(`${host}/transaction/add`, { 
      bytes: bytes
    })
    .then((res) => {
      if (res.data.error) {
        throw res.data.error;
      }
      resolve(res.data);
    })
    .catch((e) => {
      reject(e);
    })
  });
}