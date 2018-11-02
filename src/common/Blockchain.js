import crypto from 'crypto';
import RIPEMD160 from 'ripemd160';
import {encode as bs58Encode} from 'bs58check';
import {ec as EC} from 'elliptic';
import scrypt from 'scryptsy';
import keccak from 'keccak';

const Int64 = require('int64-buffer').Int64LE;

export const getTxTypeString = (tx) => {
  switch (tx) {
    case 1: return "RewardTransaction";
    case 2: return "TransferTransaction";
    case 3: return "VoteTransaction";
    case 4: return "RegisterDelegateTransaction";
    case 5: return "OtherSignTransaction";
    case 6: return "SignTransaction";
    case 7: return "LockTransaction";
    case 8: return "UnlockTransaction";
    default: return "Uknown Transaction";
  }
}

export const toFixed8 = (v) => {
  if (isNaN(v)) {
    return false;
  }
  let str = String(v);
  while (str.length < 9) {
    str = '0' + str;
  }

  return str.slice(0, str.length - 8) + '.' + str.slice(str.length - 8);
}

export const toFixed8Long = (str) => {
  if (isNaN(str)) {
    return undefined;
  }
  let idx = str.indexOf('.');
  let fixedLength = idx === -1 ? 0 : str.length - idx - 1;
  if (8 < fixedLength) {
    return undefined;
  }
  str = str.replace('.', '');
  while (fixedLength < 8) {
    str += '0';
    ++fixedLength;
  }
  return new Int64(str);
}

export const getPubKeyFromPriKey = (prikey) => {
  let ec = new EC('secp256k1');
  let key = ec.keyFromPrivate(prikey, 'bytes');
  let pubkey = key.getPublic();
  let x = pubkey.x;
  let y = pubkey.y;
  let xhex = x.toString('hex');
  while (xhex.length < 64) {
    xhex = "0" + xhex;
  }
  let yhex = y.toString('hex');
  while (yhex.length < 64) {
    yhex = "0" + yhex;
  }
  let pubkeyhex = "04" + xhex + yhex;
  return new Buffer(pubkeyhex, 'hex');
}

export const getAddressFromPubKey = (pubkey) => {
  let buf = new Buffer(21);
  buf[0] = 0;
  let sha = crypto.createHash('sha256').update(pubkey).digest();
  let rip = new RIPEMD160().update(sha).digest();
  rip.copy(buf, 1, 0, 20);
  return bs58Encode(buf);
}

export const getAddressFromAddressHash = (hash) => {
  let buf = new Buffer(21);
  buf[0] = 0;
  if (typeof(hash) === 'string') {
    hash = new Buffer(hash, 'hex');
  }
  hash.copy(buf, 1, 0, 20);
  return bs58Encode(buf); 
}

export const generatePrivateKey = () => {
  let ec = new EC('secp256k1');
  let key = ec.genKeyPair();
  let priKey = key.getPrivate();
  let priKeyHex = priKey.toString('hex');
  while (priKeyHex.length < 64) {
    priKeyHex = "0" + priKeyHex;
  }
  return new Buffer(priKeyHex, "hex");
}

export const generateAccount = () => {
  let prikey = generatePrivateKey();
  let pubkey = getPubKeyFromPriKey(prikey);
  let address = getAddressFromPubKey(pubkey);

  return {
    privateKey : prikey.toString('hex'),
    address: address
  }
}

export const encryptKey = (password, params, alg = "scrypt") => {
  if (alg === "scrypt") {
    return scrypt(new Buffer(password, 'utf8'), new Buffer(params.salt, 'hex'), params.n, params.r, params.p, params.dklen);
  }
  else
    return null;
}

export const encryptString = (text, key, iv, alg = "aes-128-ctr") => {
  if (typeof text === "string")
    text = new Buffer(text, "hex");
    if (typeof iv === "string")
    iv = new Buffer(iv, "hex");

  let cipher = crypto.createCipheriv(alg, key.slice(0, 16), iv);
  let ciphertext = cipher.update(text);
  return Buffer.concat([ciphertext, cipher.final()]).toString('hex');
}

export const generateMac = (text, password) => {
  let buf = Buffer.concat([password.slice(16, 32), new Buffer(text, 'hex')]);
  return keccak('keccak256').update(buf).digest().toString('hex');
}

export const decryptString = (text, key, iv, alg = "aes-128-ctr") => {
  if (typeof text === "string")
    text = new Buffer(text, "hex");
  if (typeof iv === "string")
    iv = new Buffer(iv, "hex");

  let decipher = crypto.createDecipheriv(alg, key.slice(0, 16), iv);
  let deciphertext = decipher.update(text);
  return Buffer.concat([deciphertext, decipher.final()]).toString('hex');
}