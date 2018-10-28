const Int64 = require('int64-buffer').Int64BE;
const base58Check = require('bs58check');

var TransactionType = {
  None: 0,
  Reward: 1,
  Transfer: 2,
  Vote: 3,
  RegisterDelegate: 4,
  OtherSign: 5,
  Sign: 6,
  Lock: 7,
  Unlock: 8
}

var addrToHash = (addr) => {
  let buf = base58Check.decode(addr);
  if (buf.length != 21)
    return null;
  let result = Buffer.alloc(20);
  buf.copy(result, 0, 1, 21);
  return result;
}

class TransactionBase {
  constructor() {
    this.fee = new Int64(0); // 8 byte (Fixed8)
    this.from = undefined; // 20 byte (UInt160 address hash)
  }

  size() {
    return 8 + 20;
  }

  toBuffer() {
    let buf = Buffer.alloc(28);
    this.fee.toBuffer().copy(buf, 0);
    addrToHash(this.from).copy(buf, 8);
    return buf;
  }
}

class RewardTransaction extends TransactionBase {
  constructor() {
    super();
    this.reward = new Int64(); // 8 byte (Fixed8)
  }

  size() {
    return super.size() + 8;
  }

  toBuffer() {
    let buf = Buffer.alloc(this.size(), super.toBuffer());
    this.reward.toBuffer().copy(buf, super.size());
    return buf;
  }
}

class TransferTransaction extends TransactionBase {
  constructor() {
    super();
    this.to = {}; // key: 20 byte (UInt160 address hash), value : 8 byte (Fixed8) = 28 * n
  }

  size() {
    return super.size() + Object.keys(this.to).length * 28;
  }

  toBuffer() {
    let buf = Buffer.alloc(this.size(), super.toBuffer());
    let cursor = super.size();
    for (let addr in this.to) {
      addrToHash(addr).copy(buf, cursor);
      cursor += 20;
      this.to[addr].toBuffer().copy(buf, cursor);
      cursor += 8;      
    }
    return buf;
  }
}

class Transaction {
  constructor(type = TransactionType.None) {
    this.version = 0;
    this.type = type;
    this.timestamp = 0;
    this.data = undefined;
    this.signature = undefined;
    this.pubkey = undefined;
  }

  toBuffer() {

  }
}

module.exports = {
  TransactionBase,
  RewardTransaction,
  TransferTransaction,
  Transaction
}