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

let base = new TransactionBase();
base.fee = new Int64(0);
base.from = addr;
baseUnitTest('base', base);

let reward = new RewardTransaction();
reward.fee = new Int64(0);
reward.from = addr;
reward.reward = new Int64(25000000000);
baseUnitTest('reward', reward);

let transfer = new TransferTransaction();
transfer.fee = new Int64(0);
transfer.from = addr;
transfer.to[addr] = new Int64(10000000);
baseUnitTest('trasfer', transfer);

let vote = new VoteTransaction();
vote.fee = new Int64(0);
vote.from = addr;
vote.votes[addr] = new Int64(10000000);
baseUnitTest('vote', vote);

let delegate = new RegisterDelegateTransaction();
delegate.fee = new Int64(0);
delegate.from = addr;
delegate.name = Buffer.from('one');
baseUnitTest('delegate', delegate);

let otherSign = new OtherSignTransaction();
otherSign.fee = new Int64(0);
otherSign.from = addr;
otherSign.to[addr] = new Int64(1000);
otherSign.others.push(addr);
otherSign.expirationBlockHeight = 100000;
baseUnitTest('otherSign', otherSign);

let sign = new SignTransaction();
sign.fee = new Int64(0);
sign.from = addr;
sign.signTxHash = Buffer.alloc(32);
baseUnitTest('sign', sign);

let lock = new LockTransaction();
lock.fee = new Int64(0);
lock.from = addr;
lock.lockValue = new Int64(1000000);
baseUnitTest('lock', lock);

let unlock = new UnlockTransaction();
unlock.fee = new Int64(0);
unlock.from = addr;
baseUnitTest('unlock', unlock);

console.log('----- transaction unit test');
let transaction = new Transaction(TransactionType.Transfer);
transaction.data = transfer;
transaction.sign('6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b');
console.log(transaction.toBuffer().length === transaction.size());