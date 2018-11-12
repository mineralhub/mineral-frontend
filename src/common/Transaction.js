const Int64 = require('int64-buffer').Int64LE;
const EC = require('elliptic').ec;
const crypto = require('crypto');
const blockchain = require('./blockchain');

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

const DefaultFee = 100000000;
const RegisterDelegateFee = DefaultFee * 10000;
const VoteFee = 100000000;

var EnumToString = (e, v) => {
  for (let k in e) {
    if (e[k] === v) 
      return k;
  }
  return null;
}

class TransactionBase {
  constructor(from) {
    this.fee = new Int64(DefaultFee); // 8 byte (Fixed8)
    this.from = from; // 20 byte (UInt160 address hash)
  }

  size() {
    return 8 + 20;
  }

  toBuffer() {
    let buf = Buffer.alloc(28);
    this.fee.toBuffer().copy(buf, 0);
    blockchain.toAddressHash(this.from).copy(buf, 8);
    return buf;
  }
}

class RewardTransaction extends TransactionBase {
  constructor(from) {
    super(from);
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
  constructor(from) {
    super(from);
    this.to = {}; // key: 20 byte (UInt160 address hash), value : 8 byte (Fixed8) = 28 * n
  }

  size() {
    return super.size() 
      + 4 // to. length
      + Object.keys(this.to).length * 28; // to. key & value
  }

  toBuffer() {
    let buf = Buffer.alloc(this.size(), super.toBuffer());
    let cursor = super.size();
    buf.writeInt32LE(Object.keys(this.to).length, cursor);
    cursor += 4;
    for (let addr in this.to) {
      blockchain.toAddressHash(addr).copy(buf, cursor);
      cursor += 20;
      this.to[addr].toBuffer().copy(buf, cursor);
      cursor += 8;
    }
    return buf;
  }
}

class VoteTransaction extends TransactionBase {
  constructor(from) {
    super(from);
    this.fee = new Int64(VoteFee);
    this.votes = {}; // key: 20 byte (UInt160 address hash), value : 8 byte (Fixed8) = 28 * n
  }

  size() {
    return super.size() 
      + 4 // votes. length
      + Object.keys(this.votes).length * 28; // votes. key & value
  }

  toBuffer() {
    let buf = Buffer.alloc(this.size(), super.toBuffer());
    let cursor = super.size();
    buf.writeInt32LE(Object.keys(this.votes).length, cursor);
    cursor += 4;
    for (let addr in this.votes) {
      blockchain.toAddressHash(addr).copy(buf, cursor);
      cursor += 20;
      this.votes[addr].toBuffer().copy(buf, cursor);
      cursor += 8;
    }
    return buf;
  }
}

class RegisterDelegateTransaction extends TransactionBase {
  constructor(from) {
    super(from);
    this.fee = new Int64(RegisterDelegateFee);
    this.name = undefined; // dynamic size (byte array)
  }
  
  size() {
    return super.size() 
      + 4 // name. byte length
      + this.name.length; // name.
  }

  toBuffer() {
    let buf = Buffer.alloc(this.size(), super.toBuffer());
    let cursor = super.size();
    buf.writeInt32LE(this.name.length, cursor);
    cursor += 4;
    this.name.copy(buf, cursor);
    return buf;
  }
}

class OtherSignTransaction extends TransactionBase {
  constructor(from) {
    super(from);
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
    return super.size() 
      + 4 // to. length
      + Object.keys(this.to).length * 28 // to. key & value
      + 4 // others. length
      + this.othersSize() // others.
      + 4;
  }

  toBuffer() {
    let buf = Buffer.alloc(this.size(), super.toBuffer());
    let cursor = super.size();
    buf.writeInt32LE(this.to.length, cursor);
    cursor += 4;
    for (let addr in this.to) {
      blockchain.toAddressHash(addr).copy(buf, cursor);
      cursor += 20;
      this.to[addr].toBuffer().copy(buf, cursor);
      cursor += 8;      
    }
    buf.writeInt32LE(this.others.length, cursor);
    cursor += 4;
    for (let i = 0; i < this.others.length; ++i) {
      buf.write(this.others[i], cursor);
      cursor += this.others[i].length;
    }
    buf.writeInt32LE(this.expirationBlockHeight, cursor);
    return buf;
  }
}

class SignTransaction extends TransactionBase {
  constructor(from) {
    super(from);
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
  constructor(from) {
    super(from);
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
  size() {
    return super.size();
  }

  toBuffer() {
    return super.toBuffer();
  }
}

class Transaction {
  constructor(type = TransactionType.None, data = undefined) {
    this.version = 0; // 2 byte (short)
    this.type = type; // 2 byte (short)
    this.timestamp = 0; // 4 byte (integer)
    this.data = data; // dynamic size
    this.signature = undefined;
    this.pubkey = undefined;
  }

  size() {
    return 2 // version
      + 2 // type
      + 4 // timestamp
      + this.data.size() // data
      + 4 // signature. length
      + this.signature.length  // signature
      + 4 // pubkey. length
      + this.pubkey.length; // pubkey
  }

  sizeUnsigned() {
    return 2 + 2 + 4 + this.data.size();
  }

  toBuffer() {
    let buf = Buffer.alloc(this.size(), this.toBufferUnsigned());
    let cursor = this.sizeUnsigned();
    buf.writeInt32LE(this.signature.length, cursor);
    cursor += 4;
    this.signature.copy(buf, cursor);
    cursor += this.signature.length;
    buf.writeInt32LE(this.pubkey.length, cursor);
    cursor += 4;
    this.pubkey.copy(buf, cursor);
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

  setTimestamp() {
    this.timestamp = Date.now() / 1000;
  }

  sign(prikey) {
    let ec = new EC('secp256k1');
    let bufUnsigned = this.toBufferUnsigned();
    let hash = crypto.createHash('sha256').update(bufUnsigned).digest();
    let key = ec.keyFromPrivate(prikey, 'hex');
    this.signature = Buffer.from(ec.sign(hash, key).toDER());
    this.pubkey = Buffer.from(key.getPublic().encode());
  }

  verify() {
    let ec = new EC('secp256k1');
    let bufUnsigned = this.toBufferUnsigned();
    let hash = crypto.createHash('sha256').update(bufUnsigned).digest();
    let key = ec.keyFromPublic(this.pubkey);
    return ec.verify(hash, this.signature, key);
  }
}

module.exports = {
  TransactionType,
  EnumToString,
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