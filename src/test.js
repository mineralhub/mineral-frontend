const {RewardTransaction, 
  TransferTransaction, 
  VoteTransaction,
  RegisterDelegateTransaction,
  OtherSignTransaction,
  SignTransaction,
  LockTransaction,
  UnlockTransaction,
  TransactionBase, 
  Transaction, 
  TransactionType} = require("./common/Transaction");
const Int64 = require('int64-buffer').Int64LE;

let addr = '12AKRNHpFhDSBDD9rSn74VAzZSL3774PxQ';

function baseUnitTest(type, txdata) {
  console.log('----- transaction base unit test : ' + type);
  console.log(txdata.toBuffer());
  console.log(txdata.toBuffer().length);
  console.log(txdata.toBuffer().length === txdata.size());
}

let base = new TransactionBase(addr);
baseUnitTest('base', base);

let reward = new RewardTransaction(addr);
reward.reward = new Int64(25000000000);
baseUnitTest('reward', reward);

let transfer = new TransferTransaction(addr);
transfer.to[addr] = new Int64(10000000);
baseUnitTest('trasfer', transfer);

let vote = new VoteTransaction(addr);
vote.votes[addr] = new Int64(10000000);
baseUnitTest('vote', vote);

let delegate = new RegisterDelegateTransaction(addr);
delegate.name = Buffer.from('one');
baseUnitTest('delegate', delegate);

let otherSign = new OtherSignTransaction(addr);
otherSign.to[addr] = new Int64(1000);
otherSign.others.push(addr);
otherSign.expirationBlockHeight = 100000;
baseUnitTest('otherSign', otherSign);

let sign = new SignTransaction(addr);
sign.signTxHash = Buffer.alloc(32);
baseUnitTest('sign', sign);

let lock = new LockTransaction(addr);
lock.lockValue = new Int64(1000000);
baseUnitTest('lock', lock);

let unlock = new UnlockTransaction(addr);
baseUnitTest('unlock', unlock);

console.log('----- transaction unit test');
let transaction = new Transaction(TransactionType.Transfer);
transaction.data = transfer;
transaction.sign('6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b');
transaction.verify();

const fs = require('fs');
var stream = fs.createWriteStream('./sha-tx.txt');
stream.write(transaction.toBuffer());
stream.end();

console.log('tx unsigned length : ' + transaction.sizeUnsigned());
console.log('tx signature length : ' + transaction.signature.length);
console.log('tx pubkey length : ' + transaction.pubkey.length);
console.log(transaction.toBuffer().length === transaction.size());
transfer.toBuffer();