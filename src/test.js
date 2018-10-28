const {RewardTransaction, TransactionBase, Transaction} = require("./common/Transaction");

var tx = new RewardTransaction();
tx.from = '12AKRNHpFhDSBDD9rSn74VAzZSL3774PxQ';
let buf = tx.toBuffer();
console.log(buf);