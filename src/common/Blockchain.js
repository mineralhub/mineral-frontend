import { randomBytes, createHash } from 'crypto';
import RIPEMD160 from 'ripemd160';
import {encode as bs58Encode, decode as bs58Decode} from 'bs58check';

export const getTxTypeString = (tx) => {
  switch (tx) {
    case 1: return "RewardTransaction";
    case 2: return "TransferTransaction";
    case 3: return "VoteTransaction";
    case 4: return "RegisterDelegateTransaction";
    case 5: return "OtherSignTransaction";
    case 6: return "SignTransaction";
  }
  return "Uknown Transaction";
}

export const LongToSatosi = (v) => {
  return Number(v / 100000000).toFixed(8);
}

export const PubKeyToAddress = (pubkey) => {
  console.log(pubkey.toString('hex'));
  let buf = new Buffer(21);
  buf[0] = 0;
  let sha = createHash('sha256').update(pubkey).digest();
  let rip = new RIPEMD160().update(sha).digest();
  rip.copy(buf, 1, 0, 20);
  return bs58Encode(buf);
}

export const AddressHashToAddress = (hash) => {
  let buf = new Buffer(21);
  buf[0] = 0;
  if (typeof(hash) === 'string') {
    hash = new Buffer(hash, 'hex');
  }
  hash.copy(buf, 1, 0, 20);
  return bs58Encode(buf); 
}