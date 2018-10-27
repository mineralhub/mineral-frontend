const axios = require('axios');
var host = 'http://127.0.0.1:80';

exports.loadBalance = (address) => {
  return new Promise((resolve, reject) => {
    axios.get(`${host}/account/balance/${address}`).then((res) => {
      resolve(res);
    }).catch((e) => {
      reject(e);
    });
  });
}

exports.loadAccount = (address) => {
  return new Promise((resolve, reject) => {
    axios.get(`${host}/account/${address}`).then((res) => {
      resolve(res);
    }).catch((e) => {
      reject(e);
    });
  });
}

exports.loadTransaction = (hash) => {
  return new Promise((resolve, reject) => {
    axios.get(`${host}/transaction/${hash}`).then((res) => {
      resolve(res);
    }).catch((e) => {
      reject(e);
    })
  });
}

exports.loadTransactionFromAddress = (address, page) => {
  return new Promise((resolve, reject) => {
    axios.get(`${host}/transaction/${address}/${page}`).then((res) => {
      resolve(res);
    }).catch((e) => {
      reject(e);
    })
  });
}

exports.loadBlock = (height) => {
  return new Promise((resolve, reject) => {
    axios.get(`${host}/block/${height}`).then((res) => {
      resolve(res);
    }).catch((e) => {
      reject(e);
    })
  });
}