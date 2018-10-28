const {RewardTransaction, TransferTransaction, TransactionBase, Transaction} = require("./common/Transaction");
const Int64 = require('int64-buffer').Int64BE;

let addr = '12AKRNHpFhDSBDD9rSn74VAzZSL3774PxQ';

function UnitTest(type, txdata) {
  console.log('----- unit test : ' + type);
  console.log(txdata.toBuffer());
  console.log(txdata.toBuffer().length);
  console.log(txdata.toBuffer().length === txdata.size());
}

let base = new TransactionBase();
base.from = addr;
UnitTest('base', base);

let reward = new RewardTransaction();
reward.from = addr;
UnitTest('reward', reward);

let transfer = new TransferTransaction();
transfer.from = addr;
transfer.to[addr] = new Int64(10000000);
UnitTest('trasfer', transfer);