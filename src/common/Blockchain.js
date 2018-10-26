import crypto from 'crypto';
import RIPEMD160 from 'ripemd160';
import {encode as bs58Encode, decode as bs58Decode} from 'bs58check';
import {ec as EC} from 'elliptic';
import scrypt from 'scryptsy';
import keccak from 'keccak';

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

export const longToSatosi = (v) => {
  if (0 < v)
    return Number(v / 100000000).toFixed(8);
  return Number(0).toFixed(8);
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