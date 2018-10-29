const Int64 = require('int64-buffer').Int64LE;
const base58Check = require('bs58check');
const EC = require('elliptic').ec;

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
    this.fee = undefined; // 8 byte (Fixed8)
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
    this.reward = undefined; // 8 byte (Fixed8)
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

class VoteTransaction extends TransactionBase {
  constructor() {
    super();
    this.votes = {}; // key: 20 byte (UInt160 address hash), value : 8 byte (Fixed8) = 28 * n
  }

  size() {
    return super.size() + Object.keys(this.votes).length * 28;
  }

  toBuffer() {
    let buf = Buffer.alloc(this.size(), super.toBuffer());
    let cursor = super.size();
    for (let addr in this.votes) {
      addrToHash(addr).copy(buf, cursor);
      cursor += 20;
      this.votes[addr].toBuffer().copy(buf, cursor);
      cursor += 8;
    }
    return buf;
  }
}

class RegisterDelegateTransaction extends TransactionBase {
  constructor() {
    super();
    this.name = undefined; // dynamic size (byte array)
  }
  
  size() {
    return super.size() + this.name.length;
  }

  toBuffer() {
    let buf = Buffer.alloc(this.size(), super.toBuffer());
    this.name.copy(buf, super.size());
    return buf;
  }
}

class OtherSignTransaction extends TransactionBase {
  constructor() {
    super();
    this.to = {}; // key: 20 byte (UInt160 address hash), value : 8 byte (Fixed8) = 28 * n
    this.others = []; // dynamic size (string array)
    this.expirationBlockHeight = 0; // 4 byte (integer)
  }

  othersSize() {
    let size = 0;
    for (let i = 0; i < this.others.length; ++i) {
      size += this.others[i].length;
    }
    return size;
  }

  size() {
    return super.size() + Object.keys(this.to).length * 28 + this.othersSize() + 4;
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
    for (let i = 0; i < this.others.length; ++i) {
      buf.write(this.others[i], cursor);
      cursor += this.others[i].length;
    }
    buf.writeInt32LE(this.expirationBlockHeight, cursor);
    return buf;
  }
}

class SignTransaction extends TransactionBase {
  constructor() {
    super();
    this.signTxHash = undefined; // 32 byte (UInt256)
  }

  size() {
    return super.size() + 32;
  }

  toBuffer() {
    let buf = Buffer.alloc(this.size(), super.toBuffer());
    this.signTxHash.copy(buf, super.size());
    return buf;
  }
}

class LockTransaction extends TransactionBase {
  constructor() {
    super();
    this.lockValue = undefined; // 8 byte (Fixed8)
  }

  size() {
    return super.size() + 8;
  }

  toBuffer() {
    let buf = Buffer.alloc(this.size(), super.toBuffer());
    this.lockValue.toBuffer().copy(buf, super.size());
    return buf;
  }
}

class UnlockTransaction extends TransactionBase {
  constructor() {
    super();
  }

  size() {
    return super.size();
  }

  toBuffer() {
    return super.toBuffer();
  }
}

class Transaction {
  constructor(type = TransactionType.None) {
    this.version = 0; // 2 byte (short)
    this.type = type; // 2 byte (short)
    this.timestamp = 0; // 4 byte (integer)
    this.data = undefined; // dynamic size
    this.signature = undefined;
    this.pubkey = undefined;
  }

  size() {
    return 2 + 2 + 4 + this.data.size() + this.signature.length + this.pubkey.length;
  }

  sizeUnsigned() {
    return 2 + 2 + 4 + this.data.size();
  }

  toBuffer() {
    let buf = Buffer.alloc(this.size(), this.toBufferUnsigned());
    this.signature.copy(buf, this.sizeUnsigned());
    this.pubkey.copy(buf, this.sizeUnsigned() + this.signature.length);
    return buf;
  }

  toBufferUnsigned() {
    let buf = Buffer.alloc(this.sizeUnsigned());
    buf.writeInt16LE(this.version, 0);
    buf.writeInt16LE(this.type, 2);
    buf.writeInt32LE(this.timestamp, 4);
    this.data.toBuffer().copy(buf, 8);
    return buf;
  }

  sign(prikey) {
    let bufUnsigned = this.toBufferUnsigned();
    let ec = new EC('secp256k1');
    let key = ec.keyFromPrivate(prikey, 'hex');
    this.signature = Buffer.from(ec.sign(bufUnsigned, key).toDER(), 'hex');
    this.pubkey = Buffer.from(key.getPublic().encode('hex'), 'hex');
  }
}

module.exports = {
  TransactionType,
  TransactionBase,
  RewardTransaction,
  TransferTransaction,
  VoteTransaction,
  RegisterDelegateTransaction,
  OtherSignTransaction,
  SignTransaction,
  LockTransaction,
  UnlockTransaction,
  Transaction
}